const { readFileSync } = require('fs');
const { EOL } = require('os');

const sections = readFileSync('./input.txt').toString().trim().split(`${EOL}${EOL}`);

const seeds = [...sections[0].matchAll(/\d+/g)].map(x => parseInt(x));
const maps = sections.slice(1).map(section => section.split(EOL).map(line => [...line.matchAll(/\d+/g)].map(x => parseInt(x))).filter(m => m.length !== 0));

const part1 = seeds.map(seed => maps.reduce((s, m) => [m.find(([_, src, len]) => s >= src && s < src + len) || [0,0,0]].map(([dest, src, _]) => s + dest - src)[0], seed)).reduce((a, b) => a < b ? a : b, Infinity);
const part2 = seeds.flatMap((s, i, a) => i % 2 === 0 ? [] : [[a[i - 1], a[i - 1] + s - 1]]).flatMap(pair => maps.reduce((ps, m) => m.reduce(([unmapped, mapped], [dest, src, len]) => [unmapped.flatMap(([start, end]) => [...(start < src ? [[start, Math.min(end, src - 1)]] : []), ...(end >= src + len ? [[Math.max(start, src + len), end]] : [])]), [...unmapped.flatMap(([start, end]) => (end < src  || start >= src + len) ? [] : [[Math.max(start, src), Math.min(end, src + len -1)].map(n => n + dest - src)]), ...mapped]], [ps, []]).flat(), [pair])).map(([s]) => s).reduce((a,b) => a < b ? a : b, Infinity);

console.log(part1);
console.log(part2);