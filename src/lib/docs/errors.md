---
title: Errors
description: types of errors & how to avoid them (if-else, try-catch)
order: 6
---

# Errors
Errors, also known as exceptions, are problems in your code. oh no!!!!!!
## syntax vs. logic errors
### syntax errors
A syntax error in Java is like a grammar error in English. Syntax errors are compile-time errors: the program won't compile or run until you fix the error.

**Common syntax errors:**
- missing semicolon `int x = 5` (forgot `;`)
- missing closing bracket `if (x > 0 {` 
- misspelling a variable name
```
int number = 5;
System.out.println(nmuber); // spelling mistake; the code won't run
```

Syntax errors are usually easy to fix because the compiler will provide an error message with the exact line where the exception occurred.  
### logic errors
A logic error is a runtime error: the program runs fine but it doesn't do what you wanted it to do. For example, if you made a program to add two numbers and it actually subtracts the numbers, that'd be a logic error.
```
// This program intends to find the average of two numbers.
int num1, num2;
System.out.println(num1 + num2 / 2); //due to BEDMAS, the program will first divide num2 by 2 before adding num1. This is not the logic we want!!!

// corrected version:
System.out.println((num1 + num2) / 2); //brackets added so first we add the 2 numbers, then divide by 2.
```
There's no error message for a logic error. Read your code carefully and test your code periodically instead of coding everything in one go and having loads of errors to fix!

## error checking with if-else & try-catch statements
Sometimes, errors happen when the program is running, like when you're using the Scanner to get an `int` but the user inputs `twelve`. We can use if-else statements and try-catch statements to grab these errors and keep going instead of crashing.

When error checking with **if-else**, use the `hasNextInt()` method and only run the desired code if `hasNextInt()` returns `true`. Otherwise, send the user an error message.
```
import java.util.Scanner;

Scanner console = new Scanner(System.in);
int age;

System.out.println("how old are you?" );
if (console.hasNextInt()) {
	System.out.println("you are " + age + " years old");
} else {
	System.out.println("input an integer!");
}
```

There's actually a bunch of methods like this:

| method            | what it checks for           |
| ----------------- | ---------------------------- |
| `hasNextInt()`    | if the user input an integer |
| `hasNextDouble()` | if the user input an double  |
| `hasNextLine`     | if the user input anything   |

### try-catch
try-catch statements let you grab the error and keep going instead of crashing! They consist of two blocks: the `try` block and the `catch` block. The `catch` block must state the type of Exception it's trying to catch. When you run a try-catch statement, It first tries the code in the `try` block, and if an exception (error) occurs, it will run the code in the `catch` block instead. You can only have one `try` block, but you can have multiple `catch` blocks for different types of exceptions.
For example:
```
import java.util.Scanner;
Scanner console = new Scanner(System.in);

try {
    System.out.println("Enter a number: ");
    int num = console.nextInt();
    System.out.println("You picked " + num);
} catch (InputMismatchException e) {
	System.out.println("Exception: "  + e + "Input an integer.");
} 
catch (Exception e) {
    System.out.println("Exception: " + e);
}
```
In the `catch` blocks, we tell the user what the exception was by printing `e`.


*Note: the try-catch & many built-in exceptions may not run in the playground because I made my own Java interpreter with Typescript and it doesn't have a LOT of things. Try it on IntelliJ/your own computer!*