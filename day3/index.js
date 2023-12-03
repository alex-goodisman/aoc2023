const { readFileSync } = require('fs');
const { EOL } = require('os');

const lines = readFileSync('./input.txt').toString().trim().split(EOL);

const numbers = lines.flatMap((line, i) => [...line.matchAll(/\d+/g)].map(({0: v, index: j}) => ({v, i, j})));
const symbols = lines.flatMap((line, y) => [...line.matchAll(/[^\.\d]/g)].map(({0: s, index: x}) => ({s, x, y})));

const part1 = numbers.filter(({v, i, j}) => symbols.some(({x, y}) => y >= i - 1 && y <= i + 1 && x >= j  -1 && x <= j + v.length)).reduce((a, {v}) => a + parseInt(v), 0);
const part2 = symbols.filter(({s}) => s === '*').map(({x, y}) => numbers.filter(({v, i, j}) => i >= y - 1 && i <= y + 1 && j <= x + 1 && j + v.length - 1 >= x - 1)).filter(p => p.length === 2).map(p => p.reduce((a, {v}) => a * parseInt(v), 1)).reduce((a, b) =>a + b, 1);

console.log(part1);
console.log(part2);
