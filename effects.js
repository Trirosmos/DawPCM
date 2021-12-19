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

function repitch(buff,speed) {
    var position = 0;
    var roundedPosition = 0;
    var data = [];

    while(roundedPosition < buff.length) {
        data.push(buff[roundedPosition]);

        position += speed;
        roundedPosition = Math.round(position);
    }

    var result = aCtx.createBuffer(1,data.length, aCtx.sampleRate);
    var resultData = result.getChannelData(0);

    for(let x = 0; x < data.length; x++) {
        resultData[x] = data[x];
    }
    
    return result;
}

function comp(buff,threshold, attack, sustain, release, ratio, gain) {
    var result = aCtx.createBuffer(1,buff.length, aCtx.sampleRate);
    var resultData = result.getChannelData(0);

    threshold = 10**(threshold/20);
    gain = 10**(gain/20);

    var sustainCounter = 0;
    var sustainOn = false;
    var sustainInSamples = (sustain * 10**-3)/(1/aCtx.sampleRate);
    var attackInSamples = (attack * 10**-3)/(1/aCtx.sampleRate);
    var releaseInSamples = (release * 10**-3)/(1/aCtx.sampleRate);

    var peakDetector = [0];

    for(let x = 0; x < buff.length; x++) {
        var abs = Math.abs(buff[x]);
        var last = x === 0 ? 0 : peakDetector[x - 1];

        peakDetector[x] = last;

        if(abs > last) peakDetector[x] += Math.abs(abs - last) * (1/attackInSamples) * gain;

        if(sustainOn) {
            if(sustainCounter > sustainInSamples) {
                sustainCounter = 0;
                sustainOn = false;
            }
            else sustainCounter ++;
        }

        if(!sustainOn) {
            if(peakDetector[x] >= 0) peakDetector[x] -= peakDetector[x] * (1/releaseInSamples);
            if(peakDetector[x] > last) {
                sustainOn = true;
                sustainCounter = 0;
            }
        }
    }

    //peakDetect = peakDetector;

    var ampValue = [];

    for(let x = 0; x < peakDetector.length; x++) {
        var dif = 20 * Math.log(peakDetector[x]/threshold);
        var desiredLevel = dif/ratio;
        var gainReduction = dif - desiredLevel;
        var gainPercentage = 10**(-gainReduction/20);

        //ampValue[x] = gainPercentage > 1 ? 1 : gainPercentage;
        ampValue[x] = desiredLevel > 0 ? gainPercentage : 1;
    }

    //peakDetect = ampValue;

    for(let x = 0; x < ampValue.length; x++) {
        resultData[x] = buff[x] * (gain * ampValue[x]);
    }
    


    return result;
}