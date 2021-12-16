function bufferToBase64(buf) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}

function getCurrentFX() {
    if(chains[currentChain] === undefined) return undefined;
    if(chains[currentChain].effects[currentFX] === undefined) return undefined;
    return chains[currentChain].effects[currentFX];
}

function sizePos(element, x, y, width, height) {
    element.style.position = "absolute";
    element.style.height = height + "%";
    element.style.width = width + "%";
    element.style.top = y + "%";
    element.style.left = x + "%";
}

function loadAudio(e) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = function(e) {
        aCtx.decodeAudioData(reader.result,function(e){
            buffer = e;
        });
    }
}

function downloadBin(buff,name) {
    download("data:application/octet-stream;base64," + bufferToBase64(new Uint8Array(buff)),name,"application/octet-stream");
}

var getI = function(e){return document.getElementById(e)};

var createE = function(e){
    var el = document.createElement(e);
    el.style.overflow = "hidden";
    return el;
}
var append = function(e){return document.body.appendChild(e);}

function spliceFloat(buff,start,remove,add) {
    var audio  = [];
    
    for(let x = 0; x < buff.getChannelData(0).length; x++) {
        audio[x] = buff.getChannelData(0)[x];
    }

    var args = [];
    args.push(start,remove)
    args = args.concat(add);
    
    audio.splice.apply(audio,args);
    
    var newBuff = aCtx.createBuffer(1,audio.length,aCtx.sampleRate);
    
    for(let x = 0; x < buffer.getChannelData(0).length; x++) {
        newBuff.getChannelData(0)[x] = audio[x];
    }
    return newBuff;
}