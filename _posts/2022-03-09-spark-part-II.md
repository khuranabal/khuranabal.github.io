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
