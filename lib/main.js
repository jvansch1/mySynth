import audioCtx from './audioCtx';
import * as delayEvents from './delayEvents.js';
import * as phaserEvents from './phaserEvents.js';
import * as overdriveEvents from './overdriveEvents.js';
import * as reverbEvents from './reverbEvents.js';
import * as filterEvents from './filterEvents.js';
import { delay, phaser, overdrive, convolver, filter } from './tuna.js'
const masterGainNode = audioCtx.createGain();
masterGainNode.gain.value = 0.5;
masterGainNode.connect(audioCtx.destination);
let type = 'sine'
let type2 = 'sine'

//global variables
let attack = 0;
let decay = 1000;
let sustain = 0.2;
let detune = 0;
let octave = 1
let oscGain = 0.1;
let osc2Gain = 0.1;
window.oscGain = oscGain;
window.masterGainNode = masterGainNode;

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

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();

};

document.addEventListener("DOMContentLoaded", () => {

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
      debugger
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

// function bypassFilter() {
//   newStatus = document.getElementById('filter-toggle').checked;
//   if (newStatus) {
//     filter.bypass = 0;
//   }
//   else {
//     filter.bypass = 1;
//   }
// };

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
    debugger
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
      toStop.forEach(osc => {
        osc.stop();
      });
      activeNotes[e.keyCode] = null;
  })
  return keyElement;
}

let oscVolume = audioCtx.createGain();
let osc2Volume = audioCtx.createGain();
let envelope = audioCtx.createGain();

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
