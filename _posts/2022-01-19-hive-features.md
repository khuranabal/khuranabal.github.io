---
title: "hive features"
date: 2022-01-19T15:43:00-00:00
categories:
  - blog
tags:
  - hive
---


### hive server / thrift server

Its like bridge service, where code can be written in any language and executed remotely on hive using apache thrift server/service.

In hive context, we can write code in java to query on hive using thrift service.


### msck repair

Assume we have hive external table, and partitions are added to the directory. In this case metadata in hive will not be updated automatically. We have to use `msck` to update metadata.

Example:

1. create external table 
```hive
create external table v1(a int, b int)
partitioned by (state char(2))
location '/data';
```
2. create directory 
```sh
hadoop fs -mkdir /data
```
3. add couple of partitions data in directory `/data`
4. check partitions, it will not show any partitions 
```hive
show partitions v1;
```
5. use below command to build metadata
```hive
msck repair table v1;
```
6. check partitions again, it will show partitions added 
```hive
show partitions v1;
```


### no_drop feature

We can enable no drop feature so as it is protected by accidental drop command. Same way we can disable if required.

1. enable no drop: `alter table v1 enable no_drop;`
2. test drop, it will error out: `drop table v1;`

It can even be enabled on particular partition.

`alter table v1 partition (country='DK') enable no_drop;`


### offline feature

We can enable offline feature so as table will be restricted to be queried. 

`alter table v1 enable offline;`


### skip rows

To skip n top rows, we have to create table with special tblproperties.

```hive
create table v2(a int, b int)
tblproperties("skip.header.line.count"="3");
```

Note: same way we can skip footer property is `skip.footer.line.count`


### immutable feature

If enabled then we cannot change data like append or modify, it only allows data to be loaded one time. However we can overwrite.

Property to enable: `tblproperties("immutable"="true")`


### drop vs truncate vs purge

**drop**:

  * for managed table data and metadata both are deleted
  * for external table only metedata is deleted

**truncate**: all the data is deleted, metadata will not be deleted

**purge**:

  * if set to true, data will be permanently deleted
  * if set to false, data can be recovered


### empty string

When value is missing in the column of dataset in a file, it is empty string `""` not `NULL`

There is table property `tblproperties("serialization.null.format"="")` to convert any empty value to `NULL`


### dfs command from hive

We can run below command from terminal to check files in hdfs.
```sh
hadoop fs -ls /user/username
```

If we are connected to hive then we can use `dfs`command to check files.
```hive
dfs -ls /user/username;
```


### executing linux command from hive

It can be executed by prefixing command with `!`

Example: `!ls /home/user;`


### hivevar

It is used to have variable in hive. Example:
```hive
set hivevar:var1=1;
select * from v1 where a=${var1};
```


### print headers along with data

Use below to print header in output from hive.

`set hive.cli.prnt.header=true;`


### cartesian product

Join all rows one table with all rows of other table.

`select * from t1,t2`
