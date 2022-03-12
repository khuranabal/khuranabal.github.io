---
title: "spark part-II"
date: 2022-03-09T16:00:00-00:00
categories:
  - blog
tags:
  - spark
---


spark core works on rdds (spark 1 style) but we have high level constructs to query/process data easily, its dataframe/datasets

dataframe is distributed collection of data organized into named columns. It was available in spark 1 also but in spark 2 and onwards we have better support for dataframe/datasets and both are merged into single api (datset api)

dataframe code will be converted to low level rdd code which is done by driver. low level/rdd code is directly sent to executors
dataframe/dataset code optimized and converted to low level before sending to executor, using catalyst optimizer


### spark session

earlier we use to do spark conext and if hive required then hive context will be required, etc. spark session is unified and have all the contexts, kind of unified entry point for spark application. It is singleton object as we either get or create it.

```scala
import org.apache.spark.sql.SparkSession

val spark = SparkSession.builder().appName("app1").master("local[2]").getOrCreate()

//do processing

spark.stop()
```

```scala
//another way to set config
import org.apache.spark.sql.SparkSession
import org.apache.spark.SparkConf

val sparkConf = new SparkConf()
sparkConf.set("spark.app.name", "app1")
sparkConf.set("spark.master", "local[2]")

val spark = SparkSession.builder().config(sparkConf).getOrCreate()

//do processing

spark.stop()
```


### basics dataframe commands

```scala

import org.apache.log4j.Level
import org.apache.log4j.Logger

//to get only ERROR and above
Logger.getLogger("org").setLevel(level.ERROR)

//we should not use inferSchema in production as it infers data type based on few initial rows
//in spark it will create 3 jobs: 1st read, 2nd inferSchema as some data read, 3rd for show
val df = spark.read.option("header", true).option("inferSchema", true).csv("/path")
df.show()
df.printSchema()

//this will create 3 stages: 1st default, 2nd repartition, 3rd groupBy
df.repartition(4).where("col1>10").select("col2,col3").count().show()

```

**Note**: whenever shuffling is done then stage writes to Exchange (buffer) and next stage reads from Exchange. So we see in spark ui some data (compressed) written out and read in in next stage.


### rdd/dataframe/dataset

#### rdd

* example map, filter, reduceByKey, etc.
* low level, not developer friendly
* lacks basic optimizations

#### dataframe

* spark 1.3 and onwards
* high level construct, developer friendly

challenges with dataframe:

* not strongly typed, errors at runtime
* less flexibility

dataframes can be converted to rdd to get flexibility and type safety, but the conversion has some cost involved and also rdd don't go through catalyst optimizer, so major optimizations will be skipped if we work with rdd.

#### dataset

* spark 1.6 and onwards
* compile time safety
* more flexibility to write low level code like anonymous/lambda functions
* conversion from dataframe to dataset is seemless

**Note**: before spark 2, dataframe and dataset had different api. In spark 2, both are merged into single unified structured api

So, dataframe is dataset of row type (dataset[row]), row is generic type which bounds at runtime. But in dataset type (dataset[Order]) is bound at compile time.

#### convert dataframe to dataset

```scala
case class Abc(id: Int, col2: String)

val df = spark.read.option("header", true).option("inferSchema", true).csv("/path")

//this is required for conversion from dataframe to dataset or vice versa
//it has to be imported after spark session only
import spark.implicits._

val ds = df.as[Abc]

//this will give error at complie time as col3 does not exist
ds.filter(x => x.col3 > 3)

//we could use other way to filter but that will not give error at compile time
ds.filter("col3 > 3")
```

**Note**: dataframes are preferred, as there is overhead in dataset for casting to particular type. with dataframe serializaton is managed by tungsten binary format, with dataset serialization is managed by java serialization which is slow


### read modes

**PERMISSIVE**: sets NULL if encounters malformed record, this is default mode, _corrupt_record as new column will appear and it will hold the malformed record

**DROPMALFORMED**: will ignore malformed record

**FAILFAST**: exception raised when malformed record found

```scala
spark.read.format("csv").option("header", true).option("path", "/path").option("mode", "FAILFAST").load()
```


### schema types

**INFER**: as we do for csv infer schema

**IMPLICIT**: example lile orc/parquet which comes with schema

**EXPLICIT**: manually defining schema like using case class

#### explicit schema approaches

programatic approach:

```scala
//in this approach we give spark datatypes
val dfSchema = StructType(List(StructField("col1", IntegerType),StructField("col2", TimestampType),StructField("col3", IntegerType)))

val df = spark.read.format("csv").schema(dfSchema).option("path", "/path").load()

df.show()
df.printSchema()
```

ddl string:

```scala
//in this approach we give scala datatypes
val dfSchema = "col1 Int, col2 Timestamp, col3 Int"

val df = spark.read.format("csv").schema(dfSchema).option("path", "/path").load()

df.show()
df.printSchema()
```


### save modes

**append**: add file in existing folder

**overwrite**: overwrites the data in folder

**errorIfExists**: error if folder exist

**ignore**: ignore if folder exist

```scala
df.write.mode(SaveMode.Overwrite).option("path", "/path").save()
```

#### spark file layout

ways to control number of files generated when saving data, by default it will be equal to number of partitions in dataframe

**repartiton**: it does full shuffle, not preferred

**partitioning/bucketing**: partitoning will create folder and bucket is number of files

```scala
df.write.partitionBy("col1").mode(SaveMode.Overwrite).option("path", "/path").save()
```

**max records**: if this option is set than each file will have that many records only

```scala
df.write.option("maxRecordsPerFile", 1000).mode(SaveMode.Overwrite).option("path", "/path").save()
```


### sparksql

to work with sql we create view and work on it. example:

```scala
//lets say we have dataframe already

df.createOrReplaceTempView("dfView")
val output = spak.sql("select col1, max(col2) from dfView group by col1 order by col1")
output.show()
```

**Note**: as per performance sparksql/dataframe are similar as both uses catalyst optimizer


### save as table

when we use `save` then it saves directly as file in some folder. But sometimes we want to store as table (data + metadata)

**data**: stored in path used in `spark.sql.warehouse.dir`

**metadata**: stored in memory by default, hive metstore can be used for permanent storage

```scala
//by default data will be stored in default location & metadata in memory
df.write.format("csv").mode(SaveMode.Overwrite).saveAsTable("table1")
```

**Note**:
* we can enable hive support in config by `enableHiveStore()` to have permanent metadata store. So, we can create database and save tables in that database.
* save in table benefits if some query needs to be done for example by reporting tools etc.
* bucketing works on table, so here we can do like `bucketBy(2, "col1")`, this will create 2 files/buckets, it uses hash function so same data will end up in same bucket, it is widely used with `sortBy` for performance


### transformations

**low level**: mostly used with rdds, some of it also works with dataframes/datasets

* map
* filter
* groupByKey

**high level**: used with dataframes/datasets

* select
* where
* groupBy

**Note**: although we can do work with dataframe/dataset but sometimes we need rdds for example if we have unstructured file with mutiple delimiters `1:data1,data2`. In this case we can read data in rdd and then process it using regex to get data and convert in dataset


### column read

**column string**: `df.select("col1","col2").show`

**column object**: `df.select(column("col1"),col("col2"),$"col3", 'col4).show`

`$"col3", 'col4` is supported only in scala, others are supported in both pyspark & scala

**Note**: both column string & object can not be used in same statement


### column expressions

```scala
df.select(col("col1"), expr("concat(col2, '_suffix')")).show()

df.selectExpr("col1", "concat(col2, '_suffix')").show()
```

**Note**: columns strings/object can not be used together with column expression


### attach column names to dataframe

```scala
//lets say we have only data in the path without column names
val df = spark.read.format("csv").schema(dfSchema).option("path", "/path").load()

//here column name are decided by spark but we can give name as below
val df1 = df.toDF("col1", "col2", "col3")

df1.show()
```


### udf

#### column object expression udf

```scala
//step1: define function
def func(i:Int):String = {
  if (i>90) "Y" else "N"
}

//step2: register function
val parseFunc = udf(func(_:Int):String)

//read data
val df = spark.read.format("csv").schema(dfSchema).option("path", "/path").load()

//step3: call function, driver will serialize function and send to all executors 
val df1= df.withColumn("col4", parseFunc(col("col1")))
df1.show()
```

#### column string/sql udf

```scala
//step1: define function
def func(i:Int):String = {
  if (i>90) "Y" else "N"
}

//step2: register function, this will register in catalog and normal spark sql can also be done on it
spark.udf.register("parseFunc",func(_:Int):String)

//read data
val df = spark.read.format("csv").schema(dfSchema).option("path", "/path").load()

//step3: call function, driver will serialize function and send to all executors 
val df1= df.withColumn("col4", expr("parseFunc(col1)"))
df1.show()
```


### example with test data in code

```scala
//test data in list
val l1 = List(
  (1,"2001-01-15",98,"PASS"),
  (2,"2001-01-15",9,"FAIL"),
  (3,"2001-01-15",60,"PASS")
)

//one way to get data in rdd than convert to df
import spark.implicits._
val rdd = spark.sparkContext.parallelize(l1)
val df = rdd.toDF()

//other way to directly get in df
val df1 = spark.createDataFrame(l1).toDF("col1","col2","col3","col4")

//convert date column col2 (string) to epoch time
val df2 = df1.withColumn("col2", unix_timestamp(col("col2").cast(DateType)))

//add new column with unique data
val df3 = df2.withColumn("new", monotonically_increasing_id)

//drop duplicates based on col1 and col2
val df4 = df3.dropDuplicates("col1","col2")

//drop col3
val df5 = df4.drop("col3")
```


### aggregartions

#### simple

* output is single row
* example sum/max/min of all data

```scala
val df = spark.read.format("csv").schema(dfSchema).option("path", "/path").load()

//using column object expression
df.select(count("*").as("rows"), sum("col3").as("total"), avg("col3").as("avg"), countDistnct("col4").as("distinct")).show()

//using string expression
df.selectExpr("count(*) as rows", "sum(col3) as total", "avg(col3) as avg", "countDistnct(col4) as distinct").show()

//using spark sql
df.createOrReplaceTempView("dfView")
spark.sql("select count(*) as rows, sum(col3) as total, avg(col3) as avg, countDistnct(col4) as distinct from dfView").show()
```

**Note**: when count is done on particular column than only non null will be counted

#### grouping

* output is more than one record
* groupBy is used

```scala
val df = spark.read.format("csv").schema(dfSchema).option("path", "/path").load()

df.groupBy("col1","col2").agg(sum("col3").as("sum"),sum(expr("col3*col3").as("square"))).show()
```

#### window

* some fixed size window is used
* example past 7 days sale

```scala
val df = spark.read.format("csv").schema(dfSchema).option("path", "/path").load()

//window need partition, order, window size
val window = Window.partitionBy("col1").orderBy("col2").rowsBetween(Window.unboundedPreceding, Windows.currentRow)

df.withColumn("runningSum", sum("col3").over(window)).show()
```
