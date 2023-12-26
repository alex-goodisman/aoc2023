# AoC2023
These are my solutions to the Advent of Code puzzle from 2023.

I couldn't think of a good challenge language to do them in this year, so I came up with a different challenge.

### Every puzzle is implemented in _one line_ (in JavaScript). 
This is defined as one single JavaScript expression, whose value will be the answer to the puzzle. I didn't use any semicolons except for the one at the end of the expression. I didn't use the `,` operator to to avoid semicolons, and I didn't use the `(x) => (/*code here*/)(y)` syntax. However, I did use `[y].map(x => /*code here */)[0]`, which is equivalent, for some of the later solutions. I prefer this because the intention is to have the single large expression be a chain of `.map()`, `.filter()`, and `.reduce()` calls, and this is more in that spirit.

## Exceptions: 
 - Imports don't count, but I don't use any imports except for `fs` (for reading the input) and `os` (for the cross-platform `EOL` string).
 - I use one line for reading and parsing the input. In some solutions, I inlined some processing into this line, instead of copying into both part2 and part2.
 - In some solutions, I wrote an additional line that defines structured input data that is then passed to both part1 and part2. This is instead of copying that into both.
 - In some solutions, part2 calls part1. This is instead of copying part1 into part2.
 - I defined a utility function `until()` that is an inline equivalent of a `while{}` loop (and is implemented as such). This avoids the problem that tail recursion is impossible in modern versions of NodeJS, but non-recursive implementations (i.e. `while{}`) can only be made as a statement (rather than an expression). This doesn't count towards the line total.
 - Any other data structures (namely the Priority Queue for some algorithms problems) have to be implemented as part of the one line. They can't be standalone lines or utility functions.

 ## Other restrictions:
 - Where possible, general solutions are preferred.
 - Where possible, solutions should run as fast possible, ideally in less than a minute per day (both parts).

