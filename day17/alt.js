const { readFileSync } = require('fs');
const { EOL } = require('os');

// generalized recursion helper
function until(seed, step, predicate) {
    while(!predicate(seed)) {
        seed = step(seed);
    }
    return seed;
}

let PrioQueue = class { //a basic priority queue class with custom metric.
    //(a,b)=>a.prio-b.prio gives a max heap.
    //prio should not be changed after insertion.
    
    //helper functions, not to be used outside
    swap(a,b) { //swap heap[a] and heap[b], then return b
      let tmp = this.heap[a];
      this.heap[a] = this.heap[b];
      this.heap[b] = tmp;
      return b;
    }
    parent(pos) {
      return Math.floor((pos-1)/2);
    }
    higherChild(pos) { //index of the higher child of pos, or null if it has none. if equal, prefers left
      //children are n*2+1, n*2+2
      if (pos >= (this.heap.length-2)/2) return null;
      if (this.cmp(pos*2+1, pos*2+2) < 0) return pos*2+2;
      return pos*2+1;
    }
    cmp(p1,p2) { //compare heap[p1] and heap[p2] with metr
      return this.metr(this.heap[p1],this.heap[p2]);
    }
    
    //main functions
    constructor(metr) {
      if (metr == undefined) metr = (a,b)=>a-b;
      
      this.metr = metr;
      this.heap = [];
    }
    push(item) {
      let itempos = this.heap.length;
      this.heap.push(item);
      
      while (itempos > 0 && this.cmp(itempos,this.parent(itempos)) > 0) {
        itempos = this.swap(itempos,this.parent(itempos));
      }
    }
    pop() {
      this.swap(0,this.heap.length-1);
      let pos = 0;
      let item = this.heap.pop();
      
      while (this.higherChild(pos) && this.cmp(pos,this.higherChild(pos)) < 0) {
        pos = this.swap(pos,this.higherChild(pos));
      }
      return item;
    }
  }

const lines = readFileSync('./input.txt').toString().trim().split(EOL).map(str => Array.from(str));

const vertices = ['start', 'end'];

const edges = {
    start: {},
    end: {}
};


const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const amts = [1, 2, 3];

lines.forEach((line, row) => 
    line.forEach((s, col) => { 
        const vname = `${row}.${col}`;
        vertices.push(vname);

        dirs.forEach(([dr, dc]) => {
            const prow = row - dr;
            const pcol = col - dc;
            const pname = `${prow}.${pcol}`
            edges[pname] = edges[pname] || {};
            edges[pname][vname] = {dr, dc, n: parseInt(s)};
        })
    })
)


const source = '0.0';
let dist = {};
let prev = {};

const q = [];

vertices.forEach(v => {
    dist[v] = Infinity;
    q.push(v);
})
dist[source] = 0;

while(q.length > 0) {
    q.sort((a,b) => dist[a] - dist[b]);
    let u = q.shift();
    console.log('process', u);


    Object.keys(edges[u]).forEach(v => {
        if (!q.includes(v)) {
            return;
        }
        console.log('     consider', v);
        let edge = edges[u][v];
        const samedir = prev[u]?.dr === edge.dr && prev[u]?.dc === prev[u].dc
        if (samedir && prev[u]?.c === 3) {
            console.log('     skipped');
            return;
        }
        console.log('     current dist is', )
        let alt = dist[u] + edge.n;
        if (alt < dist[v]) {
            console.log('     adjusted', v, 'dist ', dist[v], 'to', alt)
            dist[v] = alt;
            prev[v] = {dr: edge.dr, dc: edge.dc, c: samedir? prev[u].c + 1 : 1}
            console.log('     set prev to', prev[v])
        }
        else if (alt === dist[v]) {
            prev[v] = {dr: 0, cd: 0, c: 0};
            console.log('     fixed prev to', prev[v])

        }
    });
}

console.log(dist[`${lines.length - 1}.${lines[0].length - 1}`]);
