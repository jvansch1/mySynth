const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const masterGainNode = audioCtx.createGain();
const filter = audioCtx.createBiquadFilter();
const tuna = new Tuna(audioCtx);
let delay = new tuna.Delay({
      feedback: 0.2,
      delayTime: 200, //this will create a short "slap back" delay
      wetLevel: 0.7,
      dryLevel: 1,
      cutoff: 5000,
      bypass: false
});

let phaser = new tuna.Phaser({
    rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
    depth: 0.7,                    //0 to 1
    feedback: 0.5,                 //0 to 1+
    stereoPhase: 30,               //0 to 180
    baseModulationFrequency: 700,  //500 to 1500
    bypass: 0
});








let analyser = audioCtx.createAnalyser();
let bufferLength = analyser.fftSize = 2048;
let dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

//draw function
let canvas;
let canvasCtx;
document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("oscilloscope");
  canvasCtx = canvas.getContext("2d");
})

function draw() {
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = v * canvas.height / 2;
    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
};


masterGainNode.gain.value = 0.25
masterGainNode.connect(audioCtx.destination);
let type = 'sine'




function changeDelayTime(e) {
  newDelayTime = document.getElementById('delay-slider').value
  newDelayNumber = parseFloat(newDelayTime.match(/[\d\.]+/))
  delay.delayTime.value = newDelayNumber;
}

function changeDelayFeedback(e) {
  newFeedbackTime = document.getElementById('delay-feedback-slider').value
  newFeedbackNumber = parseFloat(newFeedbackTime.match(/[\d\.]+/))
  delay.feedback.value = newFeedbackNumber;
}

function changePhaserDepth() {
  newPhaserDepth = document.getElementById('phaser-depth').value
  newPhaserDepth = parseFloat(newPhaserDepth.match(/[\d\.]+/))
  phaser.depth = newPhaserDepth;
}

function changePhaserFeedback() {
  newPhaserFeedback = document.getElementById('phaser-feedback').value
  newPhaserFeedback = parseFloat(newPhaserFeedback.match(/[\d\.]+/))
  phaser.depth = newPhaserFeedback;
}


function changeWaveForm(e) {
  target = document.getElementById("wave-select")
  type = target.value
  setup();
}

function changeFilterFrequency() {
  let newFilterFrequency = document.getElementById('filter-slider').value
  let newFilterNumber = parseFloat(newFilterFrequency.match(/[\d\.]+/))
  filter.frequency.value= newFilterNumber;
}

function createNoteTable() {
  let noteFreq = [{}];
  noteFreq[0]["C"] = 130.81;
  noteFreq[0]["C#"] = 138.59;
  noteFreq[0]["D"] = 146.83;
  noteFreq[0]["D#"] = 155.56;
  noteFreq[0]["E"] = 164.81;
  noteFreq[0]["F"] = 174.61;
  noteFreq[0]["F#"] = 185.00;
  noteFreq[0]["G"] = 196.00;
  noteFreq[0]["G#"] = 207.65;
  noteFreq[0]["A"] = 220.00;
  noteFreq[0]["A#"] = 233.08;
  noteFreq[0]["B"] = 246.94;
  return noteFreq;
}

function setup() {
  let noteFreq = createNoteTable();
  keyboard = document.createElement("div")
  keyboard.id = "keyboard"
  noteFreq.forEach(octave => {
    keyList = Object.keys(octave)
    keyList.forEach(note => {
      keyboard.append(createKey(note, octave[note]))
    })
  })
  document.getElementById("keyboard-container").innerHTML = keyboard.innerHTML
}

function createKey(note, freq) {
  let keyElement = document.createElement("div");
  keyElement.className = "key";
  keyElement.dataset["note"] = note;
  keyElement.dataset["frequency"] = freq;
  keyElement.innerHTML = note;
  $("#keyboard-container").on("mousedown", "div", (e) => {
    let osc = playTone(e.target.dataset.frequency);
    $("#keyboard-container").on("mouseup", "div", e => {
        osc.stop();
      })
    })

  return keyElement;
}

function playTone(freq) {


  let osc = audioCtx.createOscillator();


  osc.connect(delay);
  delay.connect(filter)
  osc.connect(masterGainNode);

  filter.connect(phaser);
  phaser.connect(analyser)
  analyser.connect(masterGainNode);

  osc.type = type;
  let number = parseFloat(freq.match(/[\d\.]+/))
  osc.frequency.value = number;
  osc.start();
  return osc
}

window.setup = setup;
