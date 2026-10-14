---
title: Strings
description: Write words and sentences in Java. Concatenation, comparing text, and built-in String methods.
order: 5
---

# Strings

A **String** (yes the capital S is important) is an array of chars (a list of characters). For example:
```
String name = "Kat"; //contains the characters 'K', 'a', and 't'
System.out.println(name); //prints Kat in the console
```
*You have to use double quotation marks (`"`) when declaring a string.*

## Arithmetic with Strings..?? (concatenation)
We know that the `+` operator is usually used for addition, but when you try to add two Strings together, it actually **concatenates**: meaning it glues the text together.
For example:
```
String greeting = "What's up, ";
String name = "Shreya";
System.out.println(greeting + name); //prints What's up, Shreya in the console
```

Even if there are other integers in the expression, once a string is added, everything else will also be concatenated!!
```
int a = 1;
int b = 2;
int c = 3;
String greeting = "Hello";
System.out.println(a + b + greeting + c) //prints 3Hello3: 1 + 2 = 3, then concatenates Hello, then concatenates 3.
```

## comparing Strings

With numbers, `==` checks if they're equal. With Strings, `==` checks if they're the *same object*, so even if two Strings are `"kat"`, when compared, the program will return `false`.

```

String a = "cat";
String b = "cat";

System.out.println(a == b); //will print false!!!
```

To compare the *text inside* two Strings, use the `.equals()` method:

```

String a = "cat";
String b = "cat";

System.out.println(a.equals(b));       // true
System.out.println(b.equals("dog"));   // false

```
with the `.equals()` method, the case matters. So:
```
String a = "Cat";
String b = "cat";

System.out.println(a.equals(b)); // false
```

So, to ignore uppercase/lowercase, use `.equalsIgnoreCase()`:
```

String a = "cat";
System.out.println(cat.equalsIgnoreCase("CAT")); // true

```


## more String methods
Here's a table with more String methods & what they mean.
There are loads of String methods out there: search it up online and see what you get!! These are just some useful ones.

| method            | what it does                                                                       | example                           |
| ----------------- | ---------------------------------------------------------------------------------- | --------------------------------- |
| `length()`        | finds how many characters are in the String                                        | `"hello".length();` → 5           |
| `charAt(int)`     | finds the char at position `int` (starting at 0)                                   | `"hello".charAt(0)` → 'h'         |
| `substring(a, b)` | the text from a up to (not including) b                                            | `"hello".substring(1, 4)` → "ell" |
| `indexOf(text)`   | position where `text` **first** appears, returns -1 if `text` is not in the String | `"hello".indexOf("l")` → 2        |
| `toUpperCase()`   | all caps                                                                           | `"hello".toUpperCase()` → "HELLO" |
| `toLowerCase()`   | all lowercase                                                                      | `"YO".toLowerCase()` -> "yo"      |
