---
title: Loops
description: repeat code without copy-pasting! do-while, while, for, & break statements
order: 7
---

# Loops

Loops let a block of code run over and over again. There are do-while loops, while loops, and for loops.

## while loops
`while` checks the condition **before** each run. If the condition is false from the start, the body never runs.
```
int counter = 0;

while (counter < 5) {
    System.out.println("tick " + counter);
    counter++;
}
```

So, while loops:
1. check the condition
2. if true, run the body. if false, skip
3. repeat

## do-while loops
`do-while` loops run the body once, then checks the condition. So, the body always runs at least once.
```
int guess;

Scanner sc = new Scanner(System.in);
do {
    System.out.print("Guess the number: ");
    guess = sc.nextInt();
} while (guess != 42);

System.out.println("yeah, it's 42");
```

## for loops
Use `for` when you know how many times you need to iterate. It initializes the counter and the loop all in one line!
```
for (int counter = 0; counter < 5; counter++) {
	System.out.print(counter + " ");
} // will print 1 2 3 4
```
There are three parts to the for loop:
1. `int counter = 0;` initialize the counter: runs once
2. `counter < 5;` condition: check this after each run and repeat the for loop if it's true.
3. `counter++` increases the count every run.

## break statements
exits the loop immediately. for example:
```
for (int i = 0; i < 5; i++) {
	System.out.print( i + " ");
	if (i == 2) {
	break
	}
} // will print 1 2
```