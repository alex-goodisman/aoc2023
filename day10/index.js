const { readFileSync } = require('fs');
const { EOL } = require('os');

// generalized recursion helper
function until(seed, step, predicate) {
    while(!predicate(seed)) {
        seed = step(seed);
    }
    return seed;
}

const tiles = readFileSync('./input.txt').toString().trim().split(EOL).map(line => Array.from(line));
const [r, c] = tiles.map(row => row.indexOf('S')).flatMap((c, r) => c === -1 ? [] : [r, c]);

const loopMap = Object.assign(until([null, c, r, ...('-J7'.includes(tiles[r][c+1]) ? [1, 0] : '-LF'.includes(tiles[r][c-1]) ? [-1, 0] : '|JL'.includes(tiles[r+1,c]) ? [0, 1] : [1, 0])], ([loopMap, px, py, dx, dy]) => [Object.assign(loopMap || {}, {[`${py}_${px}`] : tiles[py][px]}), px + dx, py + dy, ...[[dx, dy]].map(n => 'FJL7'.includes(tiles[py+dy][px+dx]) ? n.reverse() : n)[0].map(n => n * ('FJ'.includes(tiles[py+dy][px+dx]) ? -1 : 1))], ([loopMap, px, py]) => loopMap != null && tiles[py][px] === 'S')[0], {[`${r}_${c}`]: '-J7'.includes(tiles[r][c+1]) ? '-LF'.includes(tiles[r][c-1]) ? '-' : '|F7'.includes(tiles[r-1][c]) ? 'L' : 'F' : '-LF'.includes(tiles[r][c-1]) ? '|F7'.includes(tiles[r-1][c]) ? 'J' : '7' : '|' /*TODO*/});
const part1 = Math.ceil(Object.keys(loopMap).length / 2);
const part2 = tiles.length * tiles[0].length - Array.from(until([new Set(), [...[...Array(tiles[0].length).keys()].flatMap(x => [[0, x], [0, x + 0.5], [tiles.length - 0.5, x], [tiles.length - 0.5, x + 0.5]]), ...[...Array(tiles.length).keys()].flatMap(y => [[y, 0], [y + 0.5, 0], [y, tiles[0].length - 0.5], [y + 0.5, tiles[0].length - 0.5]])]], ([outsideSet, [[r,c], ...rest]]) => (r < 0 || r >= tiles.length || c < 0 || c >= tiles[0].length || outsideSet.has(`${r}_${c}`) || ((r % 1 === 0) ? (c % 1 === 0) ? `${r}_${c}` in loopMap : ['-', 'L', 'F'].some(dir => loopMap[`${r}_${Math.floor(c)}`] === dir) && ['-', 'J', '7'].some(dir => loopMap[`${r}_${Math.ceil(c)}`] === dir) : (c % 1 === 0) ? ['|', 'F', '7'].some(dir => loopMap[`${Math.floor(r)}_${c}`] === dir) && ['|', 'L', 'J'].some(dir => loopMap[`${Math.ceil(r)}_${c}`] === dir) : false)) ? [outsideSet, rest] : [outsideSet.add(`${r}_${c}`), [...rest, [r,c+0.5],[r,c-0.5],[r+0.5,c],[r-0.5,c]]], ([_, q]) => q.length === 0)[0]).filter(s => !s.includes('.')).length - Object.keys(loopMap).length;

console.log(part1);
console.log(part2);