/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filter = exports.convolver = exports.overdrive = exports.phaser = exports.delay = undefined;

var _audioCtx = __webpack_require__(1);

var _audioCtx2 = _interopRequireDefault(_audioCtx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tuna = new Tuna(_audioCtx2.default);
var delay = exports.delay = new tuna.Delay({
    feedback: 0.2,
    delayTime: 200, //this will create a short "slap back" delay
    wetLevel: 0.7,
    dryLevel: 1,
    cutoff: 5000,
    bypass: true
});

var phaser = exports.phaser = new tuna.Phaser({
    rate: 1.2, //0.01 to 8 is a decent range, but higher values are possible
    depth: 0, //0 to 1
    feedback: 0.0, //0 to 1+
    stereoPhase: 30, //0 to 180
    baseModulationFrequency: 700, //500 to 1500
    bypass: 1
});

var overdrive = exports.overdrive = new tuna.Overdrive({
    outputGain: 0.01, //0 to 1+
    drive: 0.01, //0 to 1
    curveAmount: 0, //0 to 1
    algorithmIndex: 0, //0 to 5, selects one of our drive algorithms
    bypass: 1
});

var convolver = exports.convolver = new tuna.Convolver({
    highCut: 22050, //20 to 22050
    lowCut: 20, //20 to 22050
    dryLevel: 1, //0 to 1+
    wetLevel: 1, //0 to 1+
    level: 1, //0 to 1+, adjusts total output of both wet and dry
    impulse: "impulses/BatteryBenson.wav", //the path to your impulse response
    bypass: 1
});

var filter = exports.filter = new tuna.Filter({
    frequency: 440, //20 to 22050
    Q: 1, //0.001 to 100
    gain: 3.4028234663852886, //-40 to 40 (in decibels)
    filterType: "lowpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
    bypass: 0
});

/***/ },
/* 1 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
exports.default = audioCtx;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _tuna = __webpack_require__(0);

document.addEventListener("DOMContentLoaded", function () {
  var newDelayTime = document.getElementById('delay-slider');

  newDelayTime.addEventListener("change", function (e) {
    var newDelayNumber = parseFloat(newDelayTime.value.match(/[\d\.]+/));
    _tuna.delay.delayTime.value = newDelayNumber;
  });

  var newWet = document.getElementById('delay-wet-slider');

  newWet.addEventListener("change", function () {
    var newWetNumber = parseFloat(newWet.value.match(/[\d\.]+/));
    _tuna.delay.wet.gain.value = newWetNumber;
  });

  var newStatus = document.getElementById('delay-toggle');
  newStatus.addEventListener('click', function () {
    if (newStatus.checked) {
      _tuna.delay.bypass = false;
    } else {
      _tuna.delay.bypass = true;
    }
  });

  var newFeedbackTime = document.getElementById('delay-feedback-slider');
  newFeedbackTime.addEventListener('change', function () {
    var newFeedbackNumber = parseFloat(newFeedbackTime.value.match(/[\d\.]+/));
    _tuna.delay.feedback.value = newFeedbackNumber;
  });
});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _tuna = __webpack_require__(0);

document.addEventListener('DOMContentLoaded', function () {

  var newCutoff = document.getElementById('filter-cutoff-slider');
  newCutoff.addEventListener("change", function () {
    var newCutoffNumber = parseInt(newCutoff.value);
    _tuna.filter.frequency.value = newCutoffNumber;
  });

  var newFilterType = document.getElementById('filter-type-dropdown');
  newFilterType.addEventListener("change", function () {
    $('#filter-type-dropdown').blur();
    _tuna.filter.filter.type = newFilterType.value;
  });

  var newQ = document.getElementById('filter-Q-slider');
  newQ.addEventListener("change", function () {
    var newQNumber = parseInt(newQ.value);
    _tuna.filter.Q.value = newQNumber;
  });

  var newGain = document.getElementById('filter-gain-slider');
  _tuna.filter.output.gain.value = 3.4028234663852886;
  newGain.addEventListener("change", function () {
    var newGainNumber = parseFloat(newGain.value.match(/^-?[0-9]+(?:\.[0-9]+)?$/));
    _tuna.filter.output.gain.value = newGainNumber;
  });
});

/***/ },
/* 4 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createInstructions = exports.createInstructions = function createInstructions() {

  var next = document.getElementById('next');
  var prev = document.getElementById('prev');
  var $instructionsOne = $('#one');
  var $instructionsTwo = $('#two');
  var $instructionsThree = $('#three');
  var $instructionsFour = $('#four');
  var $instructionsFive = $('#five');
  var $instructionsSix = $('#six');
  var $instructions = [$instructionsOne, $instructionsTwo, $instructionsThree, $instructionsFour, $instructionsFive, $instructionsSix];
  var currentWindow = 0;

  //handles render of instructions
  next.addEventListener('click', function () {
    $($instructions[currentWindow]).attr("hidden", true);
    $($instructions[currentWindow + 1]).attr("hidden", false);
    currentWindow++;
    if (currentWindow > $instructions.length - 1) {
      $(next).attr("hidden", true);
      $(prev).attr("hidden", true);
      $('#close').hide();
      $('#tutorial-header').hide();
      $('#instructions').attr("hidden", true);
      $('#instructions').css('background', 'transparent');
      $('#instructions').css('border', 'none');
      $('#instructions').css('z-index', '-1');
      $('#transparent').css('background', 'transparent');
    }
  });

  prev.addEventListener('click', function () {
    if (currentWindow === 0) {
      return;
    }
    $($instructions[currentWindow]).attr("hidden", true);
    $($instructions[currentWindow - 1]).attr("hidden", false);
    currentWindow--;
  });

  var close = $('.fa-times');
  close[0].addEventListener('click', function () {
    currentWindow = 0;
    $(next).attr("hidden", true);
    $(prev).attr("hidden", true);
    $('#instructions').hide();
    $('#instructions').css('background', 'transparent');
    $('#instructions').css('border', 'none');
    $('#instructions').css('z-index', '-1');
    $('.tutorial-text').attr('hidden', true);
    $('#close').hide();
    $('#tutorial-header').hide();
    $('#transparent').css('background', 'transparent');
    $('#tutorial-header').attr('hidden', true);
  });
};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draw = exports.analyser = undefined;

var _audioCtx = __webpack_require__(1);

var _audioCtx2 = _interopRequireDefault(_audioCtx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Setup Array for draw function
var analyser = exports.analyser = _audioCtx2.default.createAnalyser();
var bufferLength = analyser.fftSize = 2048;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

//draw function
var canvas = void 0;
var canvasCtx = void 0;
document.addEventListener("DOMContentLoaded", function () {
  canvas = document.getElementById("oscilloscope");
  canvasCtx = canvas.getContext("2d");
});

var draw = exports.draw = function draw() {
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  var drawVisual = requestAnimationFrame(draw);
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _tuna = __webpack_require__(0);

document.addEventListener("DOMContentLoaded", function () {

  var newDrive = document.getElementById('overdrive-drive-slider');
  newDrive.addEventListener("click", function () {
    var newDriveNumber = parseFloat(newDrive.value.match(/[\d\.]+/));
    _tuna.overdrive.drive.value = newDriveNumber;
  });

  var newGain = document.getElementById('overdrive-output-slider');
  newGain.addEventListener("change", function () {
    var newGainNumber = parseFloat(newGain.value.match(/[\d\.]+/));
    _tuna.overdrive.outputGain.value = newGainNumber;
  });

  var newCurve = document.getElementById('overdrive-curve-slider');
  newCurve.addEventListener("change", function () {
    var newCurveNumber = parseFloat(newCurve.value.match(/[\d\.]+/));
    _tuna.overdrive.curveAmount = newCurveNumber;
  });

  var newType = document.getElementById('drive-type');
  newType.addEventListener("change", function () {
    var newTypeNumber = parseInt(newType.value);
    _tuna.overdrive.algorithmIndex = newTypeNumber;
  });

  var newStatus = document.getElementById('overdrive-toggle');
  newStatus.addEventListener("click", function () {
    if (newStatus.checked) {
      _tuna.overdrive.bypass = 0;
    } else {
      _tuna.overdrive.bypass = 1;
    }
  });
});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _tuna = __webpack_require__(0);

document.addEventListener("DOMContentLoaded", function () {

  var newPhaserDepth = document.getElementById('phaser-depth');

  newPhaserDepth.addEventListener("change", function () {
    var newPhaserDepthNumber = parseFloat(newPhaserDepth.value.match(/[\d\.]+/));
    _tuna.phaser.depth = newPhaserDepthNumber;
  });

  var newPhaserFeedback = document.getElementById('phaser-feedback');
  newPhaserFeedback.addEventListener("change", function () {
    var newPhaserFeedbackNumber = parseFloat(newPhaserFeedback.value.match(/[\d\.]+/));
    _tuna.phaser.depth = newPhaserFeedbackNumber;
  });

  var newPhaserRate = document.getElementById('phaser-rate');
  newPhaserRate.addEventListener("change", function () {
    var newPhaserRateNumber = parseFloat(newPhaserRate.value.match(/[\d\.]+/));
    _tuna.phaser.rate = newPhaserRateNumber;
  });

  var newPhaserStereo = document.getElementById('phaser-stereo');
  newPhaserStereo.addEventListener("change", function () {
    var newPhaserStereoNumber = parseInt(newPhaserStereo.value);
    _tuna.phaser.stereoPhase = newPhaserStereoNumber;
  });

  var newStatus = document.getElementById('phaser-toggle');
  newStatus.addEventListener('click', function () {
    if (newStatus.checked) {
      _tuna.phaser.bypass = false;
    } else {
      _tuna.phaser.bypass = true;
    }
  });
});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _tuna = __webpack_require__(0);

document.addEventListener("DOMContentLoaded", function () {

  var newReverbAmount = document.getElementById('reverb-wet-slider');
  newReverbAmount.addEventListener("change", function () {
    var newReverbNumber = parseFloat(newReverbAmount.value.match(/[\d\.]+/));
    _tuna.convolver.wet.gain.value = newReverbNumber;
  });

  var newStatus = document.getElementById('reverb-toggle');
  newStatus.addEventListener("click", function () {
    if (newStatus.checked) {
      _tuna.convolver.bypass = 0;
    } else {
      _tuna.convolver.bypass = 1;
    }
  });
});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = undefined;

var _audioCtx = __webpack_require__(1);

var _audioCtx2 = _interopRequireDefault(_audioCtx);

var _delayEvents = __webpack_require__(2);

var delayEvents = _interopRequireWildcard(_delayEvents);

var _phaserEvents = __webpack_require__(7);

var phaserEvents = _interopRequireWildcard(_phaserEvents);

var _overdriveEvents = __webpack_require__(6);

var overdriveEvents = _interopRequireWildcard(_overdriveEvents);

var _reverbEvents = __webpack_require__(8);

var reverbEvents = _interopRequireWildcard(_reverbEvents);

var _filterEvents = __webpack_require__(3);

var filterEvents = _interopRequireWildcard(_filterEvents);

var _oscilloscope = __webpack_require__(5);

var _instructions = __webpack_require__(4);

var _tuna = __webpack_require__(0);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//global variables
var masterGainNode = _audioCtx2.default.createGain(); //module imports

masterGainNode.gain.value = 1;
masterGainNode.connect(_audioCtx2.default.destination);
var type = 'sine';
var type2 = 'sine';
var oscVolume = _audioCtx2.default.createGain();
var osc2Volume = _audioCtx2.default.createGain();
var envelope = _audioCtx2.default.createGain();
var attack = 0;
var decay = 1000;
var sustain = 1;
var detune = 0;
var octave = 1;
var oscGain = 0.1;
var osc2Gain = 0.1;
window.oscGain = oscGain;
window.masterGainNode = masterGainNode;

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
  _tuna.delay.bypass = true;
  _tuna.delay.delayTime.value = 0;
  _tuna.delay.feedback.value = 0;
  _tuna.delay.wetLevel = 0;
}

function phaserReset() {
  document.getElementById('phaser-rate').value = 0;
  document.getElementById('phaser-feedback').value = 0;
  document.getElementById('phaser-depth').value = 0;
  document.getElementById('phaser-toggle').checked = false;
  document.getElementById('phaser-stereo').value = 0;
  _tuna.phaser.feedback = 0;
  _tuna.phaser.depth = 0;
  _tuna.phaser.bypass = true;
  _tuna.phaser.rate = 0;
  _tuna.phaser.stereoPhase = 0;
}

function overdriveReset() {
  document.getElementById('overdrive-toggle').checked = false;
  document.getElementById('overdrive-drive-slider').value = 0;
  document.getElementById('overdrive-output-slider').value = 0;
  document.getElementById('overdrive-curve-slider').value = 0;
  document.getElementById('drive-type').value = 0;
  document.getElementById('gain-setting').value = 1;
  _tuna.overdrive.bypass = true;
  _tuna.overdrive.drive = 0;
  _tuna.overdrive.curveAmount = 0;
  _tuna.overdrive.algorithmIndex = 0;
  _tuna.overdrive.outputGain.value = 0;
}

function reverbReset() {
  document.getElementById('reverb-toggle').checked = false;
  document.getElementById('reverb-wet-slider').value = 0.5;
  _tuna.convolver.bypass = true;
  _tuna.convolver.wetLevel = 0.5;
}

function filterReset() {
  document.getElementById('filter-cutoff-slider').value = 440;
  document.getElementById('filter-Q-slider').value = 0;
  document.getElementById('filter-gain-slider').value = 3.4028234663852886;
  document.getElementById('filter-type-dropdown').value = 'lowpass';
  _tuna.filter.frequency = 440;
  _tuna.filter.Q = 0;
  _tuna.filter.output.gain.value = 3.4028234663852886;
  _tuna.filter.filterType = 'lowpass';
}

function masterReset() {
  document.getElementById('wave-select').value = 'sine';
  document.getElementById('wave-select-two').value = 'sine';
  document.getElementById('detune-settings').value = 0;
  document.getElementById('osc-one-gain').value = 0.1;
  document.getElementById('osc-two-gain').value = 0.1;
  type = 'sine';
  type2 = 'sine';
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
document.addEventListener("DOMContentLoaded", function () {

  (0, _instructions.createInstructions)();
  //Handle presets
  var presetOneButton = document.getElementById('preset-1');
  presetOneButton.addEventListener('click', function () {
    init();
    octave = 3;
    detune = 5;
    type = 'square';
    document.getElementById('wave-select').value = 'square';
    newDetuneAmount.value = 5;
    document.getElementById('phaser-rate').value = 7;
    document.getElementById('phaser-depth').value = 0.8;
    document.getElementById('phaser-toggle').checked = true;
    _tuna.phaser.depth = 0.8;
    _tuna.phaser.bypass = false;
    _tuna.phaser.rate = 7;
    _tuna.delay.bypass = false;
    document.getElementById('delay-toggle').checked = true;
    document.getElementById('delay-slider').value = 0.25;
    document.getElementById('delay-wet-slider').value = 0.3;
    document.getElementById('delay-feedback-slider').value = 0.70;
    _tuna.delay.delayTime.value = 0.25;
    _tuna.delay.feedback.value = 0.70;
    _tuna.delay.wet.gain.value = 0.3;
  });

  var presetTwoButton = document.getElementById('preset-2');
  presetTwoButton.addEventListener('click', function () {
    init();
    type = 'sawtooth';
    detune = 20;
    newDetuneAmount.value = 20;
    type2 = 'sawtooth';
    document.getElementById('wave-select').value = 'sawtooth';
    document.getElementById('wave-select-two').value = 'sawtooth';
    document.getElementById('overdrive-toggle').checked = true;
    document.getElementById('overdrive-drive-slider').value = 0.5;
    document.getElementById('overdrive-curve-slider').value = 0.6;
    document.getElementById('overdrive-output-slider').value = 0.4;
    document.getElementById('drive-type').value = 4;
    _tuna.overdrive.bypass = false;
    _tuna.overdrive.drive = 0.5;
    _tuna.overdrive.curveAmount = 0.6;
    _tuna.overdrive.algorithmIndex = 4;
    _tuna.overdrive.outputGain.value = 0.4;
  });

  var presetThreeButton = document.getElementById('preset-3');
  presetThreeButton.addEventListener('click', function () {
    init();
    octave = 3;
    detune = 3;
    newDetuneAmount.value = 3;
    attack = 2000;
    type = 'triangle';
    type2 = 'triangle';
    _tuna.convolver.bypass = false;
    _tuna.convolver.wetLevel = 0.8;
    _tuna.delay.bypass = false;
    _tuna.delay.delayTime.value = 0.9;
    _tuna.delay.feedback.value = 0.8;
    _tuna.delay.wetLevel = 0.6;
    document.getElementById('attack-slider').value = 2000;
    document.getElementById('delay-slider').value = 0.9;
    document.getElementById('delay-feedback-slider').value = 0.8;
    document.getElementById('delay-wet-slider').value = _tuna.delay.wetLevel;
    document.getElementById('delay-toggle').checked = true;
    document.getElementById('wave-select').value = 'triangle';
    document.getElementById('wave-select-two').value = 'triangle';
    document.getElementById('reverb-toggle').checked = true;
    document.getElementById('reverb-wet-slider').value = 0.8;
  });

  var defaultButton = document.getElementById('init');
  defaultButton.addEventListener('click', init);

  //DOM listeners to change settings not specific to effects
  var newAttack = document.getElementById('attack-slider');
  newAttack.addEventListener("change", function () {
    var newAttackNumber = parseInt(newAttack.value);
    attack = newAttackNumber;
  });

  var newDecay = document.getElementById('decay-slider');
  newDecay.addEventListener("change", function () {
    var newDecayNumber = parseInt(newDecay.value);
    decay = newDecayNumber;
  });

  var newSustain = document.getElementById('sustain-slider');
  newSustain.addEventListener("change", function () {
    var newSustainNumber = parseFloat(newSustain.value.match(/[\d\.]+/));
    sustain = newSustainNumber;
  });

  var target = document.getElementById("wave-select");
  target.addEventListener("change", function () {
    $('#wave-select').blur();
    type = target.value;
  });

  var targetTwo = document.getElementById("wave-select-two");
  targetTwo.addEventListener("change", function () {
    $('#wave-select-two').blur();
    type2 = targetTwo.value;
  });

  var oscOneGain = document.getElementById('osc-one-gain');
  oscOneGain.addEventListener("change", function () {
    var oscOneGainNumber = parseFloat(oscOneGain.value.match(/[\d\.]+/));
    oscGain = oscOneGainNumber;
  });

  var oscTwoGain = document.getElementById('osc-two-gain');
  oscTwoGain.addEventListener("change", function () {
    var oscTwoGainNumber = parseFloat(oscTwoGain.value.match(/[\d\.]+/));
    osc2Gain = oscTwoGainNumber;
  });

  var gainTarget = document.getElementById('gain-setting');
  gainTarget.addEventListener("change", function () {
    masterGainNode.gain.value = gainTarget.value;
  });

  var octaveUp = document.getElementById("octave-up");
  octaveUp.addEventListener("click", function () {
    if (octave >= 7) {
      octave = 7;
    } else {
      octave = octave + 1;
    }
  });

  var octaveDown = document.getElementById("octave-down");
  octaveDown.addEventListener("click", function () {
    if (octave <= 1) {
      octave = 1;
    } else {
      octave = octave - 1;
    }
  });

  var newDetuneAmount = document.getElementById('detune-settings');
  newDetuneAmount.addEventListener("change", function () {
    detune = parseInt(newDetuneAmount.value);
  });
});

// initial setup

function createNoteTable(octave) {
  var noteFreq = [{}];
  var multiplier = octave;
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

var setup = exports.setup = function setup() {
  var noteFreq = createNoteTable(octave);
  var keyboard = document.createElement("div");
  var keyIds = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74];
  keyboard.id = "keyboard";
  noteFreq.forEach(function (octave) {
    var keyList = Object.keys(octave);
    keyList.forEach(function (note, idx) {
      keyboard.append(createKey(note, octave[note], keyIds[idx]));
    });
  });
  document.getElementById("keyboard-container").innerHTML = keyboard.innerHTML;
};

var activeNotes = {};

function createKey(note, freq, keyId) {
  var keyElement = document.createElement("div");
  keyElement.className = "key";
  if (note.length > 1) {
    $(keyElement).addClass('accidental');
  }
  keyElement.dataset["note"] = note;
  keyElement.dataset["frequency"] = freq;
  keyElement.dataset["keyId"] = keyId;
  keyElement.innerHTML = '<section class=\'key-text\'><p>' + note + '<p><p>' + String.fromCharCode(keyId) + '</p></section>';
  var fired = false;
  var oscs = void 0;
  $(document).on("keydown", function (e) {
    var key = $("div[data-key-id = " + e.keyCode + "]");
    if (key.length === 0) {
      return null;
    }
    key.addClass('red');
    if (activeNotes[e.keyCode]) return null;
    oscs = playTone($(key[0]).attr("data-frequency"));
    activeNotes[e.keyCode] = oscs;
    if (!oscs) return null;
  });
  $(document).on('keyup', function (e) {
    if (!oscs) return null;
    var toStop = activeNotes[e.keyCode];
    $("div[data-key-id = " + e.keyCode + "]").removeClass('red');
    if (!toStop) return null;
    toStop.forEach(function (osc, idx) {
      osc.stop();
    });
    activeNotes[e.keyCode] = null;
  });
  return keyElement;
}

//connect oscillators nodes to all tuna.js nodes
function connectNodes(osc, osc2) {
  oscVolume.gain.value = oscGain;
  osc2Volume.gain.value = osc2Gain;
  var initialValue = envelope.gain.setValueAtTime(0, _audioCtx2.default.currentTime);
  envelope.gain.linearRampToValueAtTime(1, _audioCtx2.default.currentTime + attack / 1000);
  envelope.gain.linearRampToValueAtTime(sustain, _audioCtx2.default.currentTime + decay / 1000);
  osc.connect(oscVolume);
  oscVolume.connect(envelope);
  osc2.connect(osc2Volume);
  osc2Volume.connect(envelope);
  envelope.connect(_tuna.filter);
  _tuna.filter.connect(masterGainNode);
  masterGainNode.connect(_tuna.delay);
  _tuna.delay.connect(_tuna.phaser);
  _tuna.phaser.connect(_tuna.overdrive);
  _tuna.overdrive.connect(_tuna.convolver);
  _tuna.convolver.connect(_oscilloscope.analyser);
  _oscilloscope.analyser.connect(_audioCtx2.default.destination);
  return null;
}

function playTone(freq) {
  if (!freq) return null;
  var osc = _audioCtx2.default.createOscillator();
  var osc2 = _audioCtx2.default.createOscillator();
  connectNodes(osc, osc2);
  osc.type = type;
  osc2.type = type2;
  osc.detune.value = detune * 5;
  osc2.detune.value = -detune * 5;
  var number = parseFloat(freq.match(/[\d\.]+/));
  osc.frequency.value = number * octave;
  osc2.frequency.value = number * octave;
  osc.start();
  osc2.start();
  return [osc, osc2];
}

document.addEventListener("DOMContentLoaded", function () {
  setup();
  (0, _oscilloscope.draw)();
});

/***/ }
/******/ ]);
//# sourceMappingURL=my_synth.js.map