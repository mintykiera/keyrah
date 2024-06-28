const chalk = require('chalk');

module.exports = {
  name: 'connecting',
  async execute() {
    console.log(chalk.yellow('[Database Status]: Connecting...'));
  },
};
