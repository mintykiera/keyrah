const chalk = require('chalk');

module.exports = {
  name: 'err',
  execute(err) {
    console.log(chalk.red(`Whoops! Something went wrong:\n${err}`));
  },
};
