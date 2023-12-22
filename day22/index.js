const { readFileSync } = require('fs');
const { EOL } = require('os');

// generalized recursion helper
function until(seed, step, predicate) {
    while(!predicate(seed)) {
        seed = step(seed);
    }
    return seed;
}

const lines = readFileSync('./input.txt').toString().trim().split(EOL);

const willFallIf = lines.map(line => line.split('~').flatMap(term => term.split(',').map(v => parseInt(v)))).sort(({2: z11, 5: z21}, {2: z12, 5: z22}) => Math.min(z11, z21) - Math.min(z12, z22)).reduce(([willFallIf, heightMap], [x1, y1, z1, x2, y2, z2], i) => [[...Array(Math.abs(x2 - x1) + 1).keys()].map(d => Math.min(x1, x2) + d).reduce(([maxHeight, seenSet], x) => [...Array(Math.abs(y2 - y1) + 1).keys()].map(d => Math.min(y1, y2) + d).reduce(([maxHeight, seenSet], y) => ((heightMap[x] && heightMap[x][y]) || [{idx: -1, height: 0}]).filter((_, i, a) => i === a.length - 1).flatMap(({idx, height}) => [Math.max(height, maxHeight), height < maxHeight ? seenSet : (height > maxHeight ? new Set() : seenSet).add(idx)]), [maxHeight, seenSet]), [0, new Set()])].map(([maxHeight, seenSet]) => [Object.assign(willFallIf, {[i]: Array.from(seenSet).filter(j => j !== -1)}), [...Array(Math.abs(x2 - x1) + 1).keys()].map(d => Math.min(x1, x2) + d).reduce((heightMap, x) => [...Array(Math.abs(y2 - y1 + 1)).keys()].map(d => Math.min(y1, y2) + d).reduce((heightMap, y) => Object.assign(heightMap, {[x]: Object.assign(heightMap[x] || {}, {[y]: [...(heightMap[x] || {})[y] || [], {idx: i, height: maxHeight + z2 - z1 + 1}]})}), heightMap), heightMap)])[0], [{}, {}])[0];
const part1 = Object.keys(willFallIf).length -Object.values(willFallIf).reduce((set, vals) => vals.length === 1 ? set.add(vals[0]) : set, new Set()).size;
const part2 = Object.keys(willFallIf).map((_, i) => until([[i], new Set()], (([[i, ...q], falling]) => [q.concat(Object.keys(willFallIf).map(k => parseInt(k)).filter(j => willFallIf[j].includes(i) && willFallIf[j].every(k => k === i || falling.has(k)))), falling.add(i)]), ([q]) => q.length === 0)[1].size - 1).reduce((a,b) => a+b);

console.log(part1);
console.log(part2);