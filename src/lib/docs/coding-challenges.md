---
title: Coding Challenges
description: You've read the whole code review. Now prove it! Optional challenges to stretch your skills.
order: 9
---

# Coding Challenges

You survived the entire code review. Time to use everything: variables, arithmetic, casting, comparisons, if/else, switch, Strings, loops, and Scanner.

Try each challenge using only what these docs taught you. Start simple, then make it fancier.

## challenge 1: temperature converter
Ask the user for a temperature and a unit (C or F), then convert it.
- Celsius → Fahrenheit: `(c * 9 / 5) + 32`
- Fahrenheit → Celsius: `(f - 32) * 5 / 9`

**Sample**
```
Temperature:
25
Unit (C or F):
C
25C = 77.0F
```
**Hints:** `sc.nextDouble()`, `sc.next()`, a `switch` on the unit letter.

## challenge 2: the even number counter
Loop over a list of numbers and count how many are even.
**Input:** a bunch of numbers (type them in the input box)
**Output:** how many were even, and the sum of the even ones
**Hints:** `while (sc.hasNextInt())`, and `x % 2 == 0` means even.

```
2 3 4 5 6
→ 3 even numbers, sum = 12
```

## challenge 3: the reversed name
Print the user's name backwards.
**Sample**
```
Enter your name:
Kat
tak
```
**Hints:** `String.length()`, `charAt(i)`, a `for` loop counting *down* from the last char.

## challenge 4: guess my number
Program picks a secret number (just hard-code it, like `int secret = 42;`). The user guesses until they get it right.
- Too low → "Too low!"
- Too high → "Too high!"
- Correct → "You got it!" then stop
**Hints:** `do-while` is perfect here (read the guess, then check the condition).

## challenge 5: rock paper scissors
Player picks `1`, `2`, or `3`. The computer's move is... whatever you want to invent.
- A `switch` prints the player's move.
- `if` statements decide who wins.
**Extension:** make it a `do-while` loop that replays until someone reaches 3 wins.

## challenge 6: only one line
Take everything you did in challenge 2 and squeeze the whole loop onto **one line** using the tricks from the docs. (Totally optional, very cursed, very fun.)

## want more?
- Put the challenges in the playground and actually run them.
- Combine them: a menu (`switch` + `do-while`) that lets you pick which challenge to run.
- Invent your own challenge and write down your solution — teaching it means you've mastered it.