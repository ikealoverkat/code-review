---
title: Comparing Data
description: Decide things in your code! Expressions, operators, if-else, nested ifs, and switch.
order: 4
---

# Comparing Data

## what is an expression?
An **expression** is a piece of code that produces a value. Literals and variables are expressions, and you can combine them with operators:

```
3 + 4          // evaluates to 7
score * 2      // evaluates to double the score
"hi " + name   // evaluates to a bigger String
```

### numerical expressions
These use math operators and give you a number:
```
double price = 3.50;
double total = price * 4;   // 14.0
int x = (10 + 2) / 2;       // 6
```

### logical expressions
These give you `true` or `false`:
```
age >= 16
score > 50
hasKey && hasID
```
Logical expressions are the glue of if statements.

## operators

### comparison operators
These compare two things and give back a `boolean` (`true` or `false`).

| operator | meaning                | example           |
| -------- | ---------------------- | ----------------- |
| `==`     | equals                 | `a == b`          |
| `!=`     | not equals             | `a != b`          |
| `<`      | less than              | `a < b`           |
| `<=`     | less than or equal     | `a <= b`          |
| `>`      | greater than           | `a > b`           |
| `>=`     | greater than or equal  | `a >= b`          |

### logical operators
Combine comparisons to check multiple things at once.

| operator | meaning  | true when...                       |
| -------- | -------- | ---------------------------------- |
| `&&`     | AND      | both sides are true                |
| `\|\|`   | OR       | at least one side is true          |
| `!`      | NOT      | the thing is false                 |

```
int age = 17;
boolean canDrive = age >= 16;            // true
boolean exact = age == 17;               // true
boolean teen = age >= 13 && age <= 19;   // true (AND)
boolean weekend = false;
boolean party = weekend || age >= 18;    // false || true → true
```

## statements!!

### if-else statement
An **if statement** runs some code only when a condition is true. Add `else` for the other case.

```
int temperature = 30;
if (temperature >= 30) {
    System.out.println("Super hot!");
} else {
    System.out.println("Not that hot.");
}
```

You can chain more than two cases with `else if`:
```
int mark = 85;
if (mark >= 80) {
    System.out.println("A");
} else if (mark >= 70) {
    System.out.println("B");
} else if (mark >= 60) {
    System.out.println("C");
} else {
    System.out.println("Definitely need to study.");
}
```

### nested if statements
You can put an if inside another if. This is how you check a second condition only after the first one passes.

```
int age = 17;
boolean withParent = true;
if (age >= 16) {
    System.out.println("Can get a licence!");
} else {
    if (withParent) {
        System.out.println("Can drive, but only with a parent.");
    } else {
        System.out.println("Not yet, come back later.");
    }
}
```
Sometimes nesting gets hard to read — you can often flatten it with `&&` instead:
```
if (age < 16 && !withParent) {
    System.out.println("Not yet, come back later.");
}
```

### switch statement
When you're comparing one value against many possibilities, a **switch** is cleaner than a pile of if-else.

```
Scanner sc = new Scanner(System.in);
System.out.print("Pick a number 1-3: ");
int choice = sc.nextInt();

switch (choice) {
    case 1:
        System.out.println("You chose rock.");
        break;
    case 2:
        System.out.println("You chose paper.");
        break;
    case 3:
        System.out.println("You chose scissors.");
        break;
    default:
        System.out.println("That's not 1, 2, or 3!");
}
```

Notes on switch:
- The `case` values must be constants (literal numbers, chars, or Strings in modern Java).
- `break;` stops the switch. Forget it and the code **falls through** to the next case!
- `default` runs when nothing else matches — think of it like an `else`.
- You can group cases that do the same thing:
```
case 1:
case 2:
    System.out.println("That's a small number.");
    break;
```

## practice ideas
- Ask for a mark and print a grade with if-else.
- Make a mini menu with a switch.
- Check if a year is a leap year with `%` and logical operators.