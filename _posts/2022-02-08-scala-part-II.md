---
title: "scala part II"
date: 2022-01-28T16:27:00-00:00
categories:
  - blog
tags:
  - scala
---


* scala runs on top of jvm
* scala is like java so requires main, or we can `extends App` then we dont have to define main method

```scala
//define main method
object example {
  def main(args: Array[]) = {
    println("hello")
  }
}
```

```scala
//define without main method
object example extends App{
  println("hello")
}
```

```scala
//variable length arguments
object example extends App{
  func("a", "b", "c")

  def func(name: String*) = {
    for(i <- name) {
      println(i)
    }
  }
}
```


### difference between Nil, null, None, Nothing, Option, Unit

**Null**

Null is a trait in scala, only one instance of Null exists that is null, we should restrict use of null beacuse it can lead to null pointer exception.

```scala
object example extends App{
  //func("hello") //it will fail
  func(null) //only this will work as input can only be null
  def func(a: Null): Unit = {println("a")}
}
```

**Nil**

It is an empty list.

```scala
object example extends App{
  val c = Nil
  println(c)
}
```

**Nothing**

Its trait, without any instance. Nothing means there was an exception and nothing was returned.

```scala
object example extends App{
  def func() = {
    throw new Exception
  }
}
```

**Option**

In a function if no useful value to return. null return is not preferred. There is inbuilt solution for this

```scala
object example extends App{
  def func(n: Int): Option[String] = {
    if(n >= 0) Some("value")
    else None
  }

  def printfunc(n: Int) = {
    func(n) match {
      case Some(str) => println(str)
      case None => println("None data")
    }
  }

  printfunc(5) //output: value
  printfunc(-1) //output: None data
}
```

**Unit**

* It is like void in java
* Nothing means there was error and nothing return
* Unit means there are side effects

```scala
object example extends App{
  def func() = {
    println("hello")
  }
}
```

**Alternate of null**

we should not use `null` as it can lead to null pointer exception. alternate is to use `Option`


```scala
//null pointer exception issue
object example extends App{
  class Abc(n: Int) {
    var a: String = null
  }

  val v = new Abc(1)
  println(v.a.length)
}
```

```scala
//gracefull way of handling no data and avoid null point exception
object example extends App{
  class Abc(n: Int) {
    var a: Option[String] = None
  }

  val v = new Abc(1)
  println(v.a.getOrElse("no data"))

  v.a = Some("new data")
  println(v.a.getOrElse("no data")) 
}
```


### yield

```scala
val a = for(i <- 1 to 10) {
  i*i
}
println(a) //output: ()

val b = for(i <- 1 to 10) yield {
  i*i
}
println(b) //output: Vector(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)
```

**vector**

* mix of Array & List
* provide index support as Array
* immutability as List

**if guard**

same code above if done for alternate vaules produces all output and where codintion in loop does not match there it returns `Unit`. This can  be solved using `if guard`

```scala
val a = for(i <- 1 to 10) yield {
  if(i%2==0) i*i
}
println(a) //output: Vector((), 4, (), 16, (), 36, (), 64, (), 100)

val b = for(i <- 1 to 10; if i%2==0) yield {
  i*i
}
println(b) //output: Vector(4, 16, 36, 64, 100)
```

**pattern guard**

case statements can be combined with `if guards` to provide extra logic during pattern matching.

```scala
def func(c: Int) {
  c match {
    case a if a>=0 => println("+")
    case b if b<0 => println("-")
  }
}
func(10) //output: +
func(-1) //output: -
```

**Note**: whenever pattern guard is used then we have to cover all conditions in case case if not then we might run into exceptions

**for comprehension**

each `for loop` converted to comprehension as shown below for better performance

```scala
for(i <- 1 to 10) println(i)

(1 to 10).foreach(println) //scala does this behind the scene "for comprehension"
```


### difference between scala & java

* in java `==` is reference comparision, in scala it checks value
* in scala `==` is same as `.equals` as in scala only methods/functions are present, no operators
* in jave `==` is operator but in scala it is method
* for reference comparision in scala we can use eq

```scala
val a = "dummy"
val b = "dummy"

a==b //output: true
a.==(b) //output: true
a.equals(b) //output: true
a equals b //output: true
```
