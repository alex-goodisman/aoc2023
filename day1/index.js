const { readFileSync} = require('fs');
const { EOL } = require('os');

const part1 = data => data.replaceAll(/[^\d\s]/g,'').split(EOL).map(x => parseInt(x[0] + x[x.length - 1])).reduce((a, b) => a + b);
const part2 = data => part1(['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'].reduce((s, n, i) => s.replaceAll(n, n + i + n), data))

const text = readFileSync('./input.txt').toString().trim();
console.log(part1(text));
console.log(part2(text));