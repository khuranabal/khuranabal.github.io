---
title: "file formats for big data"
date: 2022-01-14T15:33:00-00:00
categories:
  - blog
tags:
  - csv
  - xml
  - json
  - avro
  - orc
  - parquet
  - delta
---


There are certain parameters to consider when chossing a file format.

* save storage
* fast processing
* less io
* fast read
* fast write
* data can be split in files
* schema evolution
* advanced compression
* compatible with framework like hive/spark etc.


### file types

1. **row based**: write is simple but read will have to read full row even if subset of column is read.

2. **column based**: all columns values are stored together. Write will be slower comparatively. But read will be efficient. In this we can get good compression as well.


### file formats

1. **csv**:
key points:
  * all data stored as text so takes a lot of storage for example if column has integer value then that consumes more storage because its stored as text. 
  * processing will be slow as conversion need to be done. 
  * io will be slow as data storage is more so will do more io.

2. **xml**:
key points:
  * semi structure
  * all negative of csv applies here as well.
  * these files can not split.

2. **json**:
key points:
  * semi structure
  * all negative of csv applies here as well.

2. **avro**: 
key points:
  * row based storage
  * faster write as its row based
  * slow read for subset of columns
  * schema of file is stored in json
  * data is self describing because schema is embeded as part of data
  * actual data is in binary format
  * general file format, programming language agnostic can used in many languages
  * matuare in schema evolution
  * serialization format
  
3. **orc**

4. **parquet**

5. **delta**


Note: 
* serialization is converting data into a form which can be easily transferred over the network and stored in file system.
* there is no other file format better than avro for schema evolution.
* can be best fit for landing in data lake as raw data.
* in avro, orc, parquet any compression can be used, compression code is stored in metadata, so reader can get to know compression code from metadata.



