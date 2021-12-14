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

var getI = document.getElementById;

var createE = function(e){
    var el = document.createElement(e);
    el.style.overflow = "hidden";
    return el;
}
var append = function(e){return document.body.appendChild(e);}