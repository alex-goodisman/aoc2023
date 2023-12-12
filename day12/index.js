const { readFileSync } = require('fs');
const { EOL } = require('os');

const lines = readFileSync('./input.txt').toString().trim().split(EOL).map(line => line.split(' ')).map(([data, nums]) => [data, [...nums.matchAll(/\d+/g)].map(([n]) => parseInt(n))]);

const map = {};
const process = (data, nums, idx) => (`${data}|${nums}|${idx}` in map ? map[`${data}|${nums}|${idx}`] : map[`${data}|${nums}|${idx}`] = nums.length === 0 ? data.slice(idx).includes('#') ? 0 : 1 : idx >= data.length ? 0 : (data[idx] !== '.' && (idx + nums[0] <= data.length) && !data.slice(idx, idx + nums[0]).includes('.') && data[idx + nums[0]] !== '#' ? process(data, nums.slice(1), idx + nums[0] + 1) : 0) + (data[idx] !== '#' ? process(data, nums, idx + 1) : 0));

const processAll = m => lines.map(([data, nums]) => process(Array(m).fill(data).join('?').split(''), Array(m).fill(nums).flat(), 0)).reduce((a,b) => a+b)

const part1 = processAll(1);
const part2 = processAll(5);

console.log(part1);
console.log(part2);