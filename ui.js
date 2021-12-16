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
    cutoff.min = "0";
    cutoff.max = "24000";
    cutoff.value = String(effect.cutoff);
    sizePos(cutoff,35,5,27,40);
    cutoff.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;

        if(effect.type === "iir") {
            effect.cutoff = Number(cutoff.value);
            cutoffNumber.value = Number(cutoff.value);
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
        }
    }

    var lowpassText = createE("p");
    lowpassText.innerHTML = "Low-pass: ";
    sizePos(lowpassText,3,45,15,15);

    var highpassText = createE("p");
    highpassText.innerHTML = "High-pass: ";
    sizePos(highpassText,22,45,15,15);

    

    fxSettingsDisplay.appendChild(cutoff);
    fxSettingsDisplay.appendChild(cutoffNumber);
    fxSettingsDisplay.appendChild(cutoffText);
    fxSettingsDisplay.appendChild(lowpassyes);
    fxSettingsDisplay.appendChild(lowpassno);
    fxSettingsDisplay.appendChild(lowpassText);
    fxSettingsDisplay.appendChild(highpassText);
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
    sizePos(threshold,25,24,45,40);
    
    var thresholdValueText = createE("p");
    thresholdValueText.innerHTML = String(effect.threshold) + " dB";
    sizePos(thresholdValueText,80,35,20,40);
    
    threshold.onchange = function() {
        var effect = getCurrentFX();
        if(effect === undefined) return;
    
        if(effect.type === "limiter") {
            effect.threshold = Number(threshold.value);
            thresholdValueText.innerHTML = String(effect.threshold) + " dB";
        }
    }
    
    var thresholdText = createE("p");
    thresholdText.innerHTML = "Threshold: ";
    sizePos(thresholdText,5,35,20,40);
    
    fxSettingsDisplay.appendChild(threshold);
    fxSettingsDisplay.appendChild(thresholdText);
    fxSettingsDisplay.appendChild(thresholdValueText);
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
        waveCanvas.lineTo(x,(audioData[x] * halfH));
    }

    waveCanvas.stroke();
    waveCanvas.restore();

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