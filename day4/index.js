const { readFileSync } = require('fs');
const { EOL } = require('os');

const lines = readFileSync('./input.txt').toString().trim().split(EOL);

const matches = data => data.map(line => line.substring(line.indexOf(':')).split('|').map(half => [...half.matchAll(/\d+/g)].map(({0: x}) => x))).map(([w, m]) => m.filter(n => w.includes(n)).length);
const part1 = data => matches(data).map(n => Math.floor(2 ** (n - 1))).reduce((a, b) => a + b);
const part2 = data => matches(data).reduce((ct, m, i) => Object.assign(ct, Object.fromEntries([...Array(m).keys()].map(j => [i + j + 1, ct[i + j + 1] + ct[i]]))), Array(lines.length).fill(1)).reduce((a, b) => a + b);

console.log(part1(lines));
console.log(part2(lines));
