---
title: "scala part I"
date: 2022-01-28T16:27:00-00:00
categories:
  - blog
tags:
  - scala
---

spark code can be written in different languages (scala, python, java, r), scala is hybrib, oops + functional.

ways to write code:
* REPL: do directly in scala terminal, to view result intractively
* IDE: eclipse, vs code etc.


### why scala

* scala gives best performance as directly scala code can work in jvm, no seperate process required. However in python, a process intreacts with jvm, so an extra layer. In java, bulky code.
* whenever new release happen it is avaialble in scala first then in other languages
* spark is also written in scala
* scripting way, concise code
* functional, supports pure functions and immutable values. Natural fit for library design and data crunching thats why spark libraries are written in scala

**Note:** function relates input to output like maths sqrt

### scala basics

#### val & var

val: constant, cannot be changed once declared
`val a: Int = 2`

var: variable, can be changed
`var a: Int = 2`

**type inference**: if data type is not mentioned then scala will infer data type
`var a = 2`

#### data types

Int     | 4 bytes
String  | sequence of chars
Boolean | true/false
Char    | 2 byte
Double  | 8 bytes
Float   | 4 bytes
Long    | 8 bytes
Byte    | 1 byte

**Note**: 
* after the value, have to give f in float and l in long
* concat is done using `+` can even do with mixed data types


#### interpolation

**s interpolation (string interpolation)**:

```scala
val name:String = "abc"
println(s"hello $name") //output: 'hello abc'
```

**f interpolation**:

```scala
val v:Double = 3.145
println(f"value is $v%.2f") //output: value is 3.14
```

**raw interpolation**:

```scala
println("value is \n 10") //it will give new line
println(raw"value is \n 10") //it will give as is text with \n in print
```

**Note**: in a block of code last statement is the return statement


### conditional

#### if else

```scala
if (1>2) println("hi") else println("ih")
```

#### match

it is like switch
```scala
val n = 1
n match {
  case 1 => println("1")
  case 2 => println("2")
  case 3 => println("3")
  case _ => println("in else")
}
```

### loop

#### for loop

```scala
for (x <- 1 to 10) {
  val i = x*2
  println(i)
}
```

#### while loop

```scala
var i = 0
while (i <= 10) {
  println(i)
  i = i + 2
}
```

#### do while loop

```scala
var i = 0
do {
  println(i)
  i = i + 2
} while (i <= 10)
```


### collections 

#### array

* start from index 0
* array is muttable
* searching on index is fast
* adding new element is inefficient
* it is val but still values in array can be changed, if we try to assign new array then it will not allow

```scala
val a = Array(1,2,3,4)
println(a.mkString(","))

for (i <- a) println(i)
```

#### list

* holds element in singly linked list
* searching is not effecient
* adding new element at start is effecient
* lot of system defined functions are available to use in the list

```scala
val b = List(1,2,3,4)
println(b.head) //it will give 1
println(b.tail) //it will give everything other then head, List(2,3,4) 
for (i <- b) println(i)

b.reverse
```

* adding a new element at start of list is effecient.
ex: 
`10 :: b //will add 10 in start of list`

#### tuple

* can treat like record in table
* can have diff data type
* it start with index 1
* if tuple has only 2 element then it can treated as key value pair

```scala
val c = ("abc",1000,true)
println(c._1) // this will retrun the first element
```

#### range

range of values

```scala
val r = 1 to 10 // this gives including 10 we can also use until to exculde the last vaule
for (i <- r) println(i)
```

#### set

* hold only distinct vaules
* order is not maintained

```scala
val s = Set(1,1,2,2,2,3,4) // it will save only distinct values un ordered
min, max, sum like functions can be used on it
```

#### map

* collection of key value pair
* with key can search value
* hold unique key only if repeating the latest one will be used

```scala
val m = Map(1 -> "abc", 2 -> "def")
m.get(2)
```

**Note**
* only array is muttable others are immuttable in collections
* Array, List, Tuple order is maintained


### pure function

if all three below properties satisfy then function is pure

* input determines output. ex: dollar to rs conversion function accepts only dollar then it has to be depndent on some conversion if not passed then its impure function.
* function does not change input vaule. ex: input to function if changed in the function then its impure
* no side effects. ex: if println used in function then impure

easy way to check if function is pure: referential transparency- if replacing the function with vaule do not impact result. ex: sqrt(4) where called can be replaced with 2


### first class function

a. whatever we can do with values in traditional languages, same should be able to do with function, treat function like values.

```scala
val a: Int = 1

def sample(i: Int): Int = {
  i * 2
}

val a = sample(_)

a(5) // this should return 10
```

b. should be able to pass function as param to function

```scala
def func(i: Int): Int = { i * 3 }

def func2(i: Int, f:Int => Int) = {
  f(i)
}
```

c. return function from function

```scala
def func = {
  x: Int => x*x
}
```

Note: by default all function are first class in scala

### higher order func

function which either takes function as input parameter or returns another function as output

ex: map function

map: if n input rows then we get n output rows

```scala
var a = 1 to 10

def sample(i: Int): {i * 2}

a.map(sample) # this will double all the rows
```


### anonymous function

without name function, same previous example can be done by below. mostly used with higher order func as shown in example map

```scala
var a = 1 to 10
a.map(x => x * 2)
// similar to lambda in python
```

