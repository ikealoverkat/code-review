---
title: Getting User Input
description: Make your programs interactive! Read what the user types with the Scanner class.
order: 3
---

# Getting User Input

## why let the user type input?
Programs are way more fun when they react to whoever is running them. Instead of hard-coding a name or a number, let the user type it in and watch your program respond.

## the Scanner class
To read input we use the `Scanner` class. It comes with java.util, so you import it at the top of your file:

```
import java.util.Scanner;
```

Then you create a Scanner that reads from the keyboard (`System.in`):
```
Scanner sc = new Scanner(System.in);
```

That one line is all the setup you need. Now `sc` can read whatever the user types!

## reading a whole number with nextInt()
```
Scanner sc = new Scanner(System.in);
System.out.print("Enter your age: ");
int age = sc.nextInt();
System.out.println("You are " + age + " years old.");
```
`nextInt()` waits for the user to type a whole number and presses enter. Whatever they type gets stored in the variable.

## reading a whole line with nextLine()
Use `nextLine()` when you want the whole sentence, spaces and all:
```
Scanner sc = new Scanner(System.in);
System.out.print("Say your name: ");
String name = sc.nextLine();
System.out.println("Hi, " + name + "!");
```

## other useful input methods
| method         | what it reads                     |
| -------------- | --------------------------------- |
| `nextInt()`    | a whole number like `42`          |
| `nextLong()`   | a big whole number                |
| `nextDouble()` | a decimal like `3.14`             |
| `nextFloat()`  | a decimal (less memory)           |
| `nextBoolean()`| `true` or `false`                 |
| `next()`       | the next word (no spaces)         |
| `nextLine()`   | the whole rest of the line        |

## using the playground's input box
The playground has an **Input** box. Whatever you type there becomes the user's keyboard input — one value per line.

```
import java.util.Scanner;
Scanner sc = new Scanner(System.in);
int a = sc.nextInt();
int b = sc.nextInt();
System.out.println(a + b);
```
Type `5` and `10` in the input box, press Run, and watch it print `15`.

## extra practice
Write a program that asks for the user's favourite number, then prints that many stars:
```
System.out.print("How many stars? ");
int n = sc.nextInt();          // needs a Scanner first!
while (n > 0) {
    System.out.println("*");
    n--;
}
```
(Forgot the `Scanner sc = new Scanner(System.in);` line? Add it.)