---
title: "spark streaming"
date: 2022-04-03T16:00:00-00:00
categories:
  - blog
tags:
  - spark streaming
---

In batch processing, at certain frequency batch jobs are run but in case we require that batch to be very very small (depending on requirement, lets say we have 5 mins frequency batch jobs) that would be equivalent to stream processing to give near real time. But still there will be some edge cases like how to handle below:

* some data might reach late
* if previous batch is still running
* batch failure

stream prosessing have additional set of problems to handle compared to batch processing. All these are provided by spark streaming.

* automatic looping of batches
* storing intermediate results
* combining result with previous batch result
* restart from same place (using checkpoint) in case of failure


### stream processing

* processing on continous flowing data, example card fraud detection, find something trending
* MapReduce can only work on batch, not streaming data, spark is general purpose and can also process streaming data
* data in spark is stored in rdd, but in streaming there is no static place where data is stored, its continously flowing in
* so we define stream size, lets say 1 hour and every 2 min we do something then new rdd will be created every 2 min and total 30 rdd will be created. each rdd may have more/less data. here 2 min is batch interval
* transformations will be performed on Dstream which does batch processing on all the rdds in Dstream
* with batch size of 1 sec it will be near real time

Dstream -> rdds -> messages
1 -> 30 -> data in the form of messages
we operate at Dstream level

**spark streaming**: traditional way (rdds)

example:

step 1. producer write to socket

```shell
#this will open socket and will accept messages
nc -lk 9998
```

step 2. consumer read from the same socket

```shell
#streaming requires 2 cores
spark-shell --master local[2]
```

```scala
import org.apache.spark._
import org.apache.spark.streaming._
import org.apache.spark.streaming.StreamingContext._
//streaming context is required
val ssc = new StreamingContext(sc, Seconds(5))
//lines here is Dstream
val lines = ssc.socketTextStream("localhost",9998)
val words = lines.flatMap(x => x.split(" "))
val pairs = words.map(x => (x,1))
val count = pairs.reduceByKey((x,y) => x+y)
count.print()
ssc.start()
```

**structured streaming**: dataframes/dataset


### types of transformations in streaming

**stateless**: like previous example, always calculate for new rdds, always done on single rdd. example all transformations used in batch like map, filter, reduceByKey, etc.

**stateful**: processing is done on multiple rdds together, this applies to only streaming data, is done on entire stream or windows

sum is stateless transformation, if we need running total than we need to use stateful transformation like 

input stream example:
```
2
5
7
1
```

step 1. convert normal rdd to pair rdd and add dummy key, example:
```
(key,2)
(key,5)
(key,7)
(key,1)
```

step 2. updateStateByKey

define state to start with and function to update state

```scala
import org.apache.spark._
import org.apache.spark.streaming._
import org.apache.spark.streaming.StreamingContext._
//streaming context is required
val ssc = new StreamingContext(sc, Seconds(5))
//lines here is Dstream
val lines = ssc.socketTextStream("localhost",9998)
val words = lines.flatMap(x => x.split(" "))
val pairs = words.map(x => (x,1))

ssc.checkpoint("/path/to/checkpoint")

def updateFunc(newValues:Seq[Int],previousState:Option[Int]) = {
  val newCount = previousState.getOrElse(0) + newValues.sum
  Some(newCount)
}

val count = pairs.updateStateByKey(updateFunc)
count.print()
ssc.start()
```

window:

* batch interval: new rdd created, example 10sec
* window size: transformation done over a window, example 30sec
* sliding window: new rdds are considered and old will be ignored, example 20sec
* new rdds added is known as summary function
* removing of old rdds is known as inverse function
* sliding & windows should be integral multiple of batch as full rdd have to be in process.
* reduceByKeyAndWindow(summary function, inverse function, window size, sliding interval)


```scala
import org.apache.spark._
import org.apache.spark.streaming._
import org.apache.spark.streaming.StreamingContext._
//streaming context is required
val ssc = new StreamingContext(sc, Seconds(5))
//lines here is Dstream
val lines = ssc.socketTextStream("localhost",9998)

ssc.checkpoint("/path/to/checkpoint")

val words = lines.flatMap(x => x.split(" "))
val pairs = words.map(x => (x,1))
val wordsCount = pairs.reduceByKeyAndWindow((x,y)=>x+y,(x,y)=>x-y,Seconds(10),Seconds(2))

wordsCount.print()
ssc.start()
```

* reduceByKey - stateless
* updateStateByKey - stateful (considers entire stream
* reduceByKeyAndWindow - stateful (sliding window) -pair rdd is required
* reduceByWindow - here pair rdd is not required
* countByWindow - it will count the number of linesin the window.


### limitations of lower level constructs

* lack of spark sql engine optimizations
* only support processing time semantics and do not support event time semantics
* no further updates or enhancements expected


### spark structured streaming

* unified model of batch and stream processing
* run over spark sql engine
* supports event time semantics
* further enhancements expected

example:

step 1. producer write to socket

```shell
#this will open socket and will accept messages
nc -lk 9998
```

step 2. consumer read from the same socket

```scala
import org.apache.spark.streaming.StreamingContext
import org.apache.spark.SparkContext
import org.apache.spark.streaming.Seconds
import org.apache.log4j.Level
import org.apache.log4j.Logger
import org.apache.spark.SparkConf
import org.apache.spark.sql.SparkSession

object StreamingWordCount {
  Logger.getLogger("org").setLevel(Level.ERROR)
  val spark = SparkSession.builder()
  .master(local[2])
  .appName("stream app")
  .getOrCreate()

  //read from stream
  val lines = spark.readStream
  .format("socket")
  .option("host","localhost")
  .option("port","9998")
  .load()

  //process
  //split will give an array, explode will explode array in mutiple rows
  val words = lines.selectExpr("explode(split(value,' ')) as word")
  val counts = words.groupBy("word").count()

  //sink
  val output = counts.writeStream
  .format("console")
  .outputMode("complete")
  .option("checkpointLocation","path")
  .start()

  output.awaitTermination()

}

```

In above example, group by will do shuffle and then shuffle partitions parameter will kick in and with default vaule will create 200 partitions which is over kill for this case, hence it took around 5 seconds

so if we change the shuffle partitions it will give results in less than 1 sec.

```scala
val spark = SparkSession.builder()
 .master(local[2])
 .appName("stream app")
 .config("spark.shuffle.partitions",3)
 .getOrCreate()
```


## output modes

**append**: only new data

**update**: insert & update only

**complete**: it will maintain all state and give output from start till end

exapmle:
input1: hello hi
input2: hello no

in complete mode:
output1: (hello,1) (hi,1)
output2: (hello,2) (hi,1) (no,1)

in update mode:
output1: (hello,1) (hi,1)
output2: (hello,2) (no,1)

in append mode:
output1: (hello,1) (hi,1)
output2: (hello,1) (no,1)

in agg, append mode is not allowed, and spark streaming will through error as it is not supported.


### graceful shutdown

ideally spark streaming application should run forever but there can be cases where

* manually have to stop it for maintainence or some other reason
* some exception

we want our spark streaming application to stop and then restart gracefully. for this there is config to enable `stopGracefullyOnShutdown` to `true`


### behind the scene when spark streaming starts

* spark driver will take the code from readStream to writeStream and submits it to spark sql engine
* spark sql engine will analyse it, optimize it and then compile it to generate the execution plan
* execution plan is made of stages and tasks
* spark will then start a background thread to execute it
* this thread will start a new job to repeat the processing and writing operations
* each job is a micro batch
* loop is created and managed by the background process/thread
* whenever new data is processed then in spark UI we can see a new job created


### when new micro batch is triggered

data Stream writer allows us to define the trigger

**unspecified**: new microbatch is triggered as soon as current microbatch is done, however spark is smart enough to wait for new data

**time interval**: example if 1 min, then first microbatch will start immediately second will begin first is finished and time is elapsed

`.trigger(Trigger.ProcessingTime("30 seconds"))`

case1: when it takes less than 1 min then next microbatch will wait until 1 min is complete

case2: when it takes more than 1 min then next microbatch will start as soon as previous finishes if there is new data

**one time**: similar to batch but provides all features of streaming to process only new data

**continous**: still experimental, millisecond latency


### built in data sources

#### socket

read streaming data from a socket (IP + port)

if producer is producing at a very fast pace and writing to socket and if consumer is reading from the above socket at a slower pace then we might have data loss. so socket source is not meant for production use cases, as we can end up with data loss

#### rate

used for testing and benchmarking purpose, to generate some test data then can generate a configurable number of key value pairs

#### file

basically have a directory where new files are detected and processed

options like:
* maxFilesPerTrigger `.option("maxFilesPerTrigger",1)`

that over the time the number of files in the directory will keep on increasing, if we have a lot of files in directory then it will keep on consuming more time. that is why it is recommended to clean up the directory files as and when required.

`cleanSource` and `sourceArchiveDir` are often used together fro this.

```scala
//to delete from source
.option("cleanSource","delete")

//to archive at some path
.option("cleanSource","archive")
.option("sourceArchiveDir","/path/to/archive")
```

Note: going with any of the above will increase the processing time, if expected time to process is very quick then we should avoid using any of the above. In such cases we can have batch job scheduled which will take care of this cleanup.

#### kafka

it is event stream source, spark can keep track of offset it has processed from the kafka topic


### fault tolerance and exactly once guarantee

to maintain exactly once semantics

* not to miss any input record
* not to create duplicate output records

spark structured steaming provides support for these, state is maintained in the checkpoint location, it helps to achieve fault tolerance.

checkpoint location mainly contains read offsets/sources, state information (running total)

to guarantee exactly once 4 requirements should be met

* restart application with same checkpoint location
* use a replayable source, consider there are 100 records in 3rd microbatch and after processing 30 records it gave some exception, these 30 records should be availble to you when you start reprocessing. replayable means we can still get the same data which is processed earlier. when we are using socket source then we cannot get older data back again, so socket source is not replayable. kafka, file source both of them are replayable
* use deterministic computation, same example above, whenever we start again it will start from beginning of 3rd microbatch and these 30 records are also processed again. The output should remain same. example sqrt() is deterministic and dollarsToRs() kind of function is not deterministic
* use an idempotent sink, same example above, whenever we start again it will start from beginning of 3rd microbatch and these 30 records are also processed again. we will be processing these 30 records 2 times and writing this to output 2 times, writing the same output should not impact. Either it should discard the 2nd output or it should overwrite the 1st ouput with the 2nd one.
