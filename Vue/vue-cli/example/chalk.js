/*
 * FilePath: \chalk.js
 * Project: demo
 * CreatedAt: 2021-01-07 17:23:57
 * CreatedBy: ABC
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
const chalk = require("chalk");

const error = chalk.bold.red;
const warning = chalk.keyword("orange");

console.log(error("Error!"));
console.log(warning("Warning!"));
