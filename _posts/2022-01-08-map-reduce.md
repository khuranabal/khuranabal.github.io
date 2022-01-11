---
title: "MapReduce working"
date: 2022-01-11T14:13:00-00:00
categories:
  - blog
tags:
  - mapreduce
---


MapReduce is programming model for processing big datsets. It consists of two stages:
* map
* reduce

Both works on key value pairs.

key     | value |
id      | 1     |
name    | abc   |

![mapreduce input output](/assets/images/mapreduce/mapreduce-input-output.png)


### Understanding with example

Lets say we have a big file (size 100GB) and we need to find frequency of words.
By default block size is 128MB so data will be divided as per block size and distributed among nodes. Considering with default one reducer.

![sample data](/assets/images/mapreduce/sample-input-output.png)

Clearly the input is not in key value format, so here record reader is used to read input file and convert each line in key vaule pair. Here each line will be assigned a key by record reader and the vaule will be the actual line content.

Mapper logic: Just take the vaules, and split on space to find words and assign word as key and 1 as vaule. 

Shuffle & Sort: Transfer all the key vaule pairs on to single machine (reduer). Sorting will happen on keys, for example output will be in format: (key, {vaule, vaule, ...})

Reducer logic: Iterate over list of vaules in a key and sum it up.

![processing](/assets/images/mapreduce/processing.png)


Note: 
* Number of mappers will be equal to number of data blocks.
* Number of reducer is set by developer default is 1 but we can set to 0 or any higher number.
* System take care of shuffle and sort operation.
