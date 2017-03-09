import audioCtx from './audioCtx';
import * as delayEvents from './delayEvents.js';
import * as phaserEvents from './phaserEvents.js';
import * as overdriveEvents from './overdriveEvents.js';
import * as reverbEvents from './reverbEvents.js';
import * as filterEvents from './filterEvents.js';
import { delay, phaser, overdrive, convolver, filter } from './tuna.js'
const masterGainNode = audioCtx.createGain();
masterGainNode.gain.value = 0.1
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

// handles changes in by user

function octaveUp() {
  octave = octave + 1
  setup();
}

function octaveDown() {
  octave = octave - 1
  setup();
}

// function changeGain() {
//   target = document.getElementById('gain-setting');
//   masterGainNode.gain.value = target.value
// }
function changeOscOneGain() {
  debugger
  target = document.getElementById('osc-one-gain').value;
  newVolume = parseFloat(target.match(/[\d\.]+/))
  oscGain = newVolume;
}

function changeOscTwoGain() {
  target = document.getElementById('osc-two-gain').value;
  newVolume = parseFloat(target.match(/[\d\.]+/))
  osc2Gain = newVolume;
}

// function changeDelayTime(e) {
//   newDelayTime = document.getElementById('delay-slider').value
//   newDelayNumber = parseFloat(newDelayTime.match(/[\d\.]+/))
//   delay.delayTime.value = newDelayNumber;
// }

// function changeDelayDry(e) {
//   newDry = document.getElementById('delay-dry-slider').value
//   newDryNumber = parseFloat(newDry.match(/[\d\.]+/))
//   delay.dry.gain.value = newDryNumber;
// }

// function changeDelayWet(e) {
//   newWet = document.getElementById('delay-wet-slider').value
//   newWetNumber = parseFloat(newWet.match(/[\d\.]+/))
//   delay.wet.gain.value = newWetNumber;
// }

// function bypassDelay() {
//   newStatus = document.getElementById('delay-toggle').checked
//   if (newStatus) {
//     delay.bypass = false;
//   }
//   else {
//     delay.bypass = true
//   }
// }

// function changeDelayFeedback(e) {
//   newFeedbackTime = document.getElementById('delay-feedback-slider').value
//   newFeedbackNumber = parseFloat(newFeedbackTime.match(/[\d\.]+/))
//   delay.feedback.value = newFeedbackNumber;
// }

// function changePhaserDepth() {
//   newPhaserDepth = document.getElementById('phaser-depth').value
//   newPhaserDepth = parseFloat(newPhaserDepth.match(/[\d\.]+/))
//   phaser.depth = newPhaserDepth;
// }

// function changePhaserFeedback() {
//   newPhaserFeedback = document.getElementById('phaser-feedback').value
//   newPhaserFeedback = parseFloat(newPhaserFeedback.match(/[\d\.]+/))
//   phaser.depth = newPhaserFeedback;
// }

// function changePhaserRate() {
//   newPhaserRate = document.getElementById('phaser-rate').value
//   newPhaserRate = parseFloat(newPhaserRate.match(/[\d\.]+/))
//   phaser.rate = newPhaserRate;
// }

// function changePhaserStereo() {
//   newPhaserStereo = document.getElementById('phaser-stereo').value
//   newPhaserStereoNumber = parseInt(newPhaserStereo)
//   phaser.stereoPhase = newPhaserStereoNumber;
// }

// function bypassPhaser() {
//   let newStatus = document.getElementById('phaser-toggle').checked
//   if (newStatus) {
//     phaser.bypass = false
//   }
//   else {
//     phaser.bypass = true;
//   }
// }




function changeSecondWaveForm(e) {
  target = document.getElementById("wave-select-two");
  $('#wave-select-two').blur();
  type2 = target.value;
  setup();
}

// function changeOverDriveDrive() {
//   let newDrive = document.getElementById('overdrive-drive-slider').value;
//   let newDriveNumber = parseFloat(newDrive.match(/[\d\.]+/));
//   overdrive.drive.value = newDriveNumber;
// }

// function changeOverDriveGain() {
//   let newGain = document.getElementById('overdrive-output-slider').value;
//   let newGainNumber = parseFloat(newGain.match(/[\d\.]+/));
//   overdrive.outputGain.value = newGainNumber;
// }

