const execSync = require('child_process').execSync;
const loop = require('@vorprog/loop').loop;

/** @param {string} content @param {string[]} secrets @returns {string} */
const scrub = (content, secrets) => {
  loop(secrets, secret => content = content.replace(secret, `****REDACTED****`));
  return content;
};

/** @param {string} content */
const parseJson = content => {
  try {
    return JSON.parse(content);
  } catch (error) {
    return content;
  }
};

/** 
 * @typedef {Object} ExecOptions
 * @property {string[]} ignorableErrors
 * @property {string[]} secrets
 * @property {function(...any):any} logFunction(bla)
 */

/** @type {ExecOptions} */
let defaultOptions = {
  logFunction: (...data) => {
    console.log(...data);
    return data;
  }
};

module.exports = {
  /** @param {ExecOptions} options */
  setDefaultOptions: (options) => defaultOptions = Object.assign(defaultOptions, options),

  /** @param {string} command @param {ExecOptions} options */
  exec: (command, options = {}) => {
    const stackTrace = new Error().stack.split(`at `)[2].replace(`Object.<anonymous>`, ``).trim();
    const currentOptions = Object.assign(defaultOptions, options);

    try {
      command = command.replace(/\n/g, ` `); // replace new lines with spaces to keep the command on a single line
      if (currentOptions.logFunction) currentOptions.logFunction(`\nTRACE: ${stackTrace}`, scrub(command, currentOptions.secrets));
      const result = execSync(command, { stdio: 'pipe' }).toString();
      return parseJson(result);
    } catch (error) {
      if (error instanceof Error) {
        const scrubbedErrorMessage = scrub(error.message, currentOptions.secrets);
        let throwError = true;
        loop(currentOptions.ignorableErrors, ignorableError => scrubbedErrorMessage.includes(ignorableError) ? throwError = false : null);
        if (throwError) throw new Error(scrubbedErrorMessage);
      }
    }
  }
};
