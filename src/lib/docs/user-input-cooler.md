---
title: Getting User Input (The Cool Way)
description: Level up your Scanner skills! Read lots of numbers, loop over input, and survive the nextLine gotcha.
order: 8
---

# Getting User Input (The Cool Way)

You already met the Scanner in *Getting User Input*. Now let's make it actually useful.

## reading lots of numbers at once
Scanner doesn't care how the input is spaced out. `3` on its own line, `3 4 5` on one line — it reads them all the same way.

```
import java.util.Scanner;
Scanner sc = new Scanner(System.in);

// Input box:   3 4 5
// (or)         3
//              4
//              5
int a = sc.nextInt();
int b = sc.nextInt();
int c = sc.nextInt();
System.out.println(a + b + c); // 12
```

## reading input until the user stops
Loop forever until there's no more input left. `hasNextInt()`, `hasNextDouble()`, and `hasNext()` return `true` while more input exists.

```
Scanner sc = new Scanner(System.in);
int total = 0;
while (sc.hasNextInt()) {
    total += sc.nextInt();
}
System.out.println("Total: " + total);
```
Feed it `1 2 3 4` and it prints `Total: 10`. No guessing how many numbers — the loop handles it.

Same trick for `double`:
```
Scanner sc = new Scanner(System.in);
double biggest = 0;
while (sc.hasNextDouble()) {
    double x = sc.nextDouble();
    if (x > biggest) biggest = x;
}
System.out.println("Biggest: " + biggest);
```

## the nextLine() gotcha (trust me, you'll trip on this)
`nextInt()` reads the number but leaves the rest of the line — including the Enter key — sitting there.

```
int age = sc.nextInt();
String name = sc.nextLine();   // name = "" (empty!), the Enter was still there
```

Why: after `nextInt()` got `25`, the newline was still waiting. `nextLine()` grabs whatever is left on that line, which is nothing.

The classic fix, if you genuinely need a line after a number: call `nextLine()` once to swallow the leftover newline.

```
int age = sc.nextInt();
sc.nextLine();                 // eat the leftover Enter
String name = sc.nextLine();   // now this works
```

Or just read everything with `next()` / `nextLine()` and convert it yourself.

## a small menu with Scanner + switch
This is the "cool" combo — loop + switch + Scanner = an actual app:

```
import java.util.Scanner;
Scanner sc = new Scanner(System.in);

int choice;
do {
    System.out.println("1. Say hi");
    System.out.println("2. Count to 10");
    System.out.println("3. Quit");
    choice = sc.nextInt();
    switch (choice) {
        case 1:
            System.out.println("Hi!!");
            break;
        case 2:
            for (int i = 1; i <= 10; i++) System.out.print(i + " ");
            System.out.println();
            break;
        case 3:
            System.out.println("Bye!");
            break;
        default:
            System.out.println("Not a choice.");
    }
} while (choice != 3);
```

## practice ideas
- Read numbers until the user stops, print the average.
- Build a grader: read marks until then end, print the highest, lowest, and average.