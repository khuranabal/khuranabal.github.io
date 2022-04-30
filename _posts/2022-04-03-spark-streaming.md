---
title: "spark streaming"
date: 2022-04-03T16:00:00-00:00
categories:
  - blog
tags:
  - spark streaming
---

* processing on continous flowing data, example card fraud detection, find something trending
* MapReduce can only work on batch, not streaming data, spark is general purpose and can also process streaming data
* data in spark is stored in rdd, but in streaming there is no static place where data is stored, its continously flowing in
* so we define stream size, lets say 1 hour and every 2 min we do something then new rdd will be created every 2 min and total 30 rdd will be created. each rdd may have more/less data. here 2 min is batch interval
* transformations will be performed on Dstream which does batch processing on all the rdds in Dstream
* with batch size of 1 sec it will be near real time

Dstream -> rdds -> messages
1 -> 30 -> data in the form of messages
we operate at Dstream level


### stream processing

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
