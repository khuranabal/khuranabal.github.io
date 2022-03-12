---
title: "spark optimizations"
date: 2022-03-12T16:00:00-00:00
categories:
  - blog
tags:
  - spark
---

optimizations can be at application code level or at cluster level, here we are looking more at cluster level optimizations

### application code level

few of the things which can be configured/used, when doing application code are:

* partitiong
* bucketing
* cache/persist
* avoid/minimize shuffling
* join optimizations
* optimized file format
* using reduceByKey instead of groupByKey


### cluster configuration

to understand the cluster level configuration, lets say we have 10 node cluster (worker) with 16 core & 64GB ram each.

* executor, is a container which holds some core & memory
* one node can have more than one executor
* executor/container/jvm is same in this context

**thin executor**: intention is to create more executors with each executor having minimum possible resources.

one core will be always be required by node for daemon threads and one gb memory will be required for operating system.

for above example, 15 executors can be created with one core each.

cons:

* we loose on mutithreading as each executor get one core
* for broadcast lot of copies need to be done as there will be a lot of executors

**fat executor**: intention is to give maximum possible resources.

one core will be always be required by node for daemon threads and one gb memory will be required for operating system.

for above example, all 15 cores in one executor.

cons:

* it is observed if executor hold more than 5 core then hdfs throughput suffers
* if executor holds large memory, garbage collection (removing unused objects from memory) takes lot of time

**balanced approach**:

for example above as mentioned, one core for daemon threads and one gb for operating system. So we left with 15 cores and 63GB ram. We want mutithreading and hdfs through be optimal, hence we can use 5 cores in executor.

So, we can have 3 executors with 5 cores & 21GB ram

Out of 21GB ram, some of it is part of overhead(off heap memory aka raw memory). max of 348MB/7% of executor memory is off heap memory, it is overhead not part of container, so here approx 1.5GB is overhead, hence around 19GB will be avaialble for each executor.

So, 3 executor per node in 10 node cluster we will have 30 executors.
one executor out of 30 will be taken up by yarn, so total 29 executor for application

tasks in executor is equal to number of cores, so 5 tasks can run parallelly in our case in each executor

#### on heap memory

* local to the executor
* jvm manages and does the garbage collection

#### off heap memory

* used for some optimizations as garbage collection is not required
* but need to do memory management programmatically to use off heap

![spark-node](/assets/images/spark/spark-node.png)
