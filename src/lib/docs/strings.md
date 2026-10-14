---
title: Strings
description: Write words and sentences in Java. Concatenation, comparing text, and built-in String methods.
order: 5
---

# Strings

A **String** is a sequence of characters — basically text. In Java, `String` is a class, with a capital S, and it has a bunch of built-in methods that make working with text easy.

```
String name = "Kat";
System.out.println(name);
```

## arithmetic... with Strings...? (concatenation vs. addition)
The `+` operator does double duty. With numbers it **adds**; with Strings it **concatenates** (glues text together).

```
int a = 5;
int b = 3;
System.out.println(a + b);         // 8 (addition!)

String x = "5";
String y = "3";
System.out.println(x + y);         // "53" (concatenation!)

System.out.println("5" + 3);       // "53" — one String turns it into text
System.out.println(5 + 3);         // 8
```

Tip: when a String meets a number, the whole thing becomes text. This is why printing is so convenient:
```
System.out.println("You have " + 3 + " lives left."); // "You have 3 lives left."
```

## comparing Strings (we can't simply use ==!)
With numbers, `==` checks if they're equal. With Strings, `==` checks if they're the *same object*, which is a lie you'll discover.

```
String a = "cat";
String b = "cat";
System.out.println(a == b);        // usually false in real Java. Not what you want!
```

To compare the *text inside* two Strings, use the `.equals()` method:

```
String a = "cat";
String b = "cat";
System.out.println(a.equals(b));       // true
System.out.println(b.equals("dog"));   // false
```

And to ignore uppercase/lowercase, use `.equalsIgnoreCase()`:
```
String ans = "YES";
System.out.println(ans.equalsIgnoreCase("yes")); // true
```

Use pattern: when checking user input, almost always compare like this:
```
if (input.equals("quit")) {
    System.out.println("Goodbye!");
}
```

## more String methods
Here's a cheat sheet of the common ones:

| method                  | what it does                                | example                               |
| ----------------------- | ------------------------------------------- | ------------------------------------- |
| `length()`              | how many characters                         | `"hello".length()` → 5                |
| `charAt(i)`             | the char at position i (starting at 0)      | `"hello".charAt(1)` → `'e'`           |
| `substring(a, b)`       | the text from a up to (not including) b     | `"hello".substring(1, 4)` → "ell"     |
| `indexOf(text)`         | position where text first appears, -1 if not| `"hello".indexOf("l")` → 2            |
| `toUpperCase()`         | all caps                                    | `"hi".toUpperCase()` → "HI"           |
| `toLowerCase()`         | all lowercase                               | `"HI".toLowerCase()` → "hi"           |
| `equalsIgnoreCase(t)`   | equals, ignoring case                       | `"YES".equalsIgnoreCase("yes")` → true|
| `contains(text)`        | does this contain text?                     | `"hello".contains("ell")` → true      |
| `trim()`                | removes spaces at the start and end         | `"  hi  ".trim()` → "hi"              |

Characters are numbered from **0**, not 1:
```
String word = "java";
System.out.println(word.charAt(0)); // 'j'
System.out.println(word.charAt(3)); // 'a'
```

## extra practice
- Ask for the user's name and print how many letters it has: `name.length()`.
- Print someone's initials: take the first char of first and last name.
- If the user types the magic word (case-insensitive), print a secret message.