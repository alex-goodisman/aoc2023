const { readFileSync } = require('fs');
const { EOL } = require('os');

const lines = readFileSync('./input.txt').toString().trim().split(EOL);

const vals = {T: 10, J: 11, Q: 12, K: 13, A: 14};
const data = lines.map(line => line.split(' ')).map(([s,n]) => [Array.from(s).map(x => x in vals ? vals[x] : parseInt(x)), parseInt(n)]);

const part1 = data.map(([str, num]) => [[...Object.assign(Array(str.length).fill(0), Object.values(str.reduce((m, s) => ({...m, [s]: (m[s] || 0) + 1}), {})).sort((a, b) => b - a)), ...str], num]).sort(([n1], [n2]) => n2.map((n, i) => n - n1[i]).find(x => x !== 0)).reverse().reduce((a, [_, b] ,i) => a + (b * (i + 1)), 0);
const part2 = data.map(([str, num]) => [str.map(x => x === 11 ? 1 : x), num]).map(([str, num]) => [[...Object.assign(Array(str.length).fill(0), [str.length], [str.reduce((m, s) => ({...m, [s]: (m[s] || 0) + 1}), {})].map(hist => Object.keys(hist).filter(k => k !== '1').map(k => hist[k]).sort((a, b) => b - a).map((v, i) => i === 0 ? v + (hist[1] || 0) : v))[0]), ...str], num]).sort(([n1], [n2]) => n2.map((n, i) => n - n1[i]).find(x => x !== 0)).reverse().reduce((a, [_, b], i) => a + (b * (i + 1)), 0);

console.log(part1);
console.log(part2);