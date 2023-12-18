const { readFileSync } = require('fs');
const { EOL } = require('os');

const data = readFileSync('./input.txt').toString().trim().split(EOL).map(line => line.split(' '));

const part1 = data => Math.abs(data.map(([dir, n]) => [{R: [1, 0], D: [0, -1], L: [-1, 0], U: [0, 1]}[dir], parseInt(n)]).map(([dir, n], i, dt) => [dir, n, dt[(i + 1) % dt.length][0] ]).map(([[dx, dy], n, [fdx, fdy]]) => [dx, dy, n, dx * fdy - dy * fdx]).reduce(([dt, wd], [dx, dy, n, w]) => [[...dt, [dx, dy, n, w]], wd + w], [[], 0]).flatMap((x, i, a) => i === 0 ? x.map(([dx, dy, n, w], i, dt) => [dx, dy, n + Math.sign((w + dt[(dt.length + i - 1) % dt.length][3]) * Math.sign(a[1]))]) : []).reduce(([[px, py], ...pts], [dx, dy, n, ext]) => [[px + dx * n, py + dy * n], [px, py], ...pts], [[0, 0]]).reduce((s, [x, y], i, dt) => s + (y + dt[(i + 1) % dt.length][1]) * (x - dt[(i + 1) % dt.length][0]) / 2, 0))
const part2 = data => part1(data.map(([_, __, c]) => ['RDLU'[c[7]], parseInt(c.substring(2,7), 16)]))

console.log(part1(data));
console.log(part2(data));
