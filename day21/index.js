const { readFileSync } = require('fs');
const { EOL } = require('os');

const lines = readFileSync('./input.txt').toString().trim().split(EOL);

const N = lines.length; // first assumption: square grid (NxN not NxM). this is true of the input

const m = Math.floor(N / 2); // second assumption, grid size is odd (2k+1) and has a center square. this is true of the input.

// BFS to compute distance to every tile from a given source
function distancesFrom(sr, sc) {
    let q = [[sr, sc, 0]];

    let dist = {};
    while(q.length > 0) {
        let [r, c, d] = q.shift();

        if (!(`${r}.${c}` in dist)) {
            dist[`${r}.${c}`] = d;

            [[r + 1, c], [r, c-1], [r-1,c], [r,c+1]].forEach(([nr, nc]) => {
                if (lines[nr] && lines[nr][nc] && lines[nr][nc] !== '#') {
                    q.push([nr, nc, d + 1]);
                }
            })
        }
    }
    return dist;
}


// distance map is read like distance['0.0']['7.2'], meaning distance from start point (0,0) to point (7,2)
const distances = {};

// compute distance from center, each corner, and center of each side.
for (let r of [0, m, N-1]) {
    for (let c of [0, m, N-1]) {
        distances[`${r}.${c}`] = distancesFrom(r, c);
    }
}

// part 1
const S1 = 64;

// find all tiles whose distance from center is within 64 and has same parity.
const part1 = Object.values(distances[`${m}.${m}`]).filter(d => d <= S1 && d % 2 === S1 % 2).length;
console.log(part1);

// part 2

// third assumption: that all tiles whose copies can reach the center on the infinite grid can themselves reach the center on a single grid.
// i.e. no "secret passages". this is true of the input. because the exterior perimeter of the grid is open.
const tiles = Object.keys(distances[`${m}.${m}`]);

const S2 = 26501365;

// consider every tile
const counts = tiles.map(tile => {
    // count how many "versions" of this tile can reach the center in S2 steps.
    let n = 0;

    // we have nine regions, each corresponding to one of the source nodes in the "distance" map.
    // - the center node, which corresponds to the middle grid 
    // - nodes at the center of each side. these correspod to axial copies of the grid
    //      e.g. the bottom center node corresponds to copies of the grid directly above the center.
    // - nodes on the corners. these correspond to quadrantal copies of the grid
    //      for example, the bottom left node corresopnds to copies of grid above and to the right of the center.

    Object.keys(distances).forEach(edge => {
        // figure out which node this is.
        const [er, ec] = edge.split('.').map(n => parseInt(n));

        // get the opposite corner or edge.
        const [or, oc] = [er, ec].map(v => N - 1 - v);

        const tileDist = distances[edge][tile]; // how far to get from this tile to the relevant corner/edge
        const centerDist = distances[`${or}.${oc}`][`${m}.${m}`]; // how far to get from the center to the opposite corner/edge.
        
        // handle different types of nodes differently
        if (er === m && ec === m) {
            // this is the center node.
            // in that case, this tile adds 1 if its direct distance has the same parity as the step count.
            // otherwise nothing.
            if (tileDist % 2 === S2 % 2) {
                // technically, this assumes that S2 is bigger than tileDist. but it obviously is, given the nature of the puzzle.
                n++;
            }
        } else if (er === m || ec === m) {
            // this is an edge node, so we are dealing with axial copies of the grid (moving away from the center in a single dimension).

            // fourth (main) assumption: the shortest path from any tile in an axial copy of the grid to the true center will go through the 
            // middle of the side of that grid that faces the center. E.g., the shortest path to the center from any tile in a grid above the center
            // will go through the middle of the bottom of the starting grid (and go straight down from there).
            // this is true of the input because of the empty spaces through the middle of the grid and around the edges.
            // see justification at the end.

            // therefore, the shortest distance to the middle is going to be (WLOG):
            // go from tile to bottom-center. then go straight  down through as many copies of the grid as will fit.
            // then 1 additional step to go from bottom-center of the grid above the middle to the top-center of the middle grid.
            // then finally go to the center from there.
            // this is effectively (tile->bottomcenter) + N*(as many as will fit) + 1 + (topcenter->center)

            // fixedDist is the part of this some that is the same no matter how far we are (so the beginning and end).
            const fixedDist = tileDist + centerDist + 1;

            // how many steps are left to "spend"
            const stepsToSpare = S2 - fixedDist;

            // assuming we don't divide evenly, there will be some extra steps after we follow this sequence and fill as many grids as we can.
            // this is how many steps are left over after spending all of them.
            const extraSteps = stepsToSpare % N;

            // ignoring the extra steps, this is how many grids up we can go.
            // i.e. iterations * N + fixedDist should be the distance from the furthest reachable copy of this node, to the true center.
            const iterations = (stepsToSpare - extraSteps) / N;

            // note that fixedDist is already for the first grid _above_ the main one, so iterations are for future ones beyond that.
            // i.e. if i is the iteration counter, then i=0 is the closest reachable grid, and i = iterations is the farthest.

            // because the grid size is odd, successive iterations swap parity.
            // therefore, the first one may actually be 1 and not 0, if 1 doesn't fit.
            const minIter = (fixedDist % 2 === S2 % 2) ? 0 : 1;

            // similarly, the last one might be iterations - 1
            const maxIter = ((iterations * N + fixedDist) % 2 === S2 % 2) ? iterations : iterations - 1;

            // after adjusting both min and max iter, the corresponding tiles have the same parity, and therefore the distance between them is even.
            // and since the grid size is odd, the number of iterations between them (maxIter - minIter) must also be even.
            // which is good, because we only want every other iteration in the interim.
            // this is still because of parity. if i=0 is the right parity, then i=1 is wrong, and i=2 is right, etc.
            // i.e. if minIter is 1 and maxIter is 7, then we want 1, 3, 5, 7. aka (7-1)/2+1=4 total iterations.

            const versions = (maxIter - minIter) / 2 + 1;
            // technically there's an assumption here that this won't be negative. It could only be if S2 was less than two full grids, which it clearly isn't
            // given the puzzle description. But regardless, it isn't true of the input either.

            n += versions;
        } else {
            // this is a corner node, so we are dealing with quadrantal copies of the grid (moving away in a diagonal direction, along two axes).
            
            // with the corner nodes, the fixed distance is longer by 1, since we have to get (WLOG)
            // from the tile to the bottom left corner, (then through as many grids as will fit), then take TWO steps from bottom left to top right
            // of the middle grid, then go to the center of the middle grid. 2 steps because we can't move diagonally.
            const fixedDist = tileDist + centerDist + 2;

            // figuring out the iteration count is the same for a corner.
            const stepsToSpare = S2 - fixedDist;
            const extraSteps = stepsToSpare % N;
            const iterations = (stepsToSpare - extraSteps) / N;
            const minIter = (fixedDist % 2 === S2 % 2) ? 0 : 1;
            const maxIter = ((iterations * N + fixedDist) % 2 === S2 % 2) ? iterations : iterations - 1;

            // but now it's more complicated.
            // 0 here refers to the quadrant kitty-corner from the center, and then further iterations can go out in a combination of directions from there
            // as long as they stay in the correct quadrant.
            // this means that each "iteration" number counts for multiple grids.
            // 0 only counts for the starter grid. (1 possibility).
            // 1 can go in either direction (2 possibilities)
            // 2 can go in either direction (2 possibilities) or do 1 in each (+1) for a total of 3.
            // 3 can go in either direction, or do 2-1 or 1-2 (4 possibilities)
            // 4 can do 0-4, 1-3, 2-2, 3-1, or 4-0. (5)
            // and so on.
            // iteration #X has X+1 possibilities for where it can go. 

            // and we need to sum these.
            // for instance, if minIter is 1 and maxIter is 7, because of parity, we still only want 1,3,5,7.
            // but that is really 1x2, 3x4, 5x6, 7x8. since each of those can happen in multiple ways.
            // i.e. 20 possibilities (2+4+6+8).
            // we only really care about how many, so we can do gaussian addition.

            // as before, the number of iterations is even, so (maxIter - minIter) / 2 + 1 is the number of distinct iteration counts.
            // minIter has minIter+1 options, and maxIter has maxIter+1 options.
            // so the gaussian sum is (minIter + maxIter + 2) * iterCount / 2, i.e. 
            // (minIter + maxIter + 2) * ((maxIter - minIter) / 2 + 1) / 2
            // in the 1-7 example that is
            // (1+7+2) * ((7-1) / 2 + 1) / 2 = 10 * 4 / 2 = 20 which is what we want.

            const versions = (minIter + maxIter + 2) * ((maxIter - minIter) / 2 + 1) / 2;

            n += versions
        }


    });
    return n;
});
// then when we know how many versions of each tile there are, we can just add them
const part2 = counts.reduce((a,b) => a + b);

