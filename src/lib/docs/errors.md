---
title: Errors
description: Nothing goes wrong until it does. Learn the two kinds of errors and how to survive them with try-catch.
order: 6
---

# Errors

Bugs happen to everyone. The good news: there are only two main flavours, and each is easy to handle once you know what to look for.

## syntax vs. logic errors

### syntax errors
A **syntax error** is a typo or a broken rule of the language. The program won't compile — Java literally refuses to run it until you fix the code.

Common syntax errors:
- missing semicolon: `int x = 5` (forgot `;`)
- missing closing bracket: `if (x > 0) {` (never closed with `}`)
- misspelling a keyword or variable name
- wrong quotation marks

```
int x = 5;             // forgotten semicolon → syntax error
System.out.println("hi)  // mismatched quotes → syntax error
```

The compiler tells you the line number, so these are usually quick to fix.

### logic errors
A **logic error** is when the program runs fine but gives the wrong answer. The computer isn't confused — your plan had a flaw.

```
// You want to convert Celsius to Fahrenheit.
double celsius = 20;
double fahrenheit = celsius - 32 * 5 / 9;   // wrong formula!
System.out.println(fahrenheit);             // runs, but gives a silly number
```

There's no error message for a logic error. Debugging tips:
- print intermediate values with `System.out.println()` to trace what's happening
- read your code out loud, line by line
- check your comparisons and order of operations

## try-catch statement
Some errors only happen while the program is running — like when a user types `abc` where you asked for a number. A **try-catch** lets you grab the error and keep going instead of crashing.

```
import java.util.Scanner;
Scanner sc = new Scanner(System.in);

try {
    System.out.print("Enter a number: ");
    int num = sc.nextInt();
    System.out.println("You picked " + num);
} catch (Exception e) {
    System.out.println("That wasn't a number!");
}
```

How it works:
- Code inside `try { ... }` runs normally.
- If anything inside it throws an error, the program jumps straight to `catch`.
- `catch (Exception e)` catches *any* exception — the error details land in `e`.

A more specific catch (like `InputMismatchException`) only catches that one type of error.

> Note: the playground currently supports a safe subset of Java. `try-catch` and many built-in exceptions may not run there yet — they work in real Java on your computer.

## practice ideas
- Ask for two numbers and divide them. What happens if the user enters 0? Can you catch it?
- Write a program that intentionally has both a syntax error and a logic error, then fix each.