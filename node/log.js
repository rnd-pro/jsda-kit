import CFG from '../cfg/CFG.js';
import chalk from 'chalk';

export class Log {

  /**
   * @param {[String, ...any]} args
   */
  static msg(...args) {
    if (CFG.logging) {
      console.log(chalk.blue(args[0]), chalk.white(...args.slice(1)));
    }
  }

  /**
   * @param {[String, ...any]} args
   */
  static err(...args) {
    if (CFG.logging) {
      console.log(chalk.red(args[0]), ...args.slice(1));
    }
  }

  /**
   * @param {[String, ...any]} args
   */
  static warn(...args) {
    if (CFG.logging) {
      console.log(chalk.yellow(args[0]), ...args.slice(1));
    }
  }

}
