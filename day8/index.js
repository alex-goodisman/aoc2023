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
const part2 = Object.keys(map).filter(k => k.endsWith('A')).map(v => until([v, 0], ([v, n]) => [map[v][lines[0][n % lines[0].length] === 'L' ? 0 : 1], n + 1], ([v]) => v.endsWith('Z'))[1]).reduce((a,b) => a * b / until([a, b], ([a, b]) => [b, a % b], ([_, b]) => b === 0)[0]);


console.log(part1);
console.log(part2);