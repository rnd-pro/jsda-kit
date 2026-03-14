import { styleText } from 'node:util';
import CFG from '../cfg/CFG.js';

export class Log {

  static lastMsg = '';

  /**
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
    this.deDup(styleText(['white', 'bgBlue'], '> ' + args[0]) + ' ' + args.slice(1).join(' '));
  }

  /**
   * @param {[String, ...any]} args
   */
  static err(...args) {
    this.deDup(styleText(['white', 'bgRed', 'bold'], '❌ ' + args[0]) + ' ' + args.slice(1).join(' '));
  }

  /**
   * @param {[String, ...any]} args
   */
  static warn(...args) {
    this.deDup(styleText(['black', 'bgYellow'], '⚠️ ' + args[0]) + ' ' + args.slice(1).join(' '));
  }

  /**
   * @param {[String, ...any]} args
   */
  static success(...args) {
    this.deDup(styleText(['black', 'bgGreen'], '> ' + args[0]) + ' ' + args.slice(1).join(' '));
  }

}