**Note**: val is preffered over var because of immutability


### loop vs recursion vs tail recursion

**find factorial using loop**

```scala
def factorial(input: Int): Int = {
  var result: Int = 1
  var i: Int = 1
  for(i <- 1 to input)
  {
    result = result * i
  }
  return result
}
//here we are mutating result and i, in scala val are preffered over var
```

**find factorial using recursion**

```scala
def factorial(i: Int): Int = {
  if (i == 1) 1
  else i * factorial(i - 1)
}

//this solves problem for mutating but it takes memory to capture all entries until terminating condition reached. for large calculation it might go for out of memory
```

**find factorial using tail recursion**

```scala
def factorial(i: Int, result: Int): Int = {
  if (i == 1) result
  else factorial(i - 1, result*i)
}

//in this only the last statment is hold in memory as required data is only in last statement.
```

### statement vs expression

* each line of code is statement
* expression is line of code that returns something
* in scala we only have expression no statements, so every line of code returns something

### closure

* in functional programming a function can return a function
* in oops we can return an object

object has data elements like variables and functions, in functional we have only functions. so how to get data elements, thats where we use closure, in function it can have local variable which can be used thats called closure.


### Type system

![scala type system](/assets/images/scala/scala-type-system.png)


### operator

there are no operators in scala only methods

```scala
1 + 2
//here + is method, it is short of a.+(b)
//can be done as a + b
//we can see all methods available by a.tab
```

### placeholder syntax

```scala
val a = 1 to 100
a.map((x:Int) => x * 2)

//here always we have one input param then we can remove it and replace with placeholder syntax

a.map(_ * 2)
```


### partially applied functions

this is an act of creating brand new functins by fixing one or more parameters in a function

```scala
def func1(x: Double, y: Double) = {x/y}
func1(10,3)
val inverse = func1(1, _: Double)
inverse(10)
```


```scala
def sum(x: Int, y: Int, f: Int => Int) = {
  f(x) + f(y)
}

sum(2,3,x=>x*x)
sum(2,3,x=>x*x*x)

val sum_of_squares = sum(_:Int, _:Int, x=>x*x)
sum_of_sqaues(2,2)
```


### function currying

syntactic sugar, similar to partially applied function

```scala
def sum(f:Int => Int)(x:Int, y:Int) = {
  f(x) + f(y)
}

val sum_of_sqaues = sum(x=>x*x)_
sum_of_sqaues(2,2)
```

### class

class contains data + function

```scala
class Person //empty class

val i = new Person //instantiate class

println(i) //reference of class will be printed
```

```scala
class Person(name: String) //constructor

val i = new Person("Abc") //instantiate class

println(i.name) //it will error as "name" is parameter not member
```

```scala
//to resolve we need to define class as below
class Person(val name: String)
val i = new Person("abc")
println(i.name)
```

```scala
class Person(val name: String, number: Int) {
  val i = 1

  def method1 = number * 2

  def method2(s: Int) = s * 5
}
val p = new Person("abc", 2)
println(p.name) //output: abc
println(p.method1) //output: 4
println(p.method2(3)) //output: 15
```

#### class level functionality

for a class we instantiate an instance but if we require some static value to be used by all instances then we can use object to do that. In other languages usually we call object of class is instansiated but here in scala object is for static values and instance is created for class.

```scala
object Person {
  val fix_value = 1
  def is_fix: Boolean = true
}
```

**Note**:

* having object and class with same name, this is companion design pattern
* singleton design pattern is used using object


### inheritance

* child class inherits propetry of parent class
* child class can inherit only one parent, mutiple inheritence is not possible

```scala
class Abc {
  def method1 = println("in method1")
}

class Def extends Abc {
  def method2 = println("in method2")
}

val v = new Def
v.method1
v.method2
```

### access modifiers

* private: child class cannot access member of public class
* protected: child class can call member of parent class inside child class only not in instance instantiation of child class
* no modifier (public)

```scala
class Abc {
  private def method1 = println("in method1")
}
```


### abstract class

* can contain unimplemented methods and undefined values
* implement later by inheritance in child class
* instance cannot be created for abstract class
* some methods can have defination also

```scala
abstract class Abc {
  def method1
}
```


### trait

* similar to abstract class, inheritence can be done only on one abstract class, but traits can be used to do multiple inheritence
* traits cannot have constructor parameter

```scala
  trait Ghi {
    def method2
  }

trait Jkl {
  def method3
}

class Mno extends Abc with Ghi with Jkl {
  def method1 = println("in method1")
  def method2 = println("in method2")
  def method3 = println("in method3")
}
```


### case class

special class where need to write less code

```scala
case class Abc(name: String, number: Int)

val i = new Abc("a", 1)
println(i.name) //note here val is not required in parameter to make it memeber

println(i.toString) //with normal class it prints reference but here we get Abc(a,1)

println(i) //even without toString it works fine

val j = new Abc("a", 1)
println(i == j) //in normal class it check reference which give false but here it will return true

//when case class created then a companion object is already created

val k = i.copy() //copy method 

val k = i.copy(number=5) //data can also be modified in copy menthod

//case classes are serializable
```

<!--
### check more on singleton
-->

### Sources

* https://docs.scala-lang.org/tour/unified-types.html
