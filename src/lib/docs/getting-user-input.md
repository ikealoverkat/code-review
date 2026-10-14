---
title: Getting User Input
description: Make your programs interactive! Read what the user types with the Scanner class.
order: 3
---
# Getting User Input
Programs are more fun for the user when they can actually interact with the program. Instead of hardcoding values, here's how you can let the user type them in!

## Scanner
Tol read input, we use the `Scanner`. You have to input it from Java, so at the very top of your file, write:
```
import java.util.Scanner;
```

Then, create a scanner that reads from the keyboard (`System.in`):
```
Scanner console = new Scanner(System.in);
```

You just set up a Scanner!! Now, the scanner can read whatever the user types!

## Reading inputs with nextInt()
```
Scanner console = new Scanner(System.in); // set up Scanner
System.out.println("Enter your age: "); // tell the user to enter their age. (If we don't do this, the user won't know what to do.)
int age = console.nextInt();
System.out.println("hi, you're " + age + " years old.");
```
In this program, the `nextInt()` waits for the user to type an integer and press enter. Whatever they enter gets stored in the `age` variable.

## Reading a whole line with nextLine()
use nextLine when you want to get a line of user input. It will store the user's input as a String.
```
Scanner console = new Scanner(System.in); // set up Scanner
System.out.println("What's your name?"); 
int name = console.nextLine();
System.out.println("Hi, " + name + "!");
```

## useful input methods

| method          | what it reads                                 |
| --------------- | --------------------------------------------- |
| `nextInt()`     | the next integer like `49`                    |
| `nextDouble()`  | the next double like `3.14`                   |
| `nextFloat()`   | the next float (like double with less memory) |
| `nextBoolean()` | `true` or `false`                             |
| `next()`        | the next word (no spaces)                     |
| `nextLine()`    | the next entire line                          |
