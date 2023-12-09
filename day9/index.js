const { readFileSync } = require('fs');
const { EOL } = require('os');

// generalized recursion helper
function until(seed, step, predicate) {
    while(!predicate(seed)) {
        seed = step(seed);
    }
    return seed;
}

const lines = readFileSync('./input.txt').toString().trim().split(EOL);
const data = lines.map(line => [...line.matchAll(/-?\d+/g)].map(d => parseInt(d)));

const part1 = numbers => numbers.map(row => until([row], ([row, ...rest]) => [row.flatMap((x, i) => i === 0 ? [] : [x - row[i-1]]), row, ...rest], ([row]) => row.every(x => x === 0)).reduce((v, row) => v + row[row.length - 1], 0)).reduce((a, b) => a + b, 0);
const part2 = numbers => part1(numbers.map(ns => ns.reverse()));

console.log(part1(data));
console.log(part2(data));