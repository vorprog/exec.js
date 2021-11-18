const diff = require('diff');
const loop = require('@vorprog/loop').loop;
const main = require('../src/main');

const testResults1 = diff.diffWords(`33`, main.add(11, 22).toString());
if (testResults1.length > 1) {
  const diffLog = loop(testResults1, (index, change) => `${change.added ? `DISCREPANCY.ACTUAL:` : change.removed ? `DISCREPANCY.EXPECTED:` : ``} ${change.value}`).join(`\n`);
  throw Error(`There were unexpected results during testing: \n${diffLog}`);
}

const testResults2 = diff.diffWords(`hello world!`, main.add(`hello `, `world!`));
if (testResults2.length > 1) {
  const diffLog = loop(testResults2, (index, change) => `${change.added ? `DISCREPANCY.ACTUAL:` : change.removed ? `DISCREPANCY.EXPECTED:` : ``} ${change.value}`).join(`\n`);
  throw Error(`There were unexpected results during testing: \n${diffLog}`);
}

console.log(`Tests successfully completed!`);
