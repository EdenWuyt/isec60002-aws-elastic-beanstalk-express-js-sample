const assert = require('assert');
const getGreeting = require('../greeting');

assert.strictEqual(getGreeting(), 'Hello World!');
console.log('Unit test passed.')
