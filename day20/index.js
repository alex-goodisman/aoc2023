const { readFileSync } = require('fs');
const { EOL } = require('os');

const lines = readFileSync('./input.txt').toString().trim().split(EOL);

let states = lines.map(line => line.split(' -> ')).map(([a,b]) => '&%'.includes(a[0]) ? [a.slice(1), a[0], b.split(', ')] : [a, null, b.split(', ')]).reduce((states, [name, type, down]) => down.reduce((states, d) =>  Object.assign(states, {[d]: Object.assign(states[d] || {down: []}, {state: (!(d in states) || typeof states[d].state === 'object') ? Object.assign(d in states ? states[d].state : {}, {[name]: false}) : states[d].state})}), Object.assign(states, {[name]: Object.assign(states[name] || {state: {}}, {type, down}, type === '%' ? {state: false} : {})})), {});


let totalLow = 0;
let totalHigh = 0;

let presses = 0;

let precursors = Object.fromEntries(Object.keys(states).filter(k => states[k].down.includes('rx')).flatMap(x => Object.keys(states).filter(k => states[k].down.includes(x))).map(x => [x, 0]));

function pulse() {
    presses++;

    let q = [[false, 'broadcaster', '']];

    while(q.length > 0) {
        const [[high, name, prev], ...rest] = q;

        precursors = Object.assign(precursors, (high && prev in precursors) ? {[prev]: precursors[prev] || presses} : {});


        totalHigh += high;
        totalLow += !high;

        states = Object.assign(states, {[name]: Object.assign(states[name], {state: (states[name].type === '%' && !high) ? (!states[name].state) : (states[name].type === '&') ? (Object.assign(states[name].state, {[prev]: high})) : (states[name].state)})});
        

        q = rest.concat(((states[name].type === '%') ? (high ? [] : [states[name].state]) : (states[name].type === '&') ? ([Object.values(states[name].state).includes(false)]) : ([high])).flatMap(p => states[name].down.map(d => [p, d, name])));
        
    }
}


while (presses < 1000) {
    pulse(false, 'broadcaster');
}
console.log(totalLow * totalHigh);

while (Object.values(precursors).reduce((a,b) => a * b, 1) === 0) {
    pulse(false, 'broadcaster');
}
console.log(Object.values(precursors).reduce((a,b) => a * b, 1));
