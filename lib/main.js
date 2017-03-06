const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const masterGainNode = audioCtx.createGain();
let attack = 0;
let decay = 1000;
let sustain = 0.2;
detune = 0;
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
    depth: 0,                    //0 to 1
    feedback: 0.0,                 //0 to 1+
    stereoPhase: 30,               //0 to 180
    baseModulationFrequency: 700,  //500 to 1500
    bypass: 1
});

let overdrive = new tuna.Overdrive({
    outputGain: 0.01,         //0 to 1+
    drive: 0.01,              //0 to 1
    curveAmount: 0,          //0 to 1
    algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
    bypass: 1
});

let convolver = new tuna.Convolver({
    highCut: 22050,                         //20 to 22050
    lowCut: 20,                             //20 to 22050
    dryLevel: 1,                            //0 to 1+
    wetLevel: 1,                            //0 to 1+
    level: 1,                               //0 to 1+, adjusts total output of both wet and dry
    impulse: "impulses/BatteryBenson.wav",    //the path to your impulse response
    bypass: 1
})

var filter = new tuna.Filter({
    frequency: 440, //20 to 22050
    Q: 1, //0.001 to 100
    gain: -40, //-40 to 40 (in decibels)
    filterType: "lowpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
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
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  drawVisual = requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.0)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = 'rgb(68, 255, 0)';
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


masterGainNode.gain.value = 0.1
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
  newDelayTime = document.getElementById('delay-slider').value
  newDelayNumber = parseFloat(newDelayTime.match(/[\d\.]+/))
  delay.delayTime.value = newDelayNumber;
}

function changeDelayDry(e) {
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

function changePhaserRate() {
  newPhaserRate = document.getElementById('phaser-rate').value
  newPhaserRate = parseFloat(newPhaserRate.match(/[\d\.]+/))
  phaser.rate = newPhaserRate;
}

function changePhaserStereo() {
  newPhaserStereo = document.getElementById('phaser-stereo').value
  newPhaserStereoNumber = parseInt(newPhaserStereo)
  phaser.stereoPhase = newPhaserStereoNumber;
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
  overdrive.drive.value = newDriveNumber;
}

function changeOverDriveGain() {
  let newGain = document.getElementById('overdrive-output-slider').value;
  let newGainNumber = parseFloat(newGain.match(/[\d\.]+/));
  overdrive.outputGain.value = newGainNumber;
}

function changeOverDriveType() {
  let newType = document.getElementById('drive-type').value;
  let newTypeNumber = parseInt(newType)
  overdrive.algorithmIndex = newTypeNumber;
}

function changeOverDriveCurve() {
  let newCurve = document.getElementById('overdrive-curve-slider').value;
  let newCurveNumber = parseFloat(newCurve.match(/[\d\.]+/));
  overdrive.curveAmount = newCurveNumber;
}

function bypassOverDrive() {
  let newStatus = document.getElementById('overdrive-toggle').checked
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

function changeReverbWet() {
  let newReverbAmount = document.getElementById('reverb-wet-slider').value
  let newReverbNumber = parseFloat(newReverbAmount.match(/[\d\.]+/));
  convolver.wet.gain.value = newReverbNumber;
}

function bypassReverb() {
  newStatus = document.getElementById('reverb-toggle').checked
  if (newStatus) {
    convolver.bypass = 0;
  }
  else {
    convolver.bypass = 1;
  }
}

function changeFilterFrequency() {
  newCutoff = document.getElementById('filter-cutoff-slider').value;
  newCutoffNumber = parseInt(newCutoff)
  filter.frequency.value = newCutoff
}

function changeFilterType() {
  newFilterType = document.getElementById('filter-type-dropdown').value;
  filter.filter.type = newFilterType;
}

function changeFilterQ() {
  newQ = document.getElementById('filter-Q-slider').value;
  newQNumber = parseInt(newQ)
  filter.Q.value = newQNumber;
}

function changeFilterGain() {
  newGain = document.getElementById('filter-gain-slider').value;
  newGainNumber = parseInt(newGain)
  filter.output.gain.value = newGainNumber;
}

function changeDetune(e) {
  newDetuneAmount = document.getElementById('detune-settings').value;
  detune = parseInt(newDetuneAmount);
}




// initial setup

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
  keyIds = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74]
  keyboard.id = "keyboard"
  noteFreq.forEach(octave => {
    keyList = Object.keys(octave)
    keyList.forEach((note, idx) => {
      keyboard.append(createKey(note, octave[note], keyIds[idx]))
    })
  })
  document.getElementById("keyboard-container").innerHTML = keyboard.innerHTML
}

function createKey(note, freq, keyId) {
  let keyElement = document.createElement("div");
  keyElement.className = "key";
  if (note.length > 1) {
    $(keyElement).addClass('accidental')
  }
  keyElement.dataset["note"] = note;
  keyElement.dataset["frequency"] = freq;
  keyElement.dataset["keyId"] = keyId
  keyElement.innerHTML = `<section class='key-text'><p>${note}<p><p>${String.fromCharCode(keyId)}</p></section>`;
  let fired = false;
  $(document).on("keydown", e => {
    let key = $("div[data-key-id = " + e.keyCode + "]")
    key.addClass('red')
    if (!fired) {
      let osc = playTone($(key[0]).attr("data-frequency"))
      if (!osc) return null;
      $(document).on('keyup', e => {
        osc.stop();
        $('.key').removeClass('red')
        fired = false;
      })
    }
    fired = true;
  })

  return keyElement;
}

function playTone(freq) {
  if (!freq) return null;
  let osc = audioCtx.createOscillator();
  let envelope = audioCtx.createGain();
  let initialValue = envelope.gain.setValueAtTime(0, audioCtx.currentTime);
  envelope.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attack / 1000);
  envelope.gain.linearRampToValueAtTime(sustain, audioCtx.currentTime + decay / 1000)

  osc.connect(envelope);
  envelope.connect(filter);
  filter.connect(masterGainNode);
  masterGainNode.connect(delay);
  delay.connect(phaser);
  phaser.connect(overdrive);
  overdrive.connect(convolver);
  convolver.connect(analyser)

  analyser.connect(audioCtx.destination)

  osc.type = type;
  osc.detune.value = detune;
  let number = parseFloat(freq.match(/[\d\.]+/))
  osc.frequency.value = number;
  osc.start();
  return osc
}

window.setup = setup;
