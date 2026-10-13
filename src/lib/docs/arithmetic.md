---
title: Arithmetic
description: Do math in Java! Learn the operators, integer division, and how to cast between number types.
order: 2
---

# Arithmetic

## what are the math operators?
Java has the same basic math operators you know from math class:

| operator | meaning            | example         |
| -------- | ------------------ | --------------- |
| `+`      | addition           | `3 + 4` → 7     |
| `-`      | subtraction        | `10 - 4` → 6    |
| `*`      | multiplication     | `6 * 7` → 42    |
| `/`      | division           | `20 / 5` → 4    |
| `%`      | remainder (modulo) | `17 % 5` → 2    |

You put them together with variables and numbers to make expressions:
```
int score = 20;
int bonus = 5;
int total = score + bonus;
System.out.println(total); // 25
```

## division works differently for ints!
If both numbers are `int`s, Java does **integer division**: it chops off the decimal part.

```
int x = 7 / 2;   // 3  (not 3.5!)
int y = 9 / 10;  // 0
```

If you want a decimal answer, make at least one of the numbers a `double`:
```
double d = 7.0 / 2;  // 3.5
double e = 7 / 2.0;  // 3.5
```

## the remainder operator `%`
`%` gives you the remainder after division. It's super useful for checking if something is even or odd:

```
int x = 17 % 5;     // 17 = 3*5 + 2, so x is 2
int even = 8 % 2;   // 0  (even numbers have remainder 0 when divided by 2)
int odd  = 7 % 2;   // 1
```

## order of operations
Java follows BEDMAS like math class. Use parentheses to make it obvious:
```
int a = 2 + 3 * 4;   // 14 (multiplication first)
int b = (2 + 3) * 4; // 20 (parens first)
```

## type casting
Sometimes you have a number in one type but need it in another. You can force it with **casting**:

```
double d = 7.5;
int x = (int) d;   // x is 7 (the decimal part is dropped)
int a = 7;
double b = (double) a; // b is 7.0
```

Remember: casting a `double` to an `int` **truncates** — it just cuts off the decimal part, it doesn't round.

```
int rounded = (int) 7.9; // 7, not 8!
```

## try it out
```
int minutes = 135;
int hours = minutes / 60;
int extra = minutes % 60;
System.out.println("That's " + hours + " hours and " + extra + " minutes.");
```

Play with the numbers and the operators in the playground to see what changes.