const { readFileSync } = require('fs');
const { EOL } = require('os');

const lines = readFileSync('./input.txt').toString().trim().split(EOL).map(line => line.split(''));
const pos = lines.flatMap((line, r) => line.flatMap((n, c) => n === '#' ? [[r, c]] : []))

const dist = m => pos.flatMap(([r1, c1], i) => pos.map(([r2, c2], j) => j > i ? 0 : [...Array(Math.abs(c1 - c2)).keys()].map(d => Math.min(c1, c2) + d + 1).reduce((dist, i) => dist + (lines.every(line => line[i] === '.') ? m : 1), [...Array(Math.abs(r1 - r2)).keys()].map(d => Math.min(r1, r2) + d + 1).reduce((dist, i) => dist + (lines[i].every(n => n === '.') ? m : 1), 0)))).reduce((a,b) => a+b)
const part1 = dist(2);
const part2 = dist(1000000)

console.log(part1);
console.log(part2);
