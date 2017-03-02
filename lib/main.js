const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const masterGainNode = audioCtx.createGain();
let attack = 0;
let decay = 1000;
let sustain = 0.2;



let octave = 1

const tuna = new Tuna(audioCtx);
let delay = new tuna.Delay({
      feedback: 0.2,
      delayTime: 200, //this will create a short "slap back" delay
      wetLevel: 0.7,
      dryLevel: 1,
      cutoff: 5000,
      bypass: true
});

let phaser = new tuna.Phaser({
    rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
    depth: 0.7,                    //0 to 1
    feedback: 0.5,                 //0 to 1+
    stereoPhase: 30,               //0 to 180
    baseModulationFrequency: 700,  //500 to 1500
    bypass: 0
});

let overdrive = new tuna.Overdrive({
    outputGain: 0.0,         //0 to 1+
    drive: 0.0,              //0 to 1
    curveAmount: 1,          //0 to 1
    algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
    bypass: 1
});

let convolver = new tuna.Convolver({
    highCut: 22050,                         //20 to 22050
    lowCut: 20,                             //20 to 22050
    dryLevel: 1,                            //0 to 1+
    wetLevel: 1,                            //0 to 1+
    level: 1,                               //0 to 1+, adjusts total output of both wet and dry
    impulse: "impulses/RedBridge.wav",    //the path to your impulse response
    bypass: 0
})








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


// handles changes in by user

function octaveUp() {
  octave = octave + 1
  setup();
}

function octaveDown() {
  octave = octave - 1
  setup();
}

function changeGain() {
  target = document.getElementById('gain-setting');
  masterGainNode.gain.value = target.value
}

function changeDelayTime(e) {
  debugger
  newDelayTime = document.getElementById('delay-slider').value
  newDelayNumber = parseFloat(newDelayTime.match(/[\d\.]+/))
  delay.delayTime.value = newDelayNumber;
}

function changeDelayDry(e) {
  debugger
  newDry = document.getElementById('delay-dry-slider').value
  newDryNumber = parseFloat(newDry.match(/[\d\.]+/))
  delay.dry.gain.value = newDryNumber;
}

function changeDelayWet(e) {
  newWet = document.getElementById('delay-wet-slider').value
  newWetNumber = parseFloat(newWet.match(/[\d\.]+/))
  delay.wet.gain.value = newWetNumber;
}

function bypassDelay() {
  debugger
  newStatus = document.getElementById('delay-toggle').checked
  if (newStatus) {
    delay.bypass = false;
  }
  else {
    delay.bypass = true
  }
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

function bypassPhaser() {
  let newStatus = document.getElementById('phaser-toggle').checked
  if (newStatus) {
    phaser.bypass = false
  }
  else {
    phaser.bypass = true;
  }
}

function changeWaveForm(e) {
  target = document.getElementById("wave-select")
  type = target.value
  setup();
}

function changeOverDriveDrive() {
  let newDrive = document.getElementById('overdrive-drive-slider').value;
  let newDriveNumber = parseFloat(newDrive.match(/[\d\.]+/));
  debugger
  overdrive.drive.value = newDriveNumber;
}

function changeOverDriveGain() {
  let newGain = document.getElementById('overdrive-output-slider').value;
  let newGainNumber = parseFloat(newGain.match(/[\d\.]+/));
  debugger
  overdrive.output.gain.value = newGainNumber;
}

function changeOverDriveType() {
  let newType = document.getElementById('drive-type').value;
  let newTypeNumber = parseInt(newType)
  overdrive.algorithmIndex = newTypeNumber;
}

function bypassOverDrive() {
  let newStatus = document.getElementById('overdrive-toggle').checked
  debugger
  if (newStatus) {
    overdrive.bypass = 0
  }
  else {
    overdrive.bypass = 1;
  }
}

function changeAttack() {
  newAttack = document.getElementById('attack-slider').value
  newAttackNumber = parseInt(newAttack);
  attack = newAttack;
}

function changeDecay() {
  newDecay = document.getElementById('decay-slider').value
  newDecayNumber = parseInt(newDecay);
  decay = newDecay;
}

function changeSustain() {
  newSustain = document.getElementById('sustain-slider').value
  let newSustainNumber = parseFloat(newSustain.match(/[\d\.]+/));
  sustain = newSustainNumber
}


function createNoteTable(octave) {
  let noteFreq = [{}];
  let multiplier = octave
  if (octave !== 1) {
    multiplier = octave
  }
  if (multiplier === 0 || multiplier === undefined) {
    multiplier = 1
  }
  noteFreq[0]["C"] = 130.81 * multiplier;
  noteFreq[0]["C#"] = 138.59 * multiplier;
  noteFreq[0]["D"] = 146.83 * multiplier;
  noteFreq[0]["D#"] = 155.56 * multiplier;
  noteFreq[0]["E"] = 164.81 * multiplier;
  noteFreq[0]["F"] = 174.61 * multiplier;
  noteFreq[0]["F#"] = 185.00 * multiplier;
  noteFreq[0]["G"] = 196.00 * multiplier;
  noteFreq[0]["G#"] = 207.65 * multiplier;
  noteFreq[0]["A"] = 220.00 * multiplier;
  noteFreq[0]["A#"] = 233.08 * multiplier;
  noteFreq[0]["B"] = 246.94 * multiplier;
  return noteFreq;
}

function setup() {
  let noteFreq = createNoteTable(octave);
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
  let envelope = audioCtx.createGain();
  let initialValue = envelope.gain.setValueAtTime(0, audioCtx.currentTime);
  envelope.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attack / 1000);
  envelope.gain.linearRampToValueAtTime(sustain, audioCtx.currentTime + decay / 1000)
  debugger

  osc.connect(envelope);
  envelope.connect(masterGainNode);
  masterGainNode.connect(delay);
  delay.connect(phaser);
  phaser.connect(overdrive);
  overdrive.connect(convolver);
  convolver.connect(analyser)

  analyser.connect(audioCtx.destination)

  osc.type = type;
  let number = parseFloat(freq.match(/[\d\.]+/))
  osc.frequency.value = number;
  osc.start();
  return osc
}

window.setup = setup;
