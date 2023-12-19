const { readFileSync } = require('fs');
const { EOL } = require('os');

const [workflowLines, partLines] = readFileSync('./input.txt').toString().trim().split(`${EOL}${EOL}`).map(section => section.split(EOL));
const workflows = Object.fromEntries(workflowLines.map(line => /(.*)\{(.*)\}/.exec(line)).map(({1: name, 2: parts}) => [name, parts.split(',').map(part => /(\w+)((<|>)(\d+):(\w+))?/.exec(part)).map(({1: idxOrTgt, 3: op, 4: val, 5: tgt}) => [idxOrTgt, op, val != null ? parseInt(val) : val, tgt])]));
const parts = partLines.map(line => Object.fromEntries(line.substring(1, line.length - 1).split(',').map(term => term.split('=')).map(([a, b]) => [a, parseInt(b)])));

const process = (obj, name) => name === 'A' ? true : name === 'R' ? false : process(obj, [workflows[name].find(([idxOrTgt, op, val]) => op == null || ((op === '>') && (obj[idxOrTgt] > val)) || ((op === '<') && obj[idxOrTgt] < val))].map(([idxOrTgt, op, _, tgt]) => op == null ? idxOrTgt : tgt)[0]);
const part1 = parts.filter(part => process(part, 'in')).map(a => Object.values(a).reduce((a, b) => a + b)).reduce((a, b) => a + b);

const memo = {A: [[]], R: []};
const traverse = (name) => memo[name] = (memo[name]) || (workflows[name].reduce(([data, accum], [idxOrTgt, op, val, tgt]) => op == null ? [data.concat(traverse(idxOrTgt).map(l => [...accum, ...l])), accum] : [data.concat(traverse(tgt).map(l => [ ...accum, [idxOrTgt, op, val], ...l])), accum.concat([[idxOrTgt, op === '>' ? '<' : '>', val + (op === '>' ? 1 : -1)]])], [[], []])[0]);
const part2 = traverse('in').map(path => path.reduce((rangeMap, [idx, op, val]) => Object.assign(rangeMap, {[idx]: [Math.max(rangeMap[idx][0], op === '>' ? val + 1 : 0), Math.min(rangeMap[idx][1], op === '<' ? val - 1 : Infinity)]}), Object.fromEntries([...'xmas'].map(idx => [idx, [1, 4000]])))).map(data => Object.values(data).map(([lo, hi]) => hi - lo + 1).reduce((a, b) => a * b, 1)).reduce((a, b) => a + b, 0);

console.log(part1);
console.log(part2);
