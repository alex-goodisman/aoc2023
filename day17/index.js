const { readFileSync } = require('fs');
const { EOL } = require('os');

// generalized recursion helper
function until(seed, step, predicate) {
    while(!predicate(seed)) {
        seed = step(seed);
    }
    return seed;
}

const lines = readFileSync('./input.txt').toString().trim().split(EOL).map(str => Array.from(str).map(s => parseInt(s)));

let run = (min, max) => until([{start: 0}].flatMap(dist => [dist, [null, 'start'], lines.reduce((edges, line, row) => line.reduce((edges, _, col) => [[0, 1], [1, 0]].reduce((edges, [dr, dc]) => [...Array(max - min + 1).keys()].flatMap(x => [x + min, -x - min]).reduce((edges, n) => Object.assign(edges, {[`${row - (n * dr)}.${col - (n * dc)}.${dc}`]: Object.assign(edges[`${row - (n * dr)}.${col - (n * dc)}.${dc}`] || {}, {[`${row}.${col}.${dr}`]: [...Array(Math.abs(n)).keys()].map(i => i * Math.sign(n)).map(i => lines[row - (i * dr)]?.[col - (i * dc)]).reduce((a,b) => a + b, 0)})}), edges), edges), edges), {start: {'0.0.0': 0, '0.0.1': 0}, [`${lines.length - 1}.${lines[0].length - 1}.0`]: {end: 0}, [`${lines.length - 1}.${lines[0].length - 1}.1`]: {end: 0} })]), ([dist, q, g]) => [[Object.assign(q, {[1]: q[q.length - 1], [q.length - 1]: q[1]})].flatMap(q => [q.pop(), until([q, 1, a => dist[a] || Infinity], ([heap, idx, fn]) => [fn(heap[2 * idx]) < fn(heap[(2 * idx) + 1]) ? 2 * idx : (2 * idx + 1)].flatMap(cidx => [Object.assign(heap, {[idx]: heap[cidx], [cidx]: heap[idx]}), cidx, fn]), ([heap, idx, fn]) => 2 * idx >= heap.length || fn(heap[idx]) <= Math.min(fn(heap[2 * idx]), fn(heap[(2 * idx) + 1])))[0]])].map(([u, nq]) => Object.keys(g[u] || {}).reduce(([dist, q], v) => (dist[u] + g[u][v] < ( dist[v] || Infinity) ) ? [until([q, [q.indexOf(v)].map(idx => idx === -1 ? Object.assign(q, {[q.length]: v}).length - 1 : idx)[0], a => dist[a] || Infinity], ([heap, idx, fn]) => ([Math.floor(idx / 2)].flatMap(pidx => [Object.assign(heap, {[idx]: heap[Math.floor(idx / 2)], [Math.floor(idx / 2)]: heap[idx]}), pidx, fn])  ), ([heap, idx, fn]) => (idx <= 1 || fn(heap[Math.floor(idx / 2)]) <= fn(heap[idx])))[0]].flatMap(q => [Object.assign(dist, {[v]: dist[u] + g[u][v]}), q, g]) : [dist, q, g], [dist, nq, g]))[0], ([_, q]) => q.length === 1)[0].end;
const part1 = run(1,3);
const part2 = run(4,10);

console.log(part1);
console.log(part2);
