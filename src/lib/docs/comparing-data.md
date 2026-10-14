---
title: Comparing Data
description: Decide things in your code! Expressions, operators, if-else, nested ifs, and switch.
order: 4
---
# Comparing data
## What is an expression?
An **expression** is any piece of code that produces a value, like a single literal/value (ex. 3.5, 12, "Hello", 'a'), a variable (`int i = 4;`), a method (ex. `Math.abs(-12) //returns 12`), or a combination of variables & operators.

We already talked about numerical expressions, which use math operators and return numbers, for example:
```
double price = 3.50;
double total = price * 4;   // 14.0
```

However, when we're comparing data, we use **logical expressions.**

## logical expressions
logical expressions return `true` or `false`. We use operators in logical expressions to compare two values. 


**Comparison operators** are similar to math class: we use the >, <, <=, >=, and == signs. Unlike in math, we DO NOT use single `=` signs to compare two values. We need to use two `==` signs, as a single `=` sign is used to assign values instead.

**Logical operators** combine comparisons to check multiple things at once.

| operator | meaning | true when...              |
| -------- | ------- | ------------------------- |
| `&&`     | AND     | both sides are true       |
| `\|\|`   | OR      | at least one side is true |
| `!`      | NOT     | the condition is false    |

here are some examples of logical expressions:
```
int age = 17;
boolean canDrive = age >= 16; // true
boolean teen = age >= 13 && age <= 19;   // true (AND)
boolean weekend = false;
boolean party = weekend || age >= 18;    // false OR false -> false
```

## statements!!!!
Logical expressions are super important for these!

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

int mark = 95;

if (mark >= 90) {
    System.out.println("A");
} else if (mark >= 75) {
    System.out.println("B");
} else if (mark >= 60) {
    System.out.println("C");
} else {
    System.out.println("Definitely need to study.");
}

```

### nested if statements
You can put an if statement inside another if statement. So, you can check if a first statement is true before the second one is even evaluated. You can nest as many if statements as you want.

```

int age = 17;
boolean withParent = true;

if (age >= 16) {
    System.out.println("can get a license!");
} else {
    if (withParent) {
        System.out.println("can drive, but only with a parent.");
    } else {
        System.out.println("nah, come back later.");
    }
}

```


### switch statement
Sometimes, you need to write a program with a lot of options (like a menu), and writing loads of if statements gets annoying. In this case, you should *switch* to a **switch** statement! (Sorry that wasn't really funny. I hope you laughed anyways)

```
Scanner console = new Scanner(System.in);
System.out.println("pick an integer from 1-3: ");
int choice = console.nextInt();

switch (choice) {
	case 1 -> System.out.println("you picked rock.");	
	case 2 -> System.out.println("you picked paper.");	
	case 3 -> System.out.println("you picked scissors.");
	default -> System.out.println("you didn't input an integer from 1-3. try again");
} 
```

Basically, the switch statement is asking what `choice` is. In the case that it's 1, it'll print rock. If it's 2, it'll print paper. If it's 3, it'll print scissors. The `default` is what will happen if what happens isn't any of the cases. For example, if the user inputs 4, the console will print `you didn't input an integer from 1-3. try again`.

