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

const distances = Object.fromEntries([0, Math.floor(lines.length / 2), lines.length - 1].flatMap(r => [0, Math.floor(lines.length / 2), lines.length - 1].map(c => [`${r}.${c}`, until([[[r, c, 0]], {}], (([[[r, c, d], ...rest], dist]) => [`${r}.${c}` in dist ? rest : rest.concat([[r + 1, c], [r, c-1], [r-1,c], [r,c+1]].filter(([nr, nc]) => lines[nr] && lines[nr][nc] && lines[nr][nc] !== '#').map(([nr, nc]) => [nr, nc, d + 1])), (!(`${r}.${c}` in dist)) ? Object.assign(dist, {[`${r}.${c}`]: d}) : dist]), ([q]) => q.length === 0)[1]])));
const part1 = Object.values(distances[`${Math.floor(lines.length / 2)}.${Math.floor(lines.length / 2)}`]).filter(d => d <= 64 && d % 2 === 0).length;
const part2 = [[lines.map((row, i) => [...row].some(s => s === '#') ? -1 : i).filter(i => i !== -1), lines.reduce((cols, row) => cols.filter(i => row[i] !== '#'), [...Array(lines.length).keys()])]].map(([openRows, openCols]) => Object.keys(distances[`${Math.floor(lines.length / 2)}.${Math.floor(lines.length / 2)}`]).map(tile => Object.keys(distances).map(edge => (edge === `${Math.floor(lines.length / 2)}.${Math.floor(lines.length / 2)}`) ? (distances[edge][tile] % 2 === 1) ? 1 : 0 : [(edge.startsWith(`${Math.floor(lines.length / 2)}.`) || edge.endsWith(`.${Math.floor(lines.length / 2)}`)) ? [(edge.startsWith('0.') || edge.startsWith(`${lines.length - 1}.`)) ? openCols.map(c => [`${edge.substring(0, edge.indexOf('.'))}.${c}`, `${lines.length - 1 - parseInt(edge.substring(0, edge.indexOf('.')))}.${c}`]) : openRows.map(r => [`${r}.${edge.substring(edge.indexOf('.') + 1)}`, `${r}.${lines.length - 1 - parseInt(edge.substring(edge.indexOf('.') + 1))}`]), 1, () => 1]: [[[edge, edge.split('.').map(v => lines.length - 1 - v).join('.')]], 2, (minIter, maxIter) => ((minIter + maxIter + 2) / 2)]].map(([candidates, offset, multiplier]) => [candidates.map(([candidate, opposite]) => distances[candidate][tile] + distances[opposite][`${Math.floor(lines.length / 2)}.${Math.floor(lines.length / 2)}`] + offset).reduce((a, b) => a < b ? a : b, Infinity), multiplier]).map(([fixedDist, multiplier]) => [fixedDist, Math.floor((26501365 - fixedDist) / lines.length), multiplier]).map(([fixedDist, iterations, multiplier]) => [(fixedDist % 2 === 1) ? 0 : 1, ((iterations * lines.length + fixedDist) % 2 === 1) ? iterations : iterations - 1, multiplier]).map(([minIter, maxIter, multiplier]) => multiplier(minIter, maxIter) * ((maxIter - minIter) / 2 + 1))[0]).reduce((a, b) => a + b, 0)).reduce((a,b) => a + b))[0];

console.log(part1);
console.log(part2);