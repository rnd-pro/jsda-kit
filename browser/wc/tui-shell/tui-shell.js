import Symbiote from '@symbiotejs/symbiote';
import template from './template.js'

export class TuiShell extends Symbiote {

  renderShadow = true;
  
}

TuiShell.template = template;
TuiShell.reg('tui-shell');

export default TuiShell;