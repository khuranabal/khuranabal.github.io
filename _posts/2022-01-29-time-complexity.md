---
title: "time complexity"
date: 2022-01-28T16:27:00-00:00
categories:
  - blog
tags:
  - time complexity
  - data structures
---



A way to calculate time consumed by an algorithm, as a function of input.

### example1

lets say we have an array `a = 1 5 3 7 2`
Q: find element at index 2?
A: as we can do array get (random access) at index, time complexity will be O(1)


### example2

lets say we have an array `a = 1 5 3 7 2`
Q: find 3
A: if we search from first to last then best case we get is first element then time complextity O(1) and worst case it can be last element then time complexity O(n).
Time complexity is taken considering worst case scenario.


### example3

lets say we have sorted array `a = 1 2 3 5 7` 
Q: find 3
A: then we can do binary search to improve time complexity
`middle element = (lowest index + highest index) / 2`
check middle element and based on it go left or right and repeat. So, here will take O(3) but in previous way it would have taken O(5), so here O(logn).
Why logn: as if there were 1024 elements in array and we did binary search it will lead to result in 10 searches log 1024 = 10 (with base 2 in log calculation)

**Note**:
As only max can be considered.
* In case time complexity is n + log n then we can say it is n
* In case time complexity is n2 + n + log n then we can say its n2


### example4
Q: 1000 elements find if duplicate is present
A: Options-

  1.  brute force: check all (one by one) with remaining starting from first element, first go check all n-1, second go start from 2nd and check remaining n-2, and soon. So it will be O(n2) complexity.
  2.  sort first: best sorting has complexity of O(nlogn) quicksort and merge sort, then we can start from first element and if second element is match then duplicate or else check 2nd and third element this way we will scan full array only once. complexity will be n, so, complexity will be O(nlogn) + O(n), equivalent to O(nlogn)

### example5
Q: 1000 elements find element which repeats maximum number of times
A: options-

  1.  brute force: same as above O(n2)
  2.  sort first: complexity nlogn for sort, then in single scan we can now how many times each element occurs. So again complexity nlogn + n equivalent to nlogn

### example6
Q: 1000 elements, 1 missing in the range 1-1000
A: options-

  1.  brute force: O(n2)
  2.  sort first: nlogn, then in one scan we can find missing element so nlogn
  3.  calculate sum of first 1000 numbers, then get sum of all elements in array O(n) then subtract and find the missing number, complexity O(n)
