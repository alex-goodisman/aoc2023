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

const map = lines.slice(2).map(line => [...line.matchAll(/\w+/g)]).reduce((m,[k,l,r]) => ({...m, [k]: [l[0], r[0]]}), {});
const part1 = until(['AAA', 0], ([v, n]) => [map[v][lines[0][n % lines[0].length] === 'L' ? 0 : 1], n + 1], ([v]) => v === 'ZZZ')[1];
const part2 = Number(Object.keys(map).filter(k => k.endsWith('A')).map(node => [until([node, 0, {}], ([ptr, i, seen]) => [map[ptr][lines[0][i % lines[0].length] === 'L' ? 0 : 1], i + 1, Object.assign(seen, {[`${i % lines[0].length}${ptr}`]: BigInt(i)})], ([ptr, i, seen]) => `${i % lines[0].length}${ptr}` in seen )].map(([ptr, i , seen]) => Object.keys(seen).filter(k => k.endsWith('Z')).map(k => ({offset: seen[k], period: BigInt(i) - seen[`${i % lines[0].length}${ptr}`]})))[0]).reduce((possibilities, list) => possibilities.flatMap(possibility => list.map(option => [...possibility, option])), [[]]).map(possibility => possibility.reduce(({period: period1, offset: offset1}, {period: period2, offset: offset2}) => (period1 === Infinity || period2 === Infinity) ? { period: Infinity, offset: Infinity } : [until([[period1, period2], [1n, 0n], [0n, 1n]], pairs => pairs.map(([old_n, n]) => [n, old_n - pairs[0][0] / pairs[0][1] * n]), ([[_, r]]) => r === 0n).map(([n]) => n)].map(([g, s]) => ((offset1 - offset2) / g * g !== (offset1 - offset2)) ? { period: Infinity, offset: Infinity } : {period: ((period1 * period2) / g), offset: (offset1 - (offset1 - offset2) / g * s * period1) % ((period1 * period2) / g)}).map(({period: combinedPeriod, offset: combinedOffset}) => ({period: combinedPeriod, offset: combinedOffset === Infinity ? Infinity : (combinedOffset  + ((offset1 <= combinedOffset && offset2 <= combinedOffset) ? 0n : combinedPeriod * ((offset1 > offset2 ? offset1 : offset2) / combinedPeriod + ((offset1 > offset2 ? offset1 : offset2) / combinedPeriod * combinedPeriod === (offset1 > offset2 ? offset1 : offset2) ? 0n : 1n))))}))[0], {period: 1n, offset: 0n}).offset).reduce((a, b) => a < b ? a : b, Infinity));

console.log(part1);
console.log(part2)

