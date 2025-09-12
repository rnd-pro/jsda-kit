import Symbiote  from '@symbiotejs/symbiote';

class InnerWC extends Symbiote {
  
  ssrMode = true;

  init$ = {
    btnTxt: 'Click me',
    onBtnClick: () => {
      this.notify('btnTxt');
      alert('Button clicked');
    }
  }
}

InnerWC.reg('inner-wc');

export default InnerWC;