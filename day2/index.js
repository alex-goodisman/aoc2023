const { readFileSync } = require('fs');
const { EOL } = require('os');

const data = readFileSync('./input.txt').toString().trim();

const keys = { red: 12, green: 13, blue: 14 };
const parsed = text => text.split(EOL).map(line => line.split(': ')).map(([before, after]) => ({id: parseInt(before.replaceAll(/[^\d]/g, '')), ... after.split('; ').map(game => Object.fromEntries([...Object.keys(keys).map(k => [k, 0]), ...game.split(', ').map(x => x.split(' ')).map(([v,k]) => [k,parseInt(v)])])).reduce((a,b) => Object.fromEntries(Object.keys(keys).map(k => [k, Math.max(a[k], b[k])])))}));

const part1 = text => parsed(text).filter(o => Object.entries(keys).every(([k,v]) => o[k] <= v)).map(({id}) => id).reduce((a, b) => a + b);
const part2 = text => parsed(text).map(({id, ...o}) => Object.values(o).reduce((a, b) => a * b)).reduce((a, b)=>a + b)

console.log(part1(data));
console.log(part2(data));