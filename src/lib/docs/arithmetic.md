---
title: Arithmetic
description: Do math in Java: learn about operators, integer division, and type casting.
order: 2
---
# Arithmetic
Arithmetic allows Java programs to do math! You can use arithmetic operators to calculate totals, averages, sums, distances, and more. Plus, programs can do math way faster than if you were to do it by hand.

Java supports the following arithmetic operators:

| operator | operation           | example | result |
| -------- | ------------------- | ------- | ------ |
| +        | addition            | 5 + 3   | 8      |
| -        | subtraction         | 5 - 3   | 2      |
| *        | multiplication      | 5 * 3   | 15     |
| /        | division            | 6 / 3   | 2      |
| %        | modulus (remainder) | 7 % 3   | 1      |
**"What in the world is a modulus???"** The modulus operator (%) returns the remainder after division. So, 10 % 5 would return 0, but 11 % 5 would return 1. You can use it to check if a number is a factor of another one. It can also help determine whether a number is even or odd.
```
System.out.println(10 % 2); // returns 0, which means 10 is even
System.out.println(15 % 2); // returns 1, which is not 0. therefore, 15 is not even
```

## integer division is special
When you divide two `int`s in Java, unlike in normal math where you can either get an integer or a decimal number, Java just chops off the decimal part. No rounding, it just chops the decimal off.
```
int i = 7 / 2 // returns 3, not 3.5
int k = 9 / 10 // returns 0
```

If you want a decimal number, make at least one of the numbers a `double`.
```
double j = 7.0 / 2 // returns 3.5
double h = 9 / 10.0  // returns 0.9
```

## order of operations
Java follows BEDMAS just like regular math!! Follow BEDMAS to make sure that your programs run the way you want!!!
```
int k = 2 + 3 * 4 // returns 14 (multiplication first)
int s = (2 + 3) * 4 // returns 20 (brackets first)
```

## what is type casting?
What if you have data in one type but need it in another? You can force it by **type casting**.
Put the type in brackets before the value you want to cast. For example:
```
int i = (int) 7.5; // i will be 7. you cast i to an int by putting the (int) infront of the value. 

// another example:
double d = 12.65;
int k = (int) d; // k will be 12.
```

Try some arithmetic operations in the playground!