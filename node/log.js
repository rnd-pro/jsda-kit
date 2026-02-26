import CFG from '../cfg/CFG.js';
import chalk from 'chalk';

export class Log {

  static lastMsg = '';

  /**
   * 
   * @param {String} msg 
   * @returns 
   */
  static deDup(msg) {
    if (!CFG.log || Log.lastMsg === msg) return;
    Log.lastMsg = msg;
    console.log(msg);
  }

  /**
   * @param {[String, ...any]} args
   */
  static info(...args) {
    this.deDup(chalk.white.bgBlue('> ' + args[0]) + chalk.white(...args.slice(1)));
  }

  /**
   * @param {[String, ...any]} args
   */
  static err(...args) {
    this.deDup(chalk.white.bgRed.bold('❌ ' + args[0]) + chalk.white(...args.slice(1)));
  }

  /**
   * @param {[String, ...any]} args
   */
  static warn(...args) {
    this.deDup(chalk.black.bgYellow('⚠️ ' + args[0]) + chalk.white(...args.slice(1)));
  }

  /**
   * @param {[String, ...any]} args
   */
  static success(...args) {
    this.deDup(chalk.black.bgGreen('> ' + args[0]) + chalk.white(...args.slice(1)));
  }

}
