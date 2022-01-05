---
title: "Build and deploy static website using jekyll and github pages"
date: 2022-01-04T15:00:00-00:00
categories:
  - blog
tags:
  - jekyll
  - github
---


### Installation
Following are required to be installed in order to build and test the static website locally.
Installation instructions [here][install]
1. ruby
2. rubygems
3. gcc
4. make


### Prerequisite
Use template repo to get started, we are using minimal-mistakes theme of jeykell, feel free to use any other theme if required. Get all the content from [repo][template]

Test if its working fine on local by executing below command and then browsing on localhost:4000
```sh
bundle install
bundle exec jekyll serve
```

Note: config/post can be modified/added as required, follow [docs][docs]


### Configure pages and deploy to github

1. make repo and configure github settings to enable pages, follow [here][pages]
2. push code to the new created repo
3. access githubpages url, if the repo created is `username.github.io` then url will be `https:\\username.github.io` 

### Enabling feature to add comments in the blogs

In order to enable comments feature we have mutiple options and here we have used github issues where all the comments in the blog will be stored.
To enable, follow [here][comments]

Note: It will not show comments locally, it will only work once pushed to github on githubpages url.

[install]: https://jekyllrb.com/docs/installation/
[template]: https://github.com/mmistakes/mm-github-pages-starter
[docs]: https://mmistakes.github.io/minimal-mistakes/docs/configuration/
[pages]: https://docs.github.com/en/pages/quickstart
[comments]: https://mmistakes.github.io/minimal-mistakes/docs/configuration/#utterances-comments