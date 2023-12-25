const { readFileSync } = require('fs');
const { EOL } = require('os');

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
    let total = 0;
    Object.entries(weights[v]).forEach(([k, w]) => {
        if (A.has(k)) {
            total +=w;
        }
    });
    return total;
}


function minimumCutPhase(a) {
    // console.log('start cut phase', a);
    const A = new Set([a]);
    const V = Object.keys(weights).filter(k => k !== a);
    while (V.length > 2) {
       V.sort((v1, v2) => weightToSet(v2, A) - weightToSet(v1, A));
       A.add(V.shift());
    }
    V.sort((v1, v2) => weightToSet(v2, A) - weightToSet(v1, A));
    const [s, t] = V;
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
