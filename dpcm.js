function toDPCM(buff, NTSC, period) {
    var NTSCPeriods = [428, 380, 340, 320, 286, 254, 226, 214, 190, 160, 142, 128, 106,  84,  72,  54];
    var PALPeriods = [398, 354, 316, 298, 276, 236, 210, 198, 176, 148, 132, 118,  98,  78,  66,  50];

    var sampleTime = NTSC ? 1/(1789773 / (NTSCPeriods[period])) : 1/(1662607  / (PALPeriods[period]));

    var dCounter = 64;

    var dmcData = [0];
    var deltaT = 0;
    var bit = 0;
    var byte = 0;
    
    for(x = 0; x < buff.length; x++) {
        deltaT += 1 / aCtx.sampleRate;

        while(deltaT >= sampleTime) {
            deltaT -= sampleTime;
            if(buff[x] > ((dCounter / 64) - 1)) {
                dmcData[byte] |= (1 << bit);
                dCounter += 2;
            }
            else dCounter -= 2;

            bit++;
            if(bit > 7) {
                bit = 0;
                byte++;
                dmcData.push(0);
            }
        }
    }

    return {
        data: dmcData,
        sampleTime: sampleTime
    };
}

function toAudio(dpcm) {
    var deltaT = 0;
    var dCounter = 0;
    var bit = 0;
    var byte = 0;

    var soundData = [];

    for(x = 0; x < dpcm.data.length * 8; x++) {
        deltaT += dpcm.sampleTime;
        if(dpcm.data[byte] & (1 << bit)) dCounter += (2/64);
        else dCounter -= (2/64);

        if(dCounter < -1) dCounter = -1;
        if(dCounter > 1) dCounter = 1;

        while(deltaT > 1/aCtx.sampleRate) {
            deltaT -= 1/aCtx.sampleRate;
            soundData.push(dCounter);
        }

        bit++;
        if(bit > 7) {
            bit = 0;
            byte++;
        }
    }

    var decodedBuffer = aCtx.createBuffer(1,soundData.length, aCtx.sampleRate);
    var decodedBufferData = decodedBuffer.getChannelData(0);
    
    for(x = 0; x < decodedBufferData.length; x++) {
        decodedBufferData[x] = soundData[x];
    }

    return decodedBuffer;
}