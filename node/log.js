import CFG from '../cfg/CFG.js';
import chalk from 'chalk';

export class Log {

  /**
   * @param {[String, ...any]} args
   */
  static info(...args) {
    if (CFG.log) {
      console.log(chalk.white.bgBlue('> ' + args[0]), chalk.white(...args.slice(1)));
    }
  }

  /**
   * @param {[String, ...any]} args
   */
  static err(...args) {
    if (CFG.log) {
      console.log(chalk.white.bgRed.bold('❌ ' + args[0]), ...args.slice(1));
    }
  }

  /**
   * @param {[String, ...any]} args
   */
  static warn(...args) {
    if (CFG.log) {
      console.log(chalk.black.bgYellow('⚠️ ' + args[0]), ...args.slice(1));
    }
  }

  static success(...args) {
    if (CFG.log) {
      console.log(chalk.black.bgGreen('> ' + args[0]), ...args.slice(1));
    }
  }

}
