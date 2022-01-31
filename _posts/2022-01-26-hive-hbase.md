---
title: "hive for processing and hbase for low latency read"
date: 2022-01-26T14:25:00-00:00
categories:
  - blog
tags:
  - hive
  - nosql
  - hbase
  - database
---


creating table which can be accessed both by hive and hbase, this is done in cases where we require quick (low latency) searches and faster processing of data. In this case we can use hive for processing and hbase for quick searches with same underlying table.

steps:

1. create table in hive
```hive
create table integration (a int, b string);
```

2. load data in hive table
```hive
load data local inpath '/path/to/data/data.csv'
overwrite into table integration;
```

3. create hive-hbase table
```hive
create table hive_table(key int, value string) stored by
'org.apache.hadoop.hive.hbase.HBaseStorageHandler' with
SERDEPROPERTIES ("hbase.table.name"="hbase_table");
```

4. insert data in hive-hbase table
```hive
insert overwrite table hive_table select * from integration;
```

5. verify data from hive
```hive
select * from hive_table;
```

6. verify data from hbase
```hbase
scan 'hbase_table'
```


**Note**: in hive we can have duplicate keys but in hbase we can have only unique keys so when we load data in the table which is hive-hbase then it updates the same key with new timestamp and by default latest one will be shown.
