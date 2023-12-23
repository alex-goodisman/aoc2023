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

const paths = until([[], [[`0.${lines[0].indexOf('.')}`, [], 0, true]], until([{}, [[0, lines[0].indexOf('.')]]], ([distances, toProcess]) => [toProcess.pop()].map(([sr, sc]) => until([[[sr, sc, 0, 0, 0, true]], distances, toProcess], ([stack, distances, toProcess]) => [stack.pop()].map(([r, c, dr, dc, n, okay]) => [[[0, 1], [0, -1], [1, 0], [-1, 0]].map(([ndr, ndc]) => [r + ndr, c + ndc, ndr, ndc]).filter(([nr, nc, ndr, ndc]) => ((ndr !== -dr || ndc !== -dc) && nr >= 0 && nc >= 0 && nr < lines.length && nc < lines[0].length && lines[nr][nc] !== '#')).map(([nr, nc, ndr, ndc]) => [nr, nc, ndr, ndc, (lines[nr][nc] === '.' || (`${ndr}.${ndc}` === {'>': '0.1', '<': '0.-1', '^': '-1.0', 'v': '1.0'}[lines[nr][nc]]))])].map(futures => ((r === sr && c === sc) || (r !== lines.length - 1 && futures.length <= 1)) ? [[stack, stack.push(...futures.map(([nr, nc, ndr, ndc, futureOkay]) => ([nr, nc, ndr, ndc, n + 1, okay && futureOkay])))][0], distances, toProcess] : [stack, Object.assign(distances, {[`${sr}.${sc}`]: Object.assign(distances[`${sr}.${sc}`] || {}, {[`${r}.${c}`]: [(Math.max((distances[`${sr}.${sc}`] || {})[`${r}.${c}`] || [0])[0], n), okay]})}), ((`${r}.${c}` in distances) || (r === lines.length - 1)) ? toProcess : [toProcess, toProcess.push([r, c])][0]])[0])[0], ([stack]) => stack.length === 0).slice(1))[0], ([_, toProcess]) => toProcess.length === 0)[0]], ([paths, stack, distances]) => [stack.pop()].map(([key, seen, n, okay]) => [[paths, (key.substring(0, key.indexOf('.')) === `${lines.length - 1}`) ? paths.push([n, okay]) : null][0], [stack, stack.push(...Object.keys(distances[key] || {}).filter(k => !seen.includes(k)).map(cont => [cont, [key, ...seen], n + distances[key][cont][0], okay && distances[key][cont][1]]))][0], distances])[0], ([_, stack]) => stack.length === 0)[0];
const part1 = paths.filter(([_, okay]) => okay).reduce((a, [b]) => a > b ? a : b, 0);
const part2 = paths.reduce((a, [b]) => a > b ? a : b, 0);

console.log(part1);
console.log(part2);
