const { readFileSync } = require('fs');
const { EOL } = require('os');

const patterns = readFileSync('./input.txt').toString().trim().split(`${EOL}${EOL}`).map(section => section.split(EOL));

const summarize = (m) => patterns.map(pattern => [...[...Array(pattern.length - 1).keys()].filter(row => m === [...Array(row + 1).keys()].map(i => row + i + 1 >= pattern.length ? 0 : Array.from(pattern[row - i]).filter((s, j) => pattern[row + i + 1][j] !== s).length).reduce((a, b) => a + b)).map(row => 100 * (row + 1)), ...[...Array(pattern[0].length - 1).keys()].filter(col => m === [...Array(col + 1).keys()].map(i => col + i + 1 >= pattern[0].length ? 0 : pattern.filter((str, j) => pattern[j][col + i + 1] !== str[col - i]).length).reduce((a, b) => a + b)).map(col => col + 1)].reduce((a, b) => a + b)).reduce((a, b) => a+b);
const part1 = summarize(0);
const part2 = summarize(1);

console.log(part1);
console.log(part2);