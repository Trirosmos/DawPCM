function iir(buff,cutoff,lowpass) {
    //https://en.wikipedia.org/wiki/High-pass_filter#Discrete-time_realization
    //https://en.wikipedia.org/wiki/Low-pass_filter#Discrete-time_realization
    var rc = 1/(2 * Math.PI * cutoff);
    var sampleTime = 1/aCtx.sampleRate;
    var alpha = lowpass ? sampleTime/(sampleTime + rc) : rc/(sampleTime + rc);

    var result = aCtx.createBuffer(1,buff.length, aCtx.sampleRate);
    var resultData = result.getChannelData(0);
    var lastOut = 0;

    for(x = 0; x < resultData.length; x++) {
        if(lowpass) resultData[x] = lastOut + alpha * (buff[x] - lastOut);
        else {
            var lastIn = x === 0 ? 0 : buff[x - 1];
            resultData[x] = lastOut * alpha + (buff[x] - lastIn) * alpha
        }

        lastOut = resultData[x];
    }

    return result;
}

function waveDist(buff,hardness,algo) {        
    var result = aCtx.createBuffer(1,buff.length, aCtx.sampleRate);
    var resultData = result.getChannelData(0);

    if(hardness > 1) hardness = 1;
    if(hardness < 0) hardness = 0; 

    for(x = 0; x < resultData.length; x++) {        
        if(algo == 0) resultData[x] = Math.tanh(buff[x] * hardness * 20);
        else resultData[x] = (Math.tanh(buff[x] * hardness * 20)**2) - 0.5;
    }

    return result;
}

function hardLim(buff, threshold) {        
    var result = aCtx.createBuffer(1,buff.length, aCtx.sampleRate);
    var resultData = result.getChannelData(0);

    if(threshold > 0) threshold = 0;

    var gain = 10**(threshold/20);

    for(x = 0; x < resultData.length; x++) {
        if(Math.abs(buff[x]) < gain) resultData[x] = buff[x];
        else {
            if(buff[x] > 0) resultData[x] = gain;
            else resultData[x] = -gain;
        }
    }

    return ampGain(resultData,-threshold);
}

function ampGain(buff,value) {
    var result = aCtx.createBuffer(1,buff.length, aCtx.sampleRate);
    var resultData = result.getChannelData(0);
    
    var gain = 10**(value/20);
    
    for(x = 0; x < resultData.length; x++) {
         resultData[x] = buff[x] * gain;
    }
    
    return result;
}

function comp(buff,threshold, attack, sustain, release, ratio, gain) {
    var result = aCtx.createBuffer(1,buff.length, aCtx.sampleRate);
    var resultData = result.getChannelData(0);

    threshold = 10**(threshold/20);

    var sustainCounter = 0;
    var sustainOn = false;
    var sustainInSamples = (sustain * 10e-3)/(1/aCtx.sampleRate);

    var triggerSignal = iir(buff,1/(attack * 10e-3),true).getChannelData(0);
    triggerSignal = iir(triggerSignal,1/(attack * 10e-3),true).getChannelData(0);
    triggerSignal = iir(triggerSignal,1/(attack * 10e-3),true).getChannelData(0);

    var accumulator = [];

    for(let x = 0; x < triggerSignal.length; x++) {
        var last = accumulator.length > 0 ? accumulator[accumulator.length - 1] : 0;
        accumulator.push(last * 0.5 + triggerSignal[x] * 0.5);

        if(Math.abs(triggerSignal[x]) > threshold) {
            if(!sustainOn) sustainOn = true;
            sustainCounter += 1/aCtx.sampleRate;
            if(sustainCounter > sustainInSamples) {
                sustainOn = false;
                sustainCounter = 0;
            }
        }
        if(!sustainOn) {
            var index = accumulator.length - 1;
            var value = accumulator[index];

            accumulator[index] -= Math.pow(0.1,1/sustainInSamples) * value;
        }
    }

    var gain = [];

    for(let x = 0; x < accumulator.length; x++) {
        if(Math.abs(accumulator[x]) > threshold) {
            var dif = 20 * Math.log(Math.abs(accumulator[x]/threshold));
            dif = dif * (1/ratio);
            gain[x] = 1 - dif;
        }
        else gain[x] = 1;
    }

    for(let x = 0; x < resultData.length; x++) {
        resultData[x] = buff[x] * gain[x];
    }


    return result;
}