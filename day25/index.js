const { readFileSync } = require('fs');
const { EOL } = require('os');

// generalized recursion helper
function until(seed, step, predicate) {
    while(!predicate(seed)) {
        seed = step(seed);
    }
    return seed;
}

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
        return this;
    }
    increaseWeight(item) {
        let idx = this.heap.indexOf(item);
        if (idx === -1) {
            return this;;
        }

        while(idx > 1 && this.fn(this.heap[idx]) > this.fn(this.heap[Math.floor(idx / 2)])) {
            Object.assign(this.heap, {[idx]: this.heap[Math.floor(idx / 2)], [Math.floor(idx / 2)]: this.heap[idx]});
            idx = Math.floor(idx / 2);
        }
        return this;

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

const part1 = [until([['', Infinity], lines.map(line => line.split(': ')).reduce((weights, [from, rest]) => rest.split(' ').reduce((weights, to) => Object.assign(weights, {[from]: Object.assign(weights[from] || {}, {[to]: 1}),  [to]: Object.assign(weights[to] || {}, {[from]: 1})}), weights), {})], ([[minCut, minCutWeight], weights]) => [[until([new Set([Object.keys(weights)[0]])].flatMap(A => [A, Object.keys(weights).slice(1).reduce((V, k) => V.add(k), new PrioQueue((v) => Object.entries(weights[v] || []).reduce((total, [k, v]) => total + (A.has(k) ? v : 0), 0)))]), ([A, V]) => [V.getMax()].flatMap(z => [A.add(z), Object.keys(weights[z]).reduce((V, w) => V.increaseWeight(w), V)]), ([_, V]) => V.size() <= 2)].flatMap(([A, V]) => [V.size() === 1 ? [...A][0] : V.getMax(), V.getMax()])].flatMap(([s, t]) => [Object.values(weights[t]).reduce((a,b) => a + b) < minCutWeight ? [t, Object.values(weights[t]).reduce((a,b) => a + b)] : [minCut, minCutWeight], Object.fromEntries(Object.entries([s, t].reduce((weights, x) => Object.entries(weights[x]).filter(([k]) => k !== `${s}.${t}`).reduce((weights, [k, w]) => Object.assign(weights, {[k]: Object.fromEntries([...Object.entries(weights[k]).filter(([e]) => e !== x), [`${s}.${t}`, (weights[`${s}.${t}`][k] || 0) + w]])}), weights), Object.assign(weights, {[`${s}.${t}`]: Object.fromEntries([...Object.keys(weights[s]), ...Object.keys(weights[t])].map(k => [k, (weights[s][k] || 0) + (weights[t][k] || 0)]).filter(([k]) => k !== s && k !== t && k !== `${s}.${t}`))}))).filter(([k]) => k !== s && k !== t))]), ([_, weights]) => Object.keys(weights).length === 1)].map(([currentMinimumCut, weights]) => currentMinimumCut[0].split('.').length * (Object.keys(weights)[0].split('.').length -  currentMinimumCut[0].split('.').length))[0]

console.log(part1);
