var messages = [];

class fmSynth extends AudioWorkletProcessor {
    constructor() {
      super();
  
      this.port.onmessage = function(e) {
          messages.push(e.data);
      }
    }
  
    process(inputs, outputs, parameters) {
      var chan0 = outputs[0][0];
  
      for(let x = 0; x < chan0.length; x++) {
      }
  
      return true;
    }
  }
  
  registerProcessor('fmSynth', fmSynth);
  