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


### strict val vs lazy val

default val is strict and evaluated when declared, lazy val is evaluated during first use

```scala
//full code will be executed and last expression will be returned
val a = {
  println("some print")
  1
  }
println(a) //output: 1
```

```scala
//full code will be executed when val is called in println
lazy val a = {
  println("some print")
  1
  }
println(a) 
//output: 
//some print 
//1
```


### default packages

default packages imported:

* java.lang._
* scala._
* scala.Predef._

example: to use `Math` we dont have to import any package as it is by default imported.


### scala apply

apply closes gap between object and function paradigme in scala, we can call an object like a function. 

So in singleton object if we have `apply` method then that can be called directly by object as a function without `apply` method name.

```scala
object Abc {
  def apply(i: Int) {
    println(s"$i is the value")
  }
}

Abc.apply(1) //output: 1 is the value
Abc(1) //output: 1 is the value
```


### diamond problem

in case of multiple inheritence, if same name of methods are used in parent classes then its a diamond problem, thats why scala does not support multiple inheritence.

```scala
class Abc {
  def func() = println("abc")
}

class Def {
  def func() = println("def")
}

//this is not supported and is diamond problem
class Ghi extends Abc, Def {
  func
}
```

**multiple inheritence** can be done in scala by traits

```scala
trait A {
  def func = println("A")
}

trait B extends A{
  override def func = println("B")
}

object C extends A with B
func //output: B
```

order here will be from right to left


### type safe

code will be compiled and error out in case of type mismatch

```scala
val i: Int = "abc"
```


### statically types vs dynamically types

**statically typed**

* type of variables are known at compile time 
* example scala, java, c
* better performance
* no runtime errors

**dynamically typed**

* type of variables are checked at runtime
* like python


### exception handling

**exception**: occurs due to some issue in code, example divide by zero
**error**: occurs due to system issues, example OOM

```scala
try {
  val a = 1/0
}
catch {
  case e: Exception => println("manual exception")
}
finally {
  println("last step")
}
```


### monad

monad is object that wraps another object. output of calculation is input to other.

```scala
val l1 = List(1,2,3)
val l2 = List(4,5,6)

l1.flatMap { x => l2.map {y => x + y} }
//output: List(5, 6, 7, 6, 7, 8, 7, 8, 9)
```


## ofDim

used to create multi dimensional array

```scala
val a = Array.ofDim[Int](2,2)
a(0)(0) = 1
for(i <- 0 to 1; j <- 0 to 1) println(a(i)(j))
```


### design patterns

**singleton design pattern**

restricts instansiation of class to one object and provide global access to it.

```scala
object a {
  //class level functionality
}
```

**lazy initialization**

initialization of instance on first access, to avaid expensive computation

```scala
val x = {
  println("a")
  1
}
```

```scala
lazy val x = {
  println("a")
  1
}
x
```

### diff between Array & ArrayBuffer

* both are mutable
* ArrayBuffer is resizable but Array isn't
* if we appand ArrayBuffer it gets larger but if append Array it will internally create new Array some performance hit
