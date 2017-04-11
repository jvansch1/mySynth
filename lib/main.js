
//module imports
import audioCtx from './audioCtx';
import * as delayEvents from './delayEvents.js';
import * as phaserEvents from './phaserEvents.js';
import * as overdriveEvents from './overdriveEvents.js';
import * as reverbEvents from './reverbEvents.js';
import * as filterEvents from './filterEvents.js';
import { delay, phaser, overdrive, convolver, filter } from './tuna.js'

//global variables
const masterGainNode = audioCtx.createGain();
masterGainNode.gain.value = 1;
masterGainNode.connect(audioCtx.destination);
let type = 'sine'
let type2 = 'sine'
let oscVolume = audioCtx.createGain();
let osc2Volume = audioCtx.createGain();
let envelope = audioCtx.createGain();
let attack = 0;
let decay = 1000;
let sustain = 1;
let detune = 0;
let octave = 1
let oscGain = 0.1;
let osc2Gain = 0.1;
window.oscGain = oscGain;
window.masterGainNode = masterGainNode;


//Setup Array for draw function
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
  let drawVisual = requestAnimationFrame(draw);
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
  canvasCtx.lineTo(canvas.width, canvas.height);
  canvasCtx.stroke();

};

//reset functions
function init() {
  delayReset();
  phaserReset();
  overdriveReset();
  reverbReset();
  filterReset();
  masterReset();
  envelopeReset();
}

function delayReset() {
  document.getElementById('delay-toggle').checked = false;
  document.getElementById('delay-slider').value = 0;
  document.getElementById('delay-feedback-slider').value = 0;
  document.getElementById('delay-wet-slider').value = 0;
  delay.bypass = true;
  delay.delayTime.value = 0;
  delay.feedback.value = 0;
  delay.wetLevel = 0;
}

function phaserReset() {
  document.getElementById('phaser-rate').value = 0;
  document.getElementById('phaser-feedback').value = 0;
  document.getElementById('phaser-depth').value = 0;
  document.getElementById('phaser-toggle').checked = false;
  document.getElementById('phaser-stereo').value = 0;
  phaser.feedback = 0;
  phaser.depth = 0;
  phaser.bypass = true;
  phaser.rate = 0;
  phaser.stereoPhase = 0;
}

function overdriveReset() {
  document.getElementById('overdrive-toggle').checked = false;
  document.getElementById('overdrive-drive-slider').value = 0;
  document.getElementById('overdrive-output-slider').value = 0;
  document.getElementById('overdrive-curve-slider').value = 0;
  document.getElementById('drive-type').value = 0;
  document.getElementById('gain-setting').value = 1;
  overdrive.bypass = true;
  overdrive.drive = 0;
  overdrive.curveAmount = 0;
  overdrive.algorithmIndex = 0;
  overdrive.outputGain.value = 0;
}

function reverbReset() {
  document.getElementById('reverb-toggle').checked = false;
  document.getElementById('reverb-wet-slider').value = 0.5;
  convolver.bypass = true;
  convolver.wetLevel = 0.5;
}

function filterReset() {
  document.getElementById('filter-cutoff-slider').value = 440;
  document.getElementById('filter-Q-slider').value = 0;
  document.getElementById('filter-gain-slider').value = 3.4028234663852886;
  document.getElementById('filter-type-dropdown').value = 'lowpass';
  filter.frequency = 440;
  filter.Q = 0;
  filter.output.gain.value = 3.4028234663852886;
  filter.filterType = 'lowpass';

}

function masterReset() {
  document.getElementById('wave-select').value = 'sine';
  document.getElementById('wave-select-two').value = 'sine';
  document.getElementById('detune-settings').value = 0;
  document.getElementById('osc-one-gain').value = 0.1;
  document.getElementById('osc-two-gain').value = 0.1;
  type = 'sine'
  type2 = 'sine'
  octave = 1;
  oscGain = 0.1;
  osc2Gain = 0.1;
  detune = 0;
  masterGainNode.gain.value = 1;
}

function envelopeReset() {
  document.getElementById('attack-slider').value = 0;
  document.getElementById('decay-slider').value = 1000;
  document.getElementById('sustain-slider').value = 1;
  attack = 0;
  decay = 1000;
  sustain = 1;
}