function changeOverDriveType() {
  let newType = document.getElementById('drive-type').value;
  let newTypeNumber = parseInt(newType)
  overdrive.algorithmIndex = newTypeNumber;
}

// function changeOverDriveCurve() {
//   let newCurve = document.getElementById('overdrive-curve-slider').value;
//   let newCurveNumber = parseFloat(newCurve.match(/[\d\.]+/));
//   overdrive.curveAmount = newCurveNumber;
// }

// function bypassOverDrive() {
//   let newStatus = document.getElementById('overdrive-toggle').checked
//   if (newStatus) {
//     overdrive.bypass = 0
//   }
//   else {
//     overdrive.bypass = 1;
//   }
// }

document.addEventListener("DOMContentLoaded", () => {

    let newAttack = document.getElementById('attack-slider')
    newAttack.addEventListener("change", () => {
      debugger
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

    // let octaveUp = document.getElementById("octave-up")
    // octaveUp.addEventListener("click", () => {
    //   if (octave >= 7) {
    //     octave = 7
    //   }
    //   else {
    //     octave = octave + 1
    //   }
    //   setup();
    // })
    //
    // let octaveDown = document.getElementById("octave-down")
    // octaveDown.addEventListener("click", () => {
    //   if (octave <= 1) {
    //     octave = 1
    //   }
    //   else {
    //     octave = octave - 1
    //   }
    //   setup();
    // })


    let newDetuneAmount = document.getElementById('detune-settings');
    debugger
    newDetuneAmount.addEventListener("change", () => {
      debugger
      detune = parseInt(newDetuneAmount.value);
    })

})



// function changeReverbWet() {
//   let newReverbAmount = document.getElementById('reverb-wet-slider').value
//   let newReverbNumber = parseFloat(newReverbAmount.match(/[\d\.]+/));
//   convolver.wet.gain.value = newReverbNumber;
// }

// function bypassReverb() {
//   newStatus = document.getElementById('reverb-toggle').checked
//   if (newStatus) {
//     convolver.bypass = 0;
//   }
//   else {
//     convolver.bypass = 1;
//   }
// }

// function changeFilterFrequency() {
//   newCutoff = document.getElementById('filter-cutoff-slider').value;
//   newCutoffNumber = parseInt(newCutoff)
//   filter.frequency.value = newCutoff
// }

// function changeFilterType() {
//   newFilterType = document.getElementById('filter-type-dropdown').value;
//   $('#filter-type-dropdown').blur();
//   filter.filter.type = newFilterType;
// }

// function changeFilterQ() {
//   newQ = document.getElementById('filter-Q-slider').value;
//   newQNumber = parseInt(newQ)
//   filter.Q.value = newQNumber;
// }

// function changeFilterGain() {
//   newGain = document.getElementById('filter-gain-slider').value;
//   newGainNumber = parseFloat(newGain.match(/^-?[0-9]+(?:\.[0-9]+)?$/));
//   filter.output.gain.value = newGainNumber;
// }



function bypassFilter() {
  newStatus = document.getElementById('filter-toggle').checked;
  if (newStatus) {
    filter.bypass = 0;
  }
  else {
    filter.bypass = 1;
  }
};

// initial setup

function createNoteTable(octave) {
  let noteFreq = [{}];
  let multiplier = octave
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
      let oscs = playTone($(key[0]).attr("data-frequency"))
      if (!oscs) return null;
      $(document).on('keyup', e => {
          oscs.forEach(osc => {
            debugger
            osc.stop();
          });
        $('.key').removeClass('red')
        fired = false;
      })
    }
    fired = true;
  })

  return keyElement;
}

let oscVolume = audioCtx.createGain();
let osc2Volume = audioCtx.createGain();

function connectNodes(osc, osc2) {
  let envelope = audioCtx.createGain();

  oscVolume.gain.value = oscGain;

  osc2Volume.gain.value = osc2Gain;
  let initialValue = envelope.gain.setValueAtTime(0, audioCtx.currentTime);
  envelope.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attack / 1000);
  envelope.gain.linearRampToValueAtTime(sustain, audioCtx.currentTime + decay / 1000)

  // osc.connect(envelope);
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
  osc.frequency.value = number;
  osc.start();
  osc2.start();
  return [osc,osc2]
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
  draw();
});
