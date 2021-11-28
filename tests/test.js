const diff = require('diff');
const loop = require('@vorprog/loop').loop;
const exec = require('../src/main');

const testStrings = (testName, expected, actual) => {
  const testResults = diff.diffWords(expected, actual);

  if (testResults.length <= 1) {
    console.log(`Test "${testName}" passed`);
    return;
  }

  const diffLog = loop(testResults, (index, change) => {
    const changeType = change.added ? `ACTUAL:` : change.removed ? `EXPECTED:` : ``;
    return (`${changeType} ${change.value}`)
  }).join(`\n`);
  console.error(`Test "${testName}" failed. There were unexpected results during testing: \n${diffLog}`);
};

const commandResult1 = exec.exec(`echo "hello world"`);
testStrings(`test#1`, `hello world`, commandResult1);

exec.setDefaultOptions({
  secrets: [`pass1234`, `az190-#%$^&{}*!@=+?<>//`],
  ignorableErrors: [
    `An error occurred (EntityAlreadyExists)`,
  ]
});

const commandResult2 = exec.exec(`echo "Hello World! The first secret is pass1234. All secrets: pass1234, az190-#%$^&{}*!@=+?<>//"`);
testStrings(`test#2`,`Hello World! The first secret is pass1234. All secrets: pass1234, az190-#%$^&{}*!@=+?<>//`, commandResult2);
