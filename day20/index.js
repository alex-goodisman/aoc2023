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

const process = (predicate) =>  until([lines.map(line => line.split(' -> ')).map(([a, b]) => '&%'.includes(a[0]) ? [a.slice(1), a[0], b.split(', ')] : [a, null, b.split(', ')]).reduce((states, [name, type, down]) => down.reduce((states, d) =>  Object.assign(states, {[d]: Object.assign(states[d] || {down: []}, {state: (!(d in states) || typeof states[d].state === 'object') ? Object.assign(d in states ? states[d].state : {}, {[name]: false}) : states[d].state})}), Object.assign(states, {[name]: Object.assign(states[name] || {state: {}}, {type, down}, type === '%' ? {state: false} : {})})), {})].map(states => [0, 0, 0, Object.fromEntries(Object.keys(states).filter(k => states[k].down.includes('rx')).flatMap(x => Object.keys(states).filter(k => states[k].down.includes(x))).map(x => [x, 0])), states])[0], ([presses, totalHigh, totalLow, precursors, states]) => [presses + 1, ...until([totalHigh, totalLow, precursors, states, [[false, 'broadcaster', '']]], ([totalHigh, totalLow, precursors, states, [[high, name, prev], ...rest]]) =>  [totalHigh + high, totalLow + !high, Object.assign(precursors, (high && prev in precursors) ? {[prev]: precursors[prev] || presses + 1} : {}), Object.assign(states, {[name]: Object.assign(states[name], {state: (states[name].type === '%' && !high) ? (!states[name].state) : (states[name].type === '&') ? (Object.assign(states[name].state, {[prev]: high})) : (states[name].state)})}), rest.concat(((states[name].type === '%') ? (high ? [] : [states[name].state]) : (states[name].type === '&') ? ([Object.values(states[name].state).includes(false)]) : ([high])).flatMap(p => states[name].down.map(d => [p, d, name])))], ({4: q}) => q.length === 0)], predicate);
const part1 = [process(([presses]) => presses >= 1000)].map(([_, totalHigh, totalLow]) => totalHigh * totalLow)[0];
const part2 = [process(({3: precursors}) => !Object.values(precursors).includes(0))].map(({3: precursors}) => Object.values(precursors).reduce((a, b) => a * b, 1))[0]

console.log(part1);
console.log(part2);
