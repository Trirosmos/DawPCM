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