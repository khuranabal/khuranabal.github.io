---
title: "spark part-I"
date: 2022-02-04T16:00:00-00:00
categories:
  - blog
tags:
  - spark
  - hadoop
  - hdfs
  - scala
  - pyspark
---

hadoop offers:
* hdfs: for storage
* mapreduce: for computation
* yarn: for resource management

spark is general purpose in memory compute engine, so its an alternative to mapreduce in hadoop, but would require storage (local/cloud) and resource manager(yarn/mesos/k8s).

spark can run on top of hadoop by replacing mapreduce with spark

### why spark

problem with mapreduce, it has to read and write from storage every time for each mapreduce job. And spark does all the processing in memory, so ideally just initial one read and final write to disk would be required. it is approximately 10-100% faster than hadoop.


### what do we mean by spark is general purpose

in hadoop we use:
* sqoop: for import
* pig: for cleaning
* hive: for querying
* mahout: for ML
* storm: for streaming

whereas in spark we can do all like cleaning, querying, ML, ingestion, streaming.


### storage unit in spark (rdd)

basic unit which holds data in spark is rdd (resilient distributed dataset). It is in memory distributed collection

```
//transfornations (lazy), nothing is executed only dag is being formed
rdd1 = load file1 from hdfs
rdd2 = rdd1.map

//action, it will be executed along with required transormations
rdd2.collect
```

lets say we have 500MB file in hdfs, then default we have 4 blocks data, based on 128MB block size. So, these 4 blocks will be loaded in memory as rdd in 4 partitions.

**resilient**: can recover from failure, if we loose rdd2 then through lineage graph its known how the rdd was created from its parent rdd. So, rdd provide fault tolerance through lineage graph. whereas in haddop resiliency is maintened by replication in hdfs.

**lineage graph**: keeps track of transormations to be executed after action has been called.

**immutable**: after rdd load data cannot be changed

### why immutable

because if we keep only one rdd and modify the same again and again, then in case of rdd failure at some step then we wont have parent rdd to regenrate then would require to do all the transformation from start.

### why lazy transformations

so as optimized plan can be made.

example: in below case we have to load all data then show one line only, it is better to optimize the plan knowing what all transormations are needed.
```
rdd1 = load data
rdd1 take 1 record to print
```

### frequency of word in a file

assume file is already present in some hdfs location `/path/to/file/file1`

running code interactively:
* scala: spark-shell
* python: pyspark

**spark context**: entrypoint to spark cluster, when we run interactively we can do `spark-shell`then it will return `sc`

```scala
//in scala
val rdd1 = sc.textFile("/path/to/file/file1")
val rdd2 = rdd1.flatMap(x => x.split(" ")) 
//flatMap takes each line as input 
//and will split based on " " in Array
//finally it will return only one Array with all the words
val rdd3 = rdd2.map(x => (x,1)) //each word will be key and 1 as value
val rdd4 = rdd3.reduceByKey((x,y) = x+y) //this is also transformation
//reduceByKey will have all the same keys together and takes 2 rows at a time 
//and operation we do is add so it will add values of the two rows
rdd4.collect()
```

```py
#in pyspark
sc.setLogLevel("ERROR") #default log is WARN
rdd1 = sc.textFile("/path/to/file/file1")
rdd2 = rdd1.flatMap(lambda x : x.split(" ")) 
rdd3 = rdd2.map(lambda x : (x,1))
rdd4 = rdd3.reduceByKey(lambda x,y : x+y)
rdd4.collect()
rdd4.saveAsTextFile("/path/to/file/output1")
```

**Note**
* at any point we can use `rdd.collect()` to see output of rdd
* in scala if there are no input parametrs to function then we can call without parentheses
* anonymous functions are called lambda in python
* to access local file we can use `file://` before the file path.
like `sc.textFile("file:///path/to/file/file1")`
* for doing lowercase we can use `toLowerCase()`
* for sorting we can use `sortby(x => x._2)` to sort on value in key value input
* if we need to just count number of times key is repeating then can use `countByValue` but its an action not transformation
* dag in pyspark is different than of scala because pyspark uses api library, scala dag matches to the code but not pyspark code
* at raw rdd level code pyspark is not that optimized compared to scala
* dag is created while transformations are being called and submitted when action is called, it shows jobs, stages, tasks
* lineage keeps track of rdds and how they are connected so as in case of failure, recovery can be done using parent rdd or if base rdd then getting data from specefic partition in disk, lineage is part of dag
* we can check lineage on any rdd with function `toDebugString` like `rdd1.toDebugString`


### shared variables

#### broadcast

broadcast join in spark is similar to map side join in hive. It is aceived by using broadcast variable. Small table can be broadcasted to all nodes.

Example: If we need to filter out some data based on data in other small table then we could broadcast small table to all nodes. Lets say we have only one column in small table we could use `set` to have distinct values in a variable.

```scala
import scala.io.Source

var v:Set[String] = Set()
/*
//data to be broadcasted rows like: 
are
is
am
*/
val lines = Source.fromFile("/path/to/broadcast/data").getLines()
for(line <- lines) {v += line}

var b = sc.broadcast(v)

/*
//some data which has rows like:
hello how are you, 20
am good, 30
*/
val rdd1 = sc.textFile("/path/to/data")
val mappedInput = rdd1.map(x => x.split(",")(1).toFloat,x.split(",")(0))

//it will flat the structure based on values and produce more rows
val words = mappedInput.flatMapValues(x => x.split(" "))

//this will be map side work only to filter out data
val filterData = words.filer(x => !b.value(x._1))

//this will add values for same words
val total = filterData.reduceByKey((x,y) => x+y)

//this will give data in sorted desc
val sorted = total.sortBy(x => x._2,false)
```

#### accumlator

similar to counters in mapreduce, if we need to count then we can use accumlator.

* shared variable on driver machine
* each executor can only update it but cannot read value


```scala
val v = sc.longAccumlator("shown name in UI")
val rdd1 = sc.textFile("/path/to/data")

//it will count the number of lines in file
rdd1.foreach(x => v.add(1))
```

### list to rdd

```scala
//lets say we want col1 and count how many times it repeat
val l = List("A: P1", "B: P2", "A: P3")
val rdd1 = sc.parallelize(l)
val pair = rdd1.map(x => {
  val cols = x.split(":")
  (cols(0),1)
})
val result = pair.reduceByKey((x,y) => x+y)
result.collect().foreach(println)
```


### narrow & wide transformation

**narrow**: ideally where shuffling is not involved, when rdd partition is dependent on at most one partition of parent rdd

example: map, filter, filtermap, etc

**wide**: where shuffling is involved, when rdd partition is dependent on mutiple partitions of parent rdd

example: reduceByKey, groupByKey, etc


### job, stages & tasks

**job**:

* every action is a job
* sortByKey is exception as its transformation but still shows up as job because some part of it is eager and some part lazy
* when action is called all the transformations in the stage from beginning will be executed. spark optimizes to skip previous stages

**stage**:

* whenever shuffle is required new stage is created, so wide transformation creates new stage
* by default it will be one stage
* when shuffle happens it uses disk so as next stage can pick data
* wide transformations should be used later in the app so as it works on less data

example: if 2 wide transormations then total 3 stages in the spark application run

**task**:

* will be equal to number of partitions read

### reduceByKey vs reduce

**reduceByKey**

* is transormation(wide)
* works on pair rdd (tuple of two: key, value) only

```scala
//lets say we want col1 and count how many times it repeat
val l = List("A: P1", "B: P2", "A: P3")
val rdd1 = sc.parallelize(l)
val pair = rdd1.map(x => {
  val cols = x.split(":")
  (cols(0),1)
})

//transformation: here we get only rdd
val result = pair.reduceByKey((x,y) => x+y)

//action: here we get result on local not rdd
result.collect().foreach(println)
```

**reduce**:

* is an action
* gives single output

```scala
val a = 1 to 100
val rdd1 = sc.parallelize(a)

//action: it will return result
rdd1.reduce((x,y) => x+y)
```


### reduceByKey vs groupByKey

both are transformation(wide)

**reduceByKey**:

* works on mapper end to do local aggregations
* similar to combiner in hadoop
* less shuffling as local aggregations done

**groupByKey**:

* all the data is sent to reducer to do aggregations
* more shuffling
* should be avoided as no local aggregations
* resources will be wasted as most of mappers will be ideal in case of reducer work

**Note**: by default, hdfs blocks size is 128MB and local block size is 32MB


### pair rdd vs map datatype in scala

pait rdd holds tuple of two elements(key, value).

map datatype in scala also hold key value pair but cannot have duplicates while pair rdd can have duplicates


### save to file

```scala
//its an action
rdd.saveAsTextFile("/path/to/file")
```


### parallelism and partitions

default parallism is equal to number of cores and default partitions is equal to number of parallelism

```scala
//to check parallelism
sc.defaultParallelism

val l = List("A: P1", "B: P2", "A: P3")
val rdd1 = sc.parallelize(l)

//to check number of partitions
rdd1.getNumPartitions

//if we load from local file in rdd than it will use 32MB block to partition
//if hdfs than 128MB
//but if file is small like 2MB than default min partition is used which is 2

sc.defaultMinPartitions
```


### repartition vs coalesce

**repartition**:

* to increase parallelism we may need to repartition to more partitions
* if we have less data in each partition after a certain point then we may need to consider repartition to use less partitions with good data
* it is wide transformation
* does full shuffle of data to get exact equal size

```scala
//lets say rdd1 exist with default 2 partitions
rdd1.getNumPartitions

//this will repartition in 10 partitions
val rdd2 = rdd1.repartition(10)

rdd2.getNumPartitions


//decrease number of partitions to 1
val rdd3 = rdd1.repartition(1)
```

**coalesce**:

* same as repartition but can only decrease number of partitions
* increasing does not give error but also does not change the number of partitions
* it is transformation
* minimize shuffling by combining local partitions to avoid full shuffle 

```scala
//lets say rdd1 exist with default 2 partitions
rdd1.getNumPartitions

//decrease number of partitions to 1
val rdd2 = rdd1.coalesce(1)

rdd2.getNumPartitions
```

**Note**: to decrease repartition and coalesce both can be used but coalesce if preferred as it minimizes shuffling by trying to combine partitions within the node first


### cache & persist

if we have a lot of transormations and we call actions mutiple times then all the transformations will run again or atleast the last stage will be executed in full. If we use cache then transormations (if any) or action after cache will only be executed.

cache and persist, both have same purpose to not do all the transformations again.

cache will always be in memory, persist have option of various storage levels. persist in memory `persist()` is same as cache.

#### persist storage levels

**MEMORY_ONLY**: cached in memory non serialized format

**DISK_ONLY**: in disk serialized format

**MEMORY_AND_DISK**: in memory, if not enough memory then evicts blocks and are stored in disk. recommemded to avoid expensive recalculation and memory is limited

**OFF_HEAP**: blocks cached off heap (outside jvm), in jvm it uses garbage collection to free space, its time taking process. So, we could uses memory outside executor. These are called unsafe operations as it will use raw memory outside jvm. It stores in serialized format

**MEMORY_ONLY_SER**: same as memory only but serialized

**MEMORY_AND_DISK_SER**: same as memory and disk but serialized

**MEMORY_ONLY_2**: same as memory only but with 2 replicas on different worker nodes, t speed up recovery

**Note**:
* In memory only if we dont have enough memory then it will not fail rather will skip caching it.
* serialized saves space as it stores in binary but will require more processing


### run jar

jar is Java ARchive, a package file format typically used to aggregate many java class files and associated metadata and resources (text, images, etc.) into one file for distribution. [jar-wiki][jar-wiki]

to run from terminal we can submit like below

```shell
spark-submit --class ClassName path/to/jar
```

[jar-wiki]: https://en.wikipedia.org/wiki/JAR_(file_format)


### map vs map partition


map is a transformation which works on each row. for example if in rdd there are 4 partitins with 1000 rows in each partition then map will be called 4000 times

map partition works on each partition so in example above it will be run 4 times. This can help if we need to make connection to database
