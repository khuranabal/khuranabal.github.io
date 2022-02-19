var store = [{
        "title": "Build and deploy static website",
        "excerpt":"To host website we have different ways and for this blog we are focussing on a use case where we need to have a website for blogging, and we are using: jekyll: static site generator, theme used is minimal mistakes github pages: static website hosting service Installation Following are required...","categories": ["blog"],
        "tags": ["jekyll","github"],
        "url": "/blog/setup-github-pages-with-jekyll/",
        "teaser": null
      },{
        "title": "hdfs architecture",
        "excerpt":"hdfs is hadoop distributed file system. Highly fault tolerant and is designed to deploy on low cost machines. Let’s assume we have cluster(2 data node, 1 name node) and file of 250MB. Default block size: 128MB Default replication factor: 3 So, there will be 2 blocks: Block-1: 128MB Block-2: 122MB...","categories": ["blog"],
        "tags": ["hdfs","hadoop"],
        "url": "/blog/understand-hdfs/",
        "teaser": null
      },{
        "title": "MapReduce working",
        "excerpt":"MapReduce is programming model for processing big datsets. It consists of two stages: map reduce Both works on key value pairs. key value id 1 name abc Understanding with example Lets say we have a big file (size 100GB) and we need to find frequency of words. By default block...","categories": ["blog"],
        "tags": ["mapreduce","hadoop"],
        "url": "/blog/map-reduce/",
        "teaser": null
      },{
        "title": "sqoop working",
        "excerpt":"It is used to transfer data between rdbms to hdfs and vice versa. sqoop import: transfer from rdbms to hdfs sqoop export: transfer from hdfs to rdbms sqoop eval: to run queries on databases Setup cloudera quickstart machine on local We have multiple ways to setup cloudera machine either as...","categories": ["blog"],
        "tags": ["sqoop","hdfs"],
        "url": "/blog/sqoop/",
        "teaser": null
      },{
        "title": "file formats for big data",
        "excerpt":"There are certain parameters to consider when chossing a file format. storage space consumption processing time io consumption read/write speed if data can be split in files schema evolution compression compatible with framework like hive/spark etc. ways in which data can be stored row based: write is simple but read...","categories": ["blog"],
        "tags": ["csv","xml","json","avro","orc","parquet","compression"],
        "url": "/blog/file-formats/",
        "teaser": null
      },{
        "title": "compression in hadoop",
        "excerpt":"Compression will help to: save storage reduce io cost Note: compression and uncompression adds some cost as cpu resources will be used but io cost is saved more comparatively. Compression techniques some compression codes are optimized for: storage speed snappy: fast compression codec optimized for speed rather than storage by...","categories": ["blog"],
        "tags": ["compression","hadoop"],
        "url": "/blog/compression-in-hadoop/",
        "teaser": null
      },{
        "title": "hive optimizations",
        "excerpt":"Vectorization It is hive feature which reduces cpu usage for query execution. Usually it processes one row at a time. Vectorized query streamlines operations by processing 1024 rows at a time like bacth of rows. To use vectorization data should be in orc format. And need to enable below parameter,...","categories": ["blog"],
        "tags": ["hive","optimization"],
        "url": "/blog/hive-optimizations/",
        "teaser": null
      },{
        "title": "hive features",
        "excerpt":"hive server / thrift server Its like bridge service, where code can be written in any language and executed remotely on hive using apache thrift server/service. In hive context, we can write code in java to query on hive using thrift service. msck repair Assume we have hive external table,...","categories": ["blog"],
        "tags": ["hive"],
        "url": "/blog/hive-features/",
        "teaser": null
      },{
        "title": "slowly changing dimensions",
        "excerpt":"It is for dimension tables where changes are less in source rdbms which we want to get into datawarehouse or hdfs Type of SCD SCD Type 1 History is not maintained, data is overwritten. SCD Type 2 Maintain history. It can be done in below three ways, lets take emaple...","categories": ["blog"],
        "tags": ["scd","datawarehouse"],
        "url": "/blog/scd/",
        "teaser": null
      },{
        "title": "hbase",
        "excerpt":"rdbms properties structured random access low latency ACID Atomic: full transaction either completes or fail Consistency: updates should not violate constraints Isolation: multiple concurrent sessions can work on database in some sequence using locking Durability: data is stored and recoverable even after failure limitations of hadoop unstructured data no random...","categories": ["blog"],
        "tags": ["hbase","nosql","database"],
        "url": "/blog/hbase/",
        "teaser": null
      },{
        "title": "cap theorem",
        "excerpt":"It is for distributed databases. And says that we can have only two out of three gurantees. C(Consistency): every node returns same recent data A(Availibility): every request gets response P(Partition tolerance): system functions despite of partition/network failure Options: CA: rdbms CP: single master or active/passive master, distributed database. ex:hbase AP:...","categories": ["blog"],
        "tags": ["cap theorem","nosql","database"],
        "url": "/blog/cap/",
        "teaser": null
      },{
        "title": "cassandra",
        "excerpt":"features distributed column oriented database highly performant scalable transactional low latency retrieval availibilty and partition tolerance guarentees with tunable consistency no master, multi master decentralized architecure highly available for communication among peers use gossip protocol Example: where eventual consistency is fine like social media comments/likes tunable consistency In default setup,...","categories": ["blog"],
        "tags": ["cassandra","nosql","hbase","database"],
        "url": "/blog/cassandra/",
        "teaser": null
      },{
        "title": "hive for processing and hbase for low latency read",
        "excerpt":"creating table which can be accessed both by hive and hbase, this is done in cases where we require quick (low latency) searches and faster processing of data. In this case we can use hive for processing and hbase for quick searches with same underlying table. steps: create table in...","categories": ["blog"],
        "tags": ["hive","nosql","hbase","database"],
        "url": "/blog/hive-hbase/",
        "teaser": null
      },{
        "title": "scala part I",
        "excerpt":"spark code can be written in different languages (scala, python, java, r), scala is hybrib, oops + functional. ways to write code: REPL: do directly in scala terminal, to view result intractively IDE: eclipse, vs code etc. why scala scala gives best performance as directly scala code can work in...","categories": ["blog"],
        "tags": ["scala"],
        "url": "/blog/scala-part-I/",
        "teaser": null
      },{
        "title": "time complexity",
        "excerpt":"A way to calculate time consumed by an algorithm, as a function of input. example1 lets say we have an array a = 1 5 3 7 2 Q: find element at index 2? A: as we can do array get (random access) at index, time complexity will be O(1)...","categories": ["blog"],
        "tags": ["time complexity","data structures"],
        "url": "/blog/time-complexity/",
        "teaser": null
      },{
        "title": "scala part II",
        "excerpt":"scala runs on top of jvm scala is like java so requires main, or we can extends App then we dont have to define main method //define main method object example { def main(args: Array[]) = { println(\"hello\") } } //define without main method object example extends App{ println(\"hello\") }...","categories": ["blog"],
        "tags": ["scala"],
        "url": "/blog/scala-part-II/",
        "teaser": null
      },{
        "title": "spark",
        "excerpt":"hadoop offers: hdfs: for storage mapreduce: for computation yarn: for resource management spark is general purpose in memory compute engine, so its an alternative to mapreduce in hadoop, but would require storage (local/cloud) and resource manager(yarn/mesos/k8s). spark can run on top of hadoop by replacing mapreduce with spark why spark...","categories": ["blog"],
        "tags": ["spark","hadoop","hdfs","scala","pyspark"],
        "url": "/blog/spark/",
        "teaser": null
      },{
        "title": "python basics",
        "excerpt":"module it is just a python file which may hold functions, classes, methods, variables. for import we can use import as show below. import sys #to import full module from datetime import date #to import submodule from time import time #to import specific function, it can then be called directly...","categories": ["blog"],
        "tags": ["python"],
        "url": "/blog/python/",
        "teaser": null
      },{
        "title": "yarn",
        "excerpt":"Yet Another Resource Negotiator Lets first go through how things are in hadoop initial version and what the limitations are which is solved by YARN. processing in hadoop / mr version 1 in hdfs storage metadata is stored in name node and actual data blocks in data node. job execution...","categories": ["blog"],
        "tags": ["hadoop","hdfs","yarn","spark"],
        "url": "/blog/yarn/",
        "teaser": null
      }]
