const { readFileSync } = require('fs');
const { EOL } = require('os');
const { inspect } = require('util');

// generalized recursion helper
function until(seed, step, predicate) {
    while(!predicate(seed)) {
        seed = step(seed);
    }
    return seed;
}

const lines = readFileSync('./input.txt').toString().trim().split(EOL);

const states = {};

const reverse = {};

lines.forEach(line => {
    const [a, b] = line.split(' -> ');
    const [type, name] = '&%'.includes(a[0]) ? [a[0], a.slice(1)] : [null, a];
    const down = b.split(', ');

    if (!(name in states)) {
        states[name] = {state: {}};
    }

    states[name].type = type;
    states[name].down = down;

    if (type === '%') {
        states[name].state = false;
    }

    down.forEach(d => {
        if (!(d in states)) {
            states[d] = {down: [], state: {}};
        }
        states[d].state[name] = false;

        if (!(d in reverse)) {
            reverse[d] = [];
        }
        reverse[d].push(name);
    })
});

let totalLow = 0;
let totalHigh = 0;

let presses = 0;

const precursors = Object.fromEntries(reverse['rx'].flatMap(x => reverse[x]).map(x => [x, 0]));
let precursorProd = 0;

function pulse() {

    const q = [[false, 'broadcaster', '']];

    while(q.length > 0) {
        const [high, name, prev] = q.shift();
        const module = states[name];

        if (high && prev in precursors) {
            precursors[prev] = precursors[prev] || presses;
            precursorProd = Object.values(precursors).reduce((a,b) => a * b, 1);
        }

        if (high) {
            totalHigh++;
        } else {
            totalLow++;
        }

        if (module.type === '%') {
            if (!high) {
                module.state = !module.state
                module.down.forEach(d => q.push([module.state, d, name]));
            }
        } else if (module.type === '&') {
            module.state[prev] = high;
            if (Object.values(module.state).includes(false)) {
                module.down.forEach(d => q.push([true, d, name]));
            } else {
                module.down.forEach(d => q.push([false, d, name]));
            }
        } else {
            // broadcaster
            module.down.forEach(d => q.push([high, d, name]));
        }
    }
}


while (presses < 1000) {
    presses++;
    pulse(false, 'broadcaster');
}
console.log(totalLow * totalHigh);

while (precursorProd === 0) {
    presses++;
    pulse(false, 'broadcaster');
}
console.log(precursorProd);