//Add all event listeners for non Tuna settings on load
document.addEventListener("DOMContentLoaded", () => {

    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    const $instructionsOne = $('#one')
    const $instructionsTwo = $('#two')
    const $instructionsThree = $('#three')
    const $instructionsFour = $('#four')
    const $instructionsFive = $('#five')
    const $instructionsSix = $('#six')
    const $instructions = [$instructionsOne, $instructionsTwo, $instructionsThree, $instructionsFour, $instructionsFive, $instructionsSix]
    let currentWindow = 0;

    //handles render of instructions
    next.addEventListener('click', () => {
      $($instructions[currentWindow]).attr("hidden", true)
      $($instructions[currentWindow + 1]).attr("hidden", false)
      currentWindow++
      if (currentWindow > $instructions.length - 1) {
        $(next).attr("hidden", true)
        $(prev).attr("hidden", true)
        $('#close').hide();
        $('#tutorial-header').hide();
        $('#instructions').attr("hidden", true)
        $('#instructions').css('background', 'transparent');
        $('#instructions').css('border', 'none');
        $('#instructions').css('z-index', '-1');
        $('#transparent').css('background', 'transparent');
      }
    })

    prev.addEventListener('click', () => {
      if (currentWindow === 0) {
        return;
      }
      $($instructions[currentWindow]).attr("hidden", true)
      $($instructions[currentWindow - 1]).attr("hidden", false)
        currentWindow--
    })

    let close = $('.fa-times')
    close[0].addEventListener('click', () => {
      currentWindow = 0;
      $(next).attr("hidden", true)
      $(prev).attr("hidden", true)
      $('#instructions').hide()
      $('#instructions').css('background', 'transparent');
      $('#instructions').css('border', 'none');
      $('#instructions').css('z-index', '-1');
      $('.tutorial-text').attr('hidden', true);
      $('#close').hide();
      $('#tutorial-header').hide();
      $('#transparent').css('background', 'transparent');
      $('#tutorial-header').attr('hidden', true);
    })


    //Handle presets
    let presetOneButton = document.getElementById('preset-1');
    presetOneButton.addEventListener('click', () => {
      init();
      octave = 3;
      detune = 5;
      type ='square'
      document.getElementById('wave-select').value = 'square'
      newDetuneAmount.value = 5;
      document.getElementById('phaser-rate').value = 7;
      document.getElementById('phaser-depth').value = 0.8
      document.getElementById('phaser-toggle').checked = true;
      phaser.depth = 0.8
      phaser.bypass = false;
      phaser.rate = 7;
      delay.bypass = false;
      document.getElementById('delay-toggle').checked = true;
      document.getElementById('delay-slider').value = 0.25;
      document.getElementById('delay-wet-slider').value = 0.3;
      document.getElementById('delay-feedback-slider').value = 0.70
      delay.delayTime.value = 0.25;
      delay.feedback.value = 0.70;
      delay.wet.gain.value = 0.3;
    })

    let presetTwoButton = document.getElementById('preset-2');
    presetTwoButton.addEventListener('click', () => {
      init()
      type ='sawtooth'
      detune = 20;
      newDetuneAmount.value = 20;
      type2 = 'sawtooth'
      document.getElementById('wave-select').value = 'sawtooth';
      document.getElementById('wave-select-two').value = 'sawtooth';
      document.getElementById('overdrive-toggle').checked = true;
      document.getElementById('overdrive-drive-slider').value = 0.5;
      document.getElementById('overdrive-curve-slider').value = 0.6;
      document.getElementById('overdrive-output-slider').value = 0.4;
      document.getElementById('drive-type').value = 4;
      overdrive.bypass = false;
      overdrive.drive = 0.5;
      overdrive.curveAmount = 0.6;
      overdrive.algorithmIndex = 4;
      overdrive.outputGain.value = 0.4
    })

    let presetThreeButton = document.getElementById('preset-3');
    presetThreeButton.addEventListener('click', () => {
      init();
      octave = 3;
      detune = 3;
      newDetuneAmount.value = 3;
      attack = 2000;
      type = 'triangle';
      type2 = 'triangle';
      convolver.bypass = false;
      convolver.wetLevel = 0.8;
      delay.bypass = false;
      delay.delayTime.value = 0.9;
      delay.feedback.value = 0.8;
      delay.wetLevel = 0.6;
      document.getElementById('attack-slider').value = 2000;
      document.getElementById('delay-slider').value = 0.9;
      document.getElementById('delay-feedback-slider').value = 0.8;
      document.getElementById('delay-wet-slider').value = delay.wetLevel;
      document.getElementById('delay-toggle').checked = true;
      document.getElementById('wave-select').value = 'triangle';
      document.getElementById('wave-select-two').value = 'triangle';
      document.getElementById('reverb-toggle').checked = true;
      document.getElementById('reverb-wet-slider').value = 0.8;
    })

    let defaultButton = document.getElementById('init')
    defaultButton.addEventListener('click', init)



    //DOM listeners to change settings not specific to effects
    let newAttack = document.getElementById('attack-slider')
    newAttack.addEventListener("change", () => {
      let newAttackNumber = parseInt(newAttack.value);
      attack = newAttackNumber;
    })

    let newDecay = document.getElementById('decay-slider')
    newDecay.addEventListener("change", () => {
      let newDecayNumber = parseInt(newDecay.value);
      decay = newDecayNumber;
    })

    let newSustain = document.getElementById('sustain-slider')
    newSustain.addEventListener("change", () => {
      let newSustainNumber = parseFloat(newSustain.value.match(/[\d\.]+/));
      sustain = newSustainNumber
    })

    let target = document.getElementById("wave-select");
    target.addEventListener("change", () => {
      $('#wave-select').blur();
      type = target.value;
    })

    let targetTwo = document.getElementById("wave-select-two");
    targetTwo.addEventListener("change", () => {
      $('#wave-select-two').blur();
      type2 = targetTwo.value;
    })

    let oscOneGain = document.getElementById('osc-one-gain');
    oscOneGain.addEventListener("change", () => {
      let oscOneGainNumber = parseFloat(oscOneGain.value.match(/[\d\.]+/));
      oscGain = oscOneGainNumber;
    })

    let oscTwoGain = document.getElementById('osc-two-gain');
    oscTwoGain.addEventListener("change", () => {
      let oscTwoGainNumber = parseFloat(oscTwoGain.value.match(/[\d\.]+/));
      osc2Gain = oscTwoGainNumber;
    })

    let gainTarget = document.getElementById('gain-setting');
    gainTarget.addEventListener("change", () => {
      masterGainNode.gain.value = gainTarget.value
    })

    let octaveUp = document.getElementById("octave-up")
    octaveUp.addEventListener("click", () => {
      if (octave >= 7) {
        octave = 7
      }
      else {
        octave = octave + 1
      }
    })

    let octaveDown = document.getElementById("octave-down")
    octaveDown.addEventListener("click", () => {
      if (octave <= 1) {
        octave = 1
      }
      else {
        octave = octave - 1
      }
    })

    let newDetuneAmount = document.getElementById('detune-settings');
    newDetuneAmount.addEventListener("change", () => {
      detune = parseInt(newDetuneAmount.value);
    })
})

// initial setup

function createNoteTable(octave) {
  let noteFreq = [{}];
  let multiplier = octave
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

export const setup = function() {
  let noteFreq = createNoteTable(octave);
  let keyboard = document.createElement("div")
  let keyIds = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74]
  keyboard.id = "keyboard";
  noteFreq.forEach(octave => {
    let keyList = Object.keys(octave)
    keyList.forEach((note, idx) => {
      keyboard.append(createKey(note, octave[note], keyIds[idx]))
    });
  });
  document.getElementById("keyboard-container").innerHTML = keyboard.innerHTML
}

let activeNotes = {};

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
  let oscs;
  $(document).on("keydown", e => {
    let key = $("div[data-key-id = " + e.keyCode + "]")
    if (key.length === 0) {
      return null;
    }
    key.addClass('red')
    if (activeNotes[e.keyCode]) return null;
      oscs = playTone($(key[0]).attr("data-frequency"))
      activeNotes[e.keyCode] = oscs;
      if (!oscs) return null;
  })
  $(document).on('keyup', e => {
    if (!oscs) return null;
      let toStop = activeNotes[e.keyCode]
      $("div[data-key-id = " + e.keyCode + "]").removeClass('red')
      if (!toStop) return null;
      toStop.forEach((osc,idx) => {
          osc.stop();
      });
      activeNotes[e.keyCode] = null;
  })
  return keyElement;
}


//connect oscillators nodes to all tuna.js nodes
function connectNodes(osc, osc2) {
  oscVolume.gain.value = oscGain;
  osc2Volume.gain.value = osc2Gain;
  let initialValue = envelope.gain.setValueAtTime(0, audioCtx.currentTime);
  envelope.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attack / 1000);
  envelope.gain.linearRampToValueAtTime(sustain, audioCtx.currentTime + decay / 1000)
  osc.connect(oscVolume);
  oscVolume.connect(envelope);
  osc2.connect(osc2Volume);
  osc2Volume.connect(envelope);
  envelope.connect(filter);
  filter.connect(masterGainNode);
  masterGainNode.connect(delay);
  delay.connect(phaser);
  phaser.connect(overdrive);
  overdrive.connect(convolver);
  convolver.connect(analyser)
  analyser.connect(audioCtx.destination)
  return null;
}

function playTone(freq) {
  if (!freq) return null;
  let osc = audioCtx.createOscillator();
  let osc2 = audioCtx.createOscillator();
  connectNodes(osc, osc2)
  osc.type = type;
  osc2.type = type2;
  osc.detune.value = detune * 5;
  osc2.detune.value = -detune * 5;
  let number = parseFloat(freq.match(/[\d\.]+/))
  osc.frequency.value = number * octave;
  osc2.frequency.value = number * octave;
  osc.start();
  osc2.start();
  return [osc,osc2]
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
  draw();
});
