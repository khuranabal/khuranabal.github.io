---
title: "cassandra"
date: 2022-01-26T14:25:00-00:00
categories:
  - blog
tags:
  - cassandra
  - nosql
  - hbase
  - database
---


### features

* distributed column oriented database
* highly performant
* scalable
* transactional
* low latency retrieval
* availibilty and partition tolerance guarentees with tunable consistency
* no master, multi master
* decentralized architecure
* highly available
* for communication among peers use gossip protocol

Example: where eventual consistency is fine like social media comments/likes

### tunable consistency

In default setup, it uses eventual consistency. Below are the steps which will be performed when a request is submitted by client to cassandra.

1. client send request to get some data
2. request is received by a machine in cassandra cluster lets say node2
3. node2 will get data from the nodes which have data lets say node1
4. node2 will return the response to client

But we can tune consistency to:

* check all node: all machines in cluster agrees on the same result
* check quorum: certain number of machine agrees on the same result


### hbase vs cassandra

hbase                                 | cassandra
nosql                                 | nosql
scalable                              | scalable
transactional                         | transactional
low latency                           | low latency
master slave architecture             | no single master, muti master
CP guarentee                          | AP guarentee, with tunable consistency
runs on hadoop cluster                | dedicated cluster required

**Note**: cassandra has its own query language cql, its similar to sql
