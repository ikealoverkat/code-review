---
title: Variables & Data Types
description: The first ever ICS3UR lesson. Learn how to store data (numbers, letters, etc.) using Java!
order: 1
---

# Variables & Data Types

## what is a variable?
You might know what a variable is already from math class: a number that has a certain value. In programming, variables are similar in that they also have certain values. However, they can store all kinds of data, like words, ASCII characters, integers, decimal numbers, etc.


## what is a data type?
When we declare a variable (that's a fancy word for making a new variable), we have to give it a data type. A **data type** is the type of data a variable can store: like previously mentioned, words, characters, integers....


Here's a table of some primitive (basic) data types! there are also more complex ones like **Strings** (Strings are basically lists of chars. Yes the capital letter is important it's not a typo.

| data type | what it is                                                                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| int       | Integer: whole numbers without decimals (ex. 4)                                                                                                                  |
| float     | Floating-point: numbers with fractional or decimal parts (ex. 3.14, -0.01) Uses less memory than a double but is only precise up to ~6 decimal places.           |
| double    | Double-precision floating-point: numbers with fractional or decimal parts (ex. 3.14, -0.01) More commonly used than a `float`. Precise up to ~16 decimal places. |
| char      | Character: **one** single ASCII character. (ex. '#', 'a', 'E'). Uses single quotations.                                                                          |
| bool      | Boolean: either true or false                                                                                                                                    |
| String    | A string of characters. Technically not a primitive data type but is very useful in this course anyways. Uses double quotations (ex. "Hello, World!")            |


So, now that we know what variables and data types *are*, how do we use them in programming?



Declare a variable by stating its type and name:
```
int age;
```
*Make sure to add the semicolon at the end! Semicolons are like periods in Java programming: they tell the program when each line ends.*


Initialize a variable by assigning it its first value.
```
age = 16;
```

You can declare & initialize in one step.
```
int age = 16;
```

You can also initialize multiple variables of the same data type at once.
```
int age, sisterAge;
```

You must initialize a variable before using its value. Otherwise, you'll get an error!
```
int age;
System.out.println(age); // error D:
```

However, declaring a variable without initializing it can be useful when you plan to assign its value later.


## print statements
It may be worth mentioning that you can print an output to the console by running these commands:
```
System.out.print("This will print out onto the console.");
System.out.print(" Look, this is on the same line as the other sentence.");
System.out.println("Wow! A new line!");
System.out.print(4); // you can also print numbers.
```


## comments
You'll also be seeing those two forward-slashes: `//` a lot. That means it's a comment! It's a comment for the humans reading the code (so, you and anyone else that you want show your code to) to read, and the compiler won't run the comments. you can also write a multi-line comment with `/* */`. For example:
```
// single line comment!
/* 
ultra cool comment
with tons of lines
yap yap yap
how awesome is that?
*/
```
