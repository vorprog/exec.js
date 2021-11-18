/**
 * @typedef {Object} Module
 * @property {function(number,number):number|function(string,string):string} add
 */

/** @type {Module} */
module.exports = {
  add: (arg0, arg1) => arg0 + arg1
}