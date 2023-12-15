const { readFileSync } = require('fs');
const { EOL } = require('os');

const data = readFileSync('./input.txt').toString().trim();

const hash = s => s.split('').reduce((v, c) => ((v + c.charCodeAt(0)) * 17) % 256, 0)
const part1 = data.split(',').map(hash).reduce((a ,b) => a + b);
const part2 = data.split(',').map(insn => /(\w+)(-|=)(\d*)/.exec(insn).slice(1)).map(([label, op, target]) => [label, op, target, hash(label)]).reduce((map, [label, op, target, idx]) => Object.assign(map, {[idx]: op === '-' ? map[idx].filter(([l]) => l !== label) : map[idx].some(([l]) => l === label) ? map[idx].map(([l, v]) => [l, l === label ? target : v]) : [...map[idx], [label, target]]}), [...Array(256).keys()].map(_ => [])).map((box, b) => box.map(([lbl, val], s) => (s + 1) * val).reduce((a,b) => a + b, 0) * (b + 1)).reduce((a,b) => a + b);

console.log(part1);
console.log(part2)
