---
title: "compression in hadoop"
date: 2022-01-18T15:29:00-00:00
categories:
  - blog
tags:
  - compression
  - hadoop
---


Compression will help to:
  * save storage
  * reduce io cost

**Note**: compression and uncompression adds some cost as cpu resources will be used but io cost is saved more comparatively.

### Compression techniques

some compression codes are optimized for:

  * storage
  * speed

**snappy**:

  * fast compression codec
  * optimized for speed rather than storage
  * by default is not splittable but file format like avro/orc/parquet takes care of splits. So snappy can be used with these file formats.
  * distributed with hadoop

**lzo**:

  * optimized for speed rather than storage
  * it is splittable but requires additional indexing step
  * good for plain text files
  * is not distributed with hadoop, requires seperate install
  * compratively slower than snappy

**gzip**:

  * optimized for storage, 2.5x times compression compared to snappy
  * not splittable but can be used with container file formats like snappy
  * processing is slow, as compression is more it will have less blocks, can reduce block size to increase parellelism which will process faster

**bzip2**:

  * excellent storage, compress around 9% more comparitively to gzip
  * significantly slower, around 10x comparitively to gzip
  * splittable
  * might be used for archival


**Note**: snappy is used in mostly, as it provides good trade off between speed and size.