console.log(part2);

// Justification for why this works:

// Axial case:
// Without loss of generality, assume we are talking about a directly above the center (any distance out). Call this the starting grid.
// Pick some tile in this grid from which the true center is reachable (i.e. the tile is not in a "prison").
// There are many paths from this tile to the true center, of different lengths. We want the shortest path since
// we need to compare it to how many steps we have, and we can rule it out if its shortest path is longer than the step count.
// There may be many shortest paths all of the same lengths, that take different routes.
// However, since any shortest path must start in the starting grid (which is above the center)
// and end at the center, no matter what route it takes, it must eventually cross the grid boundary between
// the starting grid and the one below it (by the Intermediate Value Theorem). For example, if the starting grid is 3 grids above the middle, then
// it must at some point cross down to be only 2 grids above the middle (even if the path somehow moves sideways to not be above the middle anymore,
// or goes back up, or whatever).
// as soon as it does this, regardless of what path it takes from here, there is a path of equal length that:
// first, moves horizontally until it is directly above the true center.
// second, moves down until it is at the true center.
// The fact that this path must exist is because of properties of the input: there is an unimpeded horizontal line on both sides of the grid boundary
// here between 3-above and 2-above, that allows for horizontal movement until positioning directly above the true center.
// there is then also an unimpeded vertical line directly above and below the true center.
// These input properties prove that this path must exist. But it also must be the shortest path (or tied) because its length is equal to the
// Manhattan distance (horizontal + vertical displacement). When only rectilinear movement is allowed, the Manhattan distance is the shortest
// distance between two points. This path (move over the center, then go down) only ever moves towards the center along either axis, and therefore is minimal.
// This means that whatever other shortest paths exist from the chosen tile, there is always one that reaches the bottom of the starting grid, then goes
// straight to the center from there. 
// This path must exist, and it must include a specific point- the point in the center of the bottom edge, where the turn from horizontal to vertical happens.
// no matter what the path did previously, or how it reached the bottom, it always goes through this point.
// Since the shortest distance from this point to the true center is a straight line (down), which is minimal even outside of Manhattan, it follows that
// there is a shortest path from the original starting tile that goes to this specific point as fast as possible, then goes down to the center.
// Additionally, because of the unimpeded vertical lines at the left and right edge, the shortest path to this bottom-center point
// can also always exist entirely within the starting grid, since as soon as the path reaches the left or right limit, it can go straight
// to this point by going down and then over, which is Manhattan distance.

// This means that if you know the shortest path from this point (bottom center, aka row N, col N/2) to every other tile,
// then you can figure out the shortest path from any tile in any grid directly above the center to the true center in constant time.
// generalizing this to the other directions, if you know the distance to (N/2, N), you can figure out the shortest path in grids to the right, etc.

// Quadrantal case:
// This is basically the same as the axial case, but applied twice.
// Without loss of generality, assume we are in the top right quadrant.
// Any shortest path from here to the true center must cross either the left edge or bottom edge of the starting grid.
// from there there must be a shortest path that goes down-then-left (if we are at the left edge) or left-then-down (if we are at the right edge).
// both of these routes go through the bottom left corner. since any shortest path goes through the bottom left corner, if the distance from
// this corner to every tile is known, then every tile's shortest path can be computed in constant time.
// this generalizes to the other quadrants.

// Center case:
// For tiles inside the center grid, none of the above matters, and they can use distance to the center directly. This is because there is only one
// such grid, so its values can just be memoized and then accessed in constant time.

// Conclusion
// For a given tile in a given grid, we can compute that tile's distance to the true center in constant time using this method.
// We can also do the reverse, and compute in which grid(s) are there equivalents to a given tile whose distance to the center is equal
// to a certain value. This allows for solving the problem, as it enables a constant-time count, per-tile, of every possible version of a tile
// in every grid on the infinite plane, that is within the maximum distance. This yields quadratic runtime overall.
// Pre-computing the distance inside the grid is linear in the size of the graph, which is quadratic in N.
