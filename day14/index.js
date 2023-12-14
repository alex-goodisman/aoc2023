const { readFileSync } = require('fs');
const { EOL } = require('os');

// generalized recursion helper
function until(seed, step, predicate) {
    while(!predicate(seed)) {
        seed = step(seed);
    }
    return seed;
}

const lines = readFileSync('./input.txt').toString().trim().split(EOL).map(str => str.split('')).reduce((inverted, row) => row.map((s, r) => [s, ...(inverted[r] || [])]));

const part1 = lines.map(line => line.join('').split('#').map(segment => segment.split('').sort().join('')).join('#').split('')).map(line => line.map((s, i) => s === 'O' ? i + 1 : 0).reduce((a,b) => a + b)).reduce((a,b) => a + b);
const part2 = until([lines, {}, -1], ([newLines, boards, i]) => [[...Array(4).keys()].reduce(n => n.map(line => line.join('').split('#').map(segment => segment.split('').sort().join('')).join('#').split('')).reduce((inverted, row) => row.map((s, r) => [s, ...(inverted[r] || [])])), newLines), Object.assign(boards, {[newLines.map(line => line.join('')).join('')]: i + 1}), i + 1], ([newLines, boards, i]) => (1000000000 - (i + 1)) % (i + 1 - (boards[newLines.map(line => line.join('')).join('')] || Infinity)) === 0)[0].map(line => line.map((s, i) => s === 'O' ? i + 1 : 0).reduce((a,b) => a + b)).reduce((a,b) => a + b);

console.log(part1);
console.log(part2);
