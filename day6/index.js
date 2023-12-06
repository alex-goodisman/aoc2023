const { readFileSync } = require('fs');
const { EOL } = require('os');

const lines = readFileSync('./input.txt').toString().trim().split(EOL);

const [ts, ds] = lines.map(line => [...line.matchAll(/\d+/g)].map(x => parseInt(x)));
const part1 = (ts, ds) => ts.map((t, i) => (Math.ceil(((-t) - Math.sqrt(t * t - 4 * ds[i])) / (-2)) - Math.floor(((-t) + Math.sqrt(t * t - 4 * ds[i])) / (-2)) - 1)).reduce((a, b) => a * b, 1);
const part2 = (ts, ds) => part1(...[ts, ds].map(s => [parseInt(s.reduce((a, b) => `${a}${b}`))]));

console.log(part1(ts, ds));
console.log(part2(ts, ds));