---
title: Loops
description: Repeat code without copy-pasting! while, do-while, for, and break.
order: 7
---

# Loops

Loops let a block of code run over and over. There are three flavours, and which one you pick depends on where the condition lives.

## while loop (condition at the top)
`while` checks the condition **before** each run. If the condition is false from the start, the body never runs.

```
int counter = 0;
while (counter < 5) {
    System.out.println("tick " + counter);
    counter++;
}
```

Anatomy:
1. check the condition
2. if true, run the body; if false, skip entirely
3. repeat

If you forget to change the condition (`counter++`), you get an **infinite loop** and the program never stops. Always make sure something in the body moves you toward the end.

## do-while loop (condition at the bottom)
`do-while` runs the body **once**, then checks the condition. So the body always runs at least once — great for menus where you must show the menu before you read the choice.

```
int guess;
Scanner sc = new Scanner(System.in);
do {
    System.out.print("Guess the number: ");
    guess = sc.nextInt();
} while (guess != 42);
System.out.println("Yup, it's 42!");
```

```
do {
    // body always runs at least once
} while (condition);
```

## for loop
Use `for` when you know in advance how many times to repeat — it bundles a counter together in one line.

```
for (int counter = 0; counter < 5; counter++) {
    System.out.println("tick " + counter);
}
```

Three parts, separated by semicolons:
1. `int counter = 0` — the start (run once)
2. `counter < 5` — the condition (checked before each run)
3. `counter++` — the step (run after each body)

Count up, count down, count by twos:
```
for (int i = 10; i >= 0; i--) {   // 10, 9, 8 ...
for (int i = 0; i <= 10; i += 2) { // 0, 2, 4 ...
```

## break statements
`break` exits the loop immediately — even in the middle. A common pattern is a loop that keeps asking until the user wants to stop.

```
Scanner sc = new Scanner(System.in);
while (true) {
    System.out.print("Type a word (or 'stop'): ");
    String word = sc.next();
    if (word.equals("stop")) {
        break;              // leave the loop right now
    }
    System.out.println("You said: " + word);
}
```

- `break` jumps out of the loop entirely.
- You can also use `break` inside a switch to stop the switch.
- Its cousin `continue` skips to the *next* iteration (jumps back to the condition).

## choosing the right loop
| situation                                    | use           |
| --------------------------------------------- | ------------- |
| repeat until something changes, maybe never   | `while`       |
| must run the body at least once (menus)       | `do-while`    |
| counting a known number of times              | `for`         |
| stop early based on a condition               | `while` + `break` |

## extra practice
- Print every even number from 2 to 100 with a `for` loop.
- Keep asking for a password until the user enters the right one (use a while loop).
- Make a menu loop that only exits when the user picks "quit".