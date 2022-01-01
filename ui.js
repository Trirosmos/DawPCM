function deleteOptions(element) {
    var options = element.options;
    var amount = options.length;
    for(x = 0; x < amount; x++) {
        options.remove(options[x]);
    }
}

function createOption(select,text) {
    if(Array.isArray(text)) {
        for(x in text) {
            var opt = createE('option');
            opt.value = String(text[x]);
            opt.innerHTML = String(text[x]);
            select.appendChild(opt);       
        }
    }
    else {
        var opt = createE('option');
        opt.value = String(text);
        opt.innerHTML = String(text);
        select.appendChild(opt);
    }
}

function updateChainListDisplay() {
    deleteOptions(chainListDisplay);
    deleteOptions(fxListDisplay);

    for(x = 0; x < chains.length; x++) {
        createOption(chainListDisplay,chains[x].name);
    }

    if(chains[currentChain] !== undefined) {
        var curr = chains[currentChain].effects;
        for(x = 0; x < curr.length; x++) {
            createOption(fxListDisplay,curr[x].name);
        }
    }

    chainListDisplay.selectedIndex = currentChain;
    chainListDisplay.size = chains.length + 2;
}

function updateFXListDisplay() {
    deleteOptions(fxListDisplay);

    if(chains[currentChain] !== undefined) {
        var curr = chains[currentChain].effects;
        for(x = 0; x < curr.length; x++) {
            createOption(fxListDisplay,curr[x].name);
        }
    }

    fxListDisplay.selectedIndex = currentFX;
    fxListDisplay.size = chains[currentChain].effects.length + 2;
}

function displayGain() {
    var effect = getCurrentFX();
    if(effect === undefined) return;

    var gain = createE("input");
    gain.type = "range";
    gain.min = "-60";
    gain.max = "60";
    gain.value = String(effect.value);
    sizePos(gain,15,24,60,40);

    var gainValueText = createE("p");
    gainValueText.innerHTML = String(effect.value) + " dB";
    sizePos(gainValueText,80,35,20,40);

    gain.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;

        if(effect.type === "gain") {
            effect.value = Number(gain.value);
            gainValueText.innerHTML = String(effect.value) + " dB";
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    var gainText = createE("p");
    gainText.innerHTML = "Gain: ";
    sizePos(gainText,5,35,20,40);

    fxSettingsDisplay.appendChild(gain);
    fxSettingsDisplay.appendChild(gainText);
    fxSettingsDisplay.appendChild(gainValueText);
}

function displayIIR() {
    var effect = getCurrentFX();
    if(effect === undefined) return;

    var cutoff = createE("input");
    var cutoffNumber = createE("input");

    cutoff.type = "range";
    cutoff.min = "1";
    cutoff.max = "24000";
    cutoff.value = String(effect.cutoff);
    sizePos(cutoff,35,5,27,40);
    cutoff.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;

        if(effect.type === "iir") {
            effect.cutoff = Number(cutoff.value);
            cutoffNumber.value = Number(cutoff.value);
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    cutoffNumber.type = "number";
    cutoffNumber.min = "0";
    cutoffNumber.max = "24000";
    cutoffNumber.value = String(effect.cutoff);
    sizePos(cutoffNumber,70,20,20,10);
    cutoffNumber.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
    
        if(effect.type === "iir") {
            effect.cutoff = Number(cutoffNumber.value);
            cutoff.value = Number(cutoffNumber.value);
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    var cutoffText = createE("p");
    cutoffText.innerHTML = "Cutoff frequency (Hz): ";
    sizePos(cutoffText,3,18,30,10);

    var lowpassyes = createE("input");
    var lowpassno = createE("input");

    sizePos(lowpassyes,15,50,7,7);
    lowpassyes.type = "radio";
    lowpassyes.checked = effect.lowpass;
    lowpassyes.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;

        if(lowpassyes.checked) {
            lowpassno.checked = false;
            if(effect.type === "iir") effect.lowpass = true;
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    sizePos(lowpassno,35,50,7,7);
    lowpassno.type = "radio";
    lowpassno.checked = !effect.lowpass;
    lowpassno.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;

        if(lowpassno.checked) {        
            lowpassyes.checked = false;
            if(effect.type === "iir") effect.lowpass = false;
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    var lowpassText = createE("p");
    lowpassText.innerHTML = "Low-pass: ";
    sizePos(lowpassText,3,45,15,15);

    var highpassText = createE("p");
    highpassText.innerHTML = "High-pass: ";
    sizePos(highpassText,22,45,15,15);

    var orderText = createE("p");
    orderText.innerHTML = "Order: ";
    sizePos(orderText,3,70,10,10);

    var orderSelect = createE("select");
    sizePos(orderSelect,15,74,10,10);

    createOption(orderSelect, [
        "1",
        "2",
        "3",
        "4",
        "5"
    ]);

    orderSelect.onchange = function() {
        if(orderSelect.selectedIndex !== -1) {
            effect.order = orderSelect.selectedIndex + 1;
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    

    fxSettingsDisplay.appendChild(cutoff);
    fxSettingsDisplay.appendChild(cutoffNumber);
    fxSettingsDisplay.appendChild(cutoffText);
    fxSettingsDisplay.appendChild(lowpassyes);
    fxSettingsDisplay.appendChild(lowpassno);
    fxSettingsDisplay.appendChild(lowpassText);
    fxSettingsDisplay.appendChild(highpassText);
    fxSettingsDisplay.appendChild(orderText);
    fxSettingsDisplay.appendChild(orderSelect);
}

function displayWaveshape() {
    var effect = getCurrentFX();
    if(effect === undefined) return;
    
    var hardness = createE("input");
    hardness.type = "range";
    hardness.min = "0";
    hardness.max = "100";
    hardness.value = String(Math.round(effect.hardness * 100));
    sizePos(hardness,20,24,50,40);
    
    var hardnessValueText = createE("p");
    hardnessValueText.innerHTML = String(effect.hardness);
    sizePos(hardnessValueText,80,35,20,40);
    
    hardness.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
    
        if(effect.type === "waveshape") {
            effect.hardness = Number(hardness.value) / 100;
            hardnessValueText.innerHTML = String(effect.hardness);
            play(!autoPlay);
            updateUndoBuffer();
        }
    }
    
    var hardnessText = createE("p");
    hardnessText.innerHTML = "Hardness: ";
    sizePos(hardnessText,5,35,20,40);

    var algoSelect = createE("select");
    sizePos(algoSelect,15,58,20,10);
    algoSelect.onchange = function() {
        if(algoSelect.selectedIndex !== -1 && algoSelect.selectedIndex < 2) {
            var effect = getCurrentFX();
            if(effect === undefined) return;
            
            effect.algo = algoSelect.selectedIndex;
            play(!autoPlay);
            updateUndoBuffer();
        } 
    }

    var tanh = createE("option");
    tanh.innerHTML = "tanh(x)";
    algoSelect.appendChild(tanh);

    var x2 = createE("option");
    x2.innerHTML = "tanh(x)²";
    algoSelect.appendChild(x2);

    var algoText = createE("p");
    algoText.innerHTML = "Type: ";
    sizePos(algoText,5,55,20,40);

    
    fxSettingsDisplay.appendChild(hardness);
    fxSettingsDisplay.appendChild(hardnessText);
    fxSettingsDisplay.appendChild(hardnessValueText);
    fxSettingsDisplay.appendChild(algoSelect);
    fxSettingsDisplay.appendChild(algoText);
}

function displayLimiter() {
    var effect = getCurrentFX();
    if(effect === undefined) return;
    
    var threshold = createE("input");
    threshold.type = "range";
    threshold.min = "-100";
    threshold.max = "0";
    threshold.value = String(effect.threshold);
    sizePos(threshold,25,24,40,40);
    
    var thresholdInput = createE("input");
    thresholdInput.type = "number";
    thresholdInput.value = (effect.threshold);
    thresholdInput.min = -100;
    thresholdInput.max = 0;
    sizePos(thresholdInput,70,39,15,10);
    
    threshold.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
    
        if(effect.type === "limiter") {
            effect.threshold = Number(threshold.value);
            thresholdInput.value = effect.threshold;
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    thresholdInput.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;

        if(effect.type === "limiter") {
            effect.threshold = Number(thresholdInput.value);
            threshold.value = effect.threshold;
            play(!autoPlay);
            updateUndoBuffer();
        }
    }
    
    var thresholdText = createE("p");
    thresholdText.innerHTML = "Threshold (dB): ";
    sizePos(thresholdText,5,35,20,40);
    
    fxSettingsDisplay.appendChild(threshold);
    fxSettingsDisplay.appendChild(thresholdText);
    fxSettingsDisplay.appendChild(thresholdInput);
}

function displayCompressor() {
    var effect = getCurrentFX();
    if(effect === undefined) return;

    var thresholdText = createE("p");
    thresholdText.innerHTML = "Threshold: ";
    sizePos(thresholdText,5,5,20,40);

    var thresholdValueText = createE("p");
    thresholdValueText.innerHTML = String(effect.threshold) + " dB";
    sizePos(thresholdValueText,74,5,20,40);

    var threshold = createE("input");
    threshold.type = "range";
    threshold.min = "-100";
    threshold.max = "0";
    threshold.value = String(effect.threshold);
    sizePos(threshold,25,0,45,25);
    threshold.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;

        if(effect.type === "comp") {
            effect.threshold = Number(threshold.value);
            thresholdValueText.innerHTML = effect.threshold + " dB";
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    var attack = createE("input");
    attack.type = "range";
    attack.min = "1";
    attack.max = "100";
    attack.value = String(effect.attack);
    sizePos(attack,25,20,45,15);
    attack.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
    
        if(effect.type === "comp") {
            effect.attack = Number(attack.value);
            attackValueText.innerHTML = effect.attack + " ms";
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    var attackText = createE("p");
    attackText.innerHTML = "Attack: ";
    sizePos(attackText,5,20,20,40);

    var attackValueText = createE("p");
    attackValueText.innerHTML = String(effect.attack) + " ms";
    sizePos(attackValueText,74,20,20,40);

    var sustain = createE("input");
    sustain.type = "range";
    sustain.min = "1";
    sustain.max = "100";
    sustain.value = String(effect.sustain);
    sizePos(sustain,25,35,45,15);
    sustain.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
    
        if(effect.type === "comp") {
            effect.sustain = Number(sustain.value);
            sustainValueText.innerHTML = effect.sustain + " ms";
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    var sustainText = createE("p");
    sustainText.innerHTML = "Sustain: ";
    sizePos(sustainText,5,35,20,40);

    var sustainValueText = createE("p");
    sustainValueText.innerHTML = String(effect.sustain) + " ms";
    sizePos(sustainValueText,74,35,20,40);

    var release = createE("input");
    release.type = "range";
    release.min = "1";
    release.max = "100";
    release.value = String(effect.release);
    sizePos(release,25,50,45,15);
    release.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
    
        if(effect.type === "comp") {
            effect.release = Number(release.value);
            releaseValueText.innerHTML = effect.release + " ms";
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    var releaseText = createE("p");
    releaseText.innerHTML = "Release: ";
    sizePos(releaseText,5,50,20,40);

    var releaseValueText = createE("p");
    releaseValueText.innerHTML = String(effect.release) + " ms";
    sizePos(releaseValueText,74,50,20,40);

    var ratio = createE("input");
    ratio.type = "range";
    ratio.min = "1";
    ratio.max = "10";
    ratio.value = String(effect.ratio);
    sizePos(ratio,25,65,45,15);
    ratio.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
    
        if(effect.type === "comp") {
            effect.ratio = Number(ratio.value);
            ratioValueText.innerHTML = effect.ratio + ":1";
            play(!autoPlay);
            updateUndoBuffer();
        }
    }
    

    var ratioText = createE("p");
    ratioText.innerHTML = "Ratio: ";
    sizePos(ratioText,5,65,20,40);

    var ratioValueText = createE("p");
    ratioValueText.innerHTML = String(effect.ratio) + ":1";
    sizePos(ratioValueText,74,65,20,40);

    var gain = createE("input");
    gain.type = "range";
    gain.min = "-15";
    gain.max = "15";
    gain.value = String(effect.gain);
    sizePos(gain,25,80,45,15);
    gain.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
    
        if(effect.type === "comp") {
            effect.gain = Number(gain.value);
            gainValueText.innerHTML = effect.gain + " dB";
            play(!autoPlay);
            updateUndoBuffer();
        }
    }
    

    var gainText = createE("p");
    gainText.innerHTML = "Make-up gain: ";
    sizePos(gainText,5,80,20,40);

    var gainValueText = createE("p");
    gainValueText.innerHTML = String(effect.gain) + " dB";
    sizePos(gainValueText,74,80,20,40);

    fxSettingsDisplay.appendChild(thresholdText);
    fxSettingsDisplay.appendChild(threshold);
    fxSettingsDisplay.appendChild(attack);
    fxSettingsDisplay.appendChild(sustain);
    fxSettingsDisplay.appendChild(release);
    fxSettingsDisplay.appendChild(ratio);
    fxSettingsDisplay.appendChild(gain);
    fxSettingsDisplay.appendChild(thresholdValueText);
    fxSettingsDisplay.appendChild(attackText);
    fxSettingsDisplay.appendChild(sustainText);
    fxSettingsDisplay.appendChild(releaseText);
    fxSettingsDisplay.appendChild(ratioText);
    fxSettingsDisplay.appendChild(gainText);
    fxSettingsDisplay.appendChild(attackValueText);
    fxSettingsDisplay.appendChild(sustainValueText);
    fxSettingsDisplay.appendChild(releaseValueText);
    fxSettingsDisplay.appendChild(ratioValueText);
    fxSettingsDisplay.appendChild(gainValueText);
}

function displayRepitcher() {
    var effect = getCurrentFX();
    if(effect === undefined) return;
    
    var speed = createE("input");
    speed.type = "range";
    speed.min = "1";
    speed.max = "200";
    speed.value = String(effect.speed * 100);
    sizePos(speed,15,24,60,40);
    
    var speedValueText = createE("p");
    speedValueText.innerHTML = String(effect.speed);
    sizePos(speedValueText,80,35,20,40);
    
    speed.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
    
        if(effect.type === "repitch") {
            effect.speed = Number(speed.value / 100);
            speedValueText.innerHTML = String(effect.speed);
            play(!autoPlay);
            updateUndoBuffer();
        }
    }
    
    var speedText = createE("p");
    speedText.innerHTML = "Speed: ";
    sizePos(speedText,5,35,20,40);

    var semitones = createE("input");
    var semitonesValueText = createE("p");
    semitones.type = "Range";
    semitones.min = "-24";
    semitones.max = "24";
    semitones.value = "0";
    sizePos(semitones,15,39,60,40);
    semitones.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
        
        if(effect.type === "repitch") {
            var ratio = Math.pow(2,1/12);
            effect.speed = ratio**Number(semitones.value);
            speed.value = Math.round(effect.speed * 100);
            semitonesValueText.innerHTML = semitones.value + " semitones";
            speedValueText.innerHTML = Number(speed.value) / 100;
            play(!autoPlay);
            updateUndoBuffer();
        }
    }

    semitonesValueText.innerHTML = "0 semitones";
    sizePos(semitonesValueText,80,50,20,10);
    
    fxSettingsDisplay.appendChild(speed);
    fxSettingsDisplay.appendChild(speedText);
    fxSettingsDisplay.appendChild(speedValueText);
    fxSettingsDisplay.appendChild(semitones);
    fxSettingsDisplay.appendChild(semitonesValueText);
}

function updateFXSettings() {
    fxSettingsDisplay.textContent = "";
    
    var effect = getCurrentFX();
    if(effect === undefined) return;

    switch(effect.type) {
        case "gain": 
            displayGain();
        break;

        case "iir": 
            displayIIR();
        break;

        case "waveshape": 
            displayWaveshape();
        break;

        case "limiter": 
            displayLimiter();
        break;

        case "comp": 
            displayCompressor();
        break;

        case "repitch": 
            displayRepitcher();
        break;
    }

}

function updateWaveCanvas() {
    waveCanvas.clearRect(0,0,waveCanvas.canvas.width,waveCanvas.canvas.height);
    if(modifiedBuffer === undefined) return;

    var left = Math.min(selection.start,selection.end);
    var right = Math.max(selection.start,selection.end);

    var audioData = modifiedBuffer.getChannelData(0);
    var halfH = waveCanvas.canvas.height / 2;
    waveCanvas.canvas.width = audioData.length;

    waveCanvas.cursorPos.innerHTML = "Cursor: " + cursor + "/" + audioData.length;

    if(selection.selected) waveCanvas.selectionPos.innerHTML = "Selection:" + left + "-" + right;
    else waveCanvas.selectionPos.innerHTML = "";

    waveCanvas.save();
    waveCanvas.translate(0,halfH);
    waveCanvas.beginPath();

    for(let x = 0; x < audioData.length; x++) {
        waveCanvas.lineTo(x,(-audioData[x] * halfH));
    }

    waveCanvas.stroke();
    waveCanvas.restore();

    /*waveCanvas.save();
    waveCanvas.translate(0,halfH);
    waveCanvas.beginPath();
    waveCanvas.strokeStyle = "red";

    console.log(audioData.length,peakDetect.length);
    
    for(let x = 0; x < peakDetect.length; x++) {
        waveCanvas.lineTo(x,(-peakDetect[x] * halfH));
    }
    
    waveCanvas.stroke();
    waveCanvas.restore();*/

    waveCanvas.save();
    waveCanvas.fillStyle = "blue";
    waveCanvas.globalAlpha = 0.4;
    waveCanvas.fillRect(cursor,0,4,waveCanvas.canvas.height);
    waveCanvas.restore();

    if(selection.selected) {
        waveCanvas.save();
        waveCanvas.globalAlpha = 0.4;

        waveCanvas.fillStyle = "red";

        waveCanvas.fillRect(left,0,right - left,waveCanvas.canvas.height);
        waveCanvas.restore();
    }
}

function updateUI() {
    updateChainListDisplay();
    updateFXListDisplay();
    updateFXSettings();
    updateWaveCanvas();
}