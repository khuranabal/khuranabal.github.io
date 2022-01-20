---
title: "hive optimizations"
date: 2022-01-18T15:56:00-00:00
categories:
  - blog
tags:
  - hive
  - optimization
---

### Vectorization

It is hive feature which reduces cpu usage for query execution. Usually it processes one row at a time. Vectorized query streamlines operations by processing 1024 rows at a time like bacth of rows.

To use vectorization data should be in orc format. And need to enable below parameter, it is not enabled by default.

`set hive.vectorized.execution.enabled = true`

Example:

1. create table: `create table v1(a int, b int) stored as orc;`
2. enable vectorization
3. expalin query `explain select * from v1;` We should be able to see `execution mode: vectorized`


### Change hive engine

It supports three engines. We can check which one is in use by below command.

`set hive.execution.engine`

`set hive.execution.engine=spark;`

  * mr
  * tez
  * spark

**Note**: mr is defult selected


### UDF

UDF's are not very optimized. And filters in hive are evaluated from left to right so in case we have udf then we should put that in last in the filter. Example:

`where col1=1 and udf_name(col2)=2`


### cost based optimization (CBO)

It is open source and generates effecient plan by checking cost of query, which is collected by ANALYZE statements. And it is enabled by default. Properties related to it:

```hive
set hive.cbo.enable
set hive.compute.query.using.stats
set hive.stats.fetch.column.stats
set hive.stats.fetch.partition.stats
```
