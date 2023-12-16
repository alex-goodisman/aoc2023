const { readFileSync } = require('fs');
const { EOL } = require('os');

// generalized recursion helper
function until(seed, step, predicate) {
    while(!predicate(seed)) {
        seed = step(seed);
    }
    return seed;
}

const lines = readFileSync('./input.txt').toString().trim().split(EOL).map(str => Array.from(str));

const simulate = (px, py, dx, dy) => Object.keys(until([[[px, py, dx, dy]], {}], ([[[px, py, dx, dy], ...q], tiles]) => [[...q, ...((`${dy}.${dx}` in (tiles[`${py}.${px}`] || {})  || !(px in (lines[py] || []))) ? [] : lines[py][px] === '.' ? [[dx, dy]] : lines[py][px] === '\\' ? [[dy, dx]] : lines[py][px] === '/' ? [[-dy, -dx]] : lines[py][px] === '-' ? dy === 0 ? [[dx, dy]] : [[-1, 0], [1, 0]] : dx === 0 ? [[dx, dy]] : [[0, -1], [0, 1]]).map(([ndx, ndy]) => [px + ndx, py + ndy, ndx, ndy])], px in (lines[py] || []) ? Object.assign(tiles, {[`${py}.${px}`]: Object.assign(tiles[`${py}.${px}`] || {}, {[`${dy}.${dx}`]: true})} ) : tiles], ([q]) => q.length === 0)[1]).length
const part1 = simulate(0, 0, 1, 0);
const part2 = [...[...Array(lines.length).keys()].flatMap(i => [[0, i, 1, 0], [lines[0].length - 1, i, -1, 0]]), ...[...Array(lines[0].length).keys()].flatMap(j => [[j, 0, 0, 1], [j, lines.length - 1, 0, -1]])].map(cfg => simulate(...cfg)).reduce((a,b) => a > b ? a : b);

console.log(part1);
console.log(part2);


