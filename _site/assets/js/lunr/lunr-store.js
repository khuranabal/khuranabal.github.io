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
        "excerpt":"There are certain parameters to consider when chossing a file format. storage space consumption processing time io consumption read/write speed if data can be split in files schema evolution advanced compression compatible with framework like hive/spark etc. ways in which data can be stored row based: write is simple but...","categories": ["blog"],
        "tags": ["csv","xml","json","avro","orc","parquet","delta"],
        "url": "/blog/file-formats/",
        "teaser": null
      }]
