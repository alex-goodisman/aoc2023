const { readFileSync } = require('fs');
const { EOL } = require('os');

class PrioQueue {
    constructor(fn) {
        this.fn = fn;
        this.heap = [null];
    }
    add(item) {
        let idx = this.heap.length;
        this.heap.push(item);

        while(idx > 1 && this.fn(this.heap[idx]) > this.fn(this.heap[Math.floor(idx / 2)])) {
            Object.assign(this.heap, {[idx]: this.heap[Math.floor(idx / 2)], [Math.floor(idx / 2)]: this.heap[idx]});
            idx = Math.floor(idx / 2);
        }
    }
    increaseWeight(item) {
        let idx = this.heap.indexOf(item);
        if (idx === -1) {
            return;
        }

        while(idx > 1 && this.fn(this.heap[idx]) > this.fn(this.heap[Math.floor(idx / 2)])) {
            Object.assign(this.heap, {[idx]: this.heap[Math.floor(idx / 2)], [Math.floor(idx / 2)]: this.heap[idx]});
            idx = Math.floor(idx / 2);
        }

    }
    getMax() {
        Object.assign(this.heap, {[1]: this.heap[this.heap.length - 1], [this.heap.length - 1]: this.heap[1]});

        const ret = this.heap.pop();
        let idx = 1;

        while (idx < this.heap.length && this.fn(this.heap[idx]) < Math.max(this.fn(this.heap[idx * 2]), this.fn(this.heap[idx * 2 + 1]))) {
            let cidx = (this.fn(this.heap[idx * 2])) > (this.fn(this.heap[idx * 2 + 1])) ? idx * 2 : idx * 2 + 1;

            Object.assign(this.heap, {[idx]: this.heap[cidx], [cidx]: this.heap[idx]});
            idx = cidx;
        }

        return ret;
    }
    size() {
        return this.heap.length - 1;
    }

}



const lines = readFileSync('./input.txt').toString().trim().split(EOL);

let weights = {};

lines.forEach(line => {
    const [from, rest] = line.split(': ');
    const to = rest.split(' ');
    weights[from] = weights[from] || {};
    to.forEach(dest => {
        weights[dest] = weights[dest] || {};
        weights[dest][from] = 1;
        weights[from][dest] = 1;
    });
});

const vCount = Object.keys(weights).length;


function weightToSet(v, A) {
    if (!(v in weights)) {
        return -Infinity;
    }
    let total = 0;
    Object.entries(weights[v]).forEach(([k, w]) => {
        if (A.has(k)) {
            total +=w;
        }
    });
    return total;
}


function minimumCutPhase(a) {
    const A = new Set([a]);

    const V = new PrioQueue((v) => weightToSet(v, A));
    Object.keys(weights).forEach(k => {
        if (k !== a) {
            V.add(k);
        }
    })


    while (V.size() > 2) {
       const z = V.getMax();
       A.add(z);
       Object.keys(weights[z]).forEach(w => {
        V.increaseWeight(w);
       });
    }

    const s = V.getMax();
    const t = V.getMax();
    const tCutWeight = Object.values(weights[t]).reduce((a,b) => a + b);
    const st = `${s}.${t}`;
    weights[st] = {};
    Object.entries(weights[s]).forEach(([k, w]) => {
        weights[st][k] = w;
        weights[k][st] = w;
        delete weights[k][s];
    });
    delete weights[s];
    Object.entries(weights[t]).forEach(([k, w]) => {
        weights[st][k] = (weights[st][k] || 0) + w;
        weights[k][st] = (weights[k][st] || 0) + w;
        delete weights[k][t];
    });
    delete weights[t];
    delete weights[st][st];
    // console.log('cut of the phase', s, t, tCutWeight);
    // console.log(weights);
    // console.log();
    return [t, tCutWeight];
}

let currentMinimumCut = ['', Infinity];

function minimumCut() {
    let V = Object.keys(weights);
    while (V.length > 2) {
        // console.log(V.length);
        const a = V[0];
        const cutOfThePhase = minimumCutPhase(a);
        if (cutOfThePhase[1] < currentMinimumCut[1]) {
            currentMinimumCut = cutOfThePhase;
        }
        V = Object.keys(weights);
    }
    const [s, t] = V;
    const finalCutWeight = weights[s][t];
    if (finalCutWeight < currentMinimumCut) {
        currentMinimumCut = [t, finalCutWeight];
    }
}


minimumCut();
// console.log(currentMinimumCut);
const size = currentMinimumCut[0].split('.').length;
console.log(size * (vCount - size));
