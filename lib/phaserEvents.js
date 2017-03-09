import { phaser } from './tuna.js';

document.addEventListener("DOMContentLoaded", () => {

    let newPhaserDepth = document.getElementById('phaser-depth')

    newPhaserDepth.addEventListener("change", () => {
      let newPhaserDepthNumber = parseFloat(newPhaserDepth.value.match(/[\d\.]+/))
      phaser.depth = newPhaserDepthNumber;
    })


    let newPhaserFeedback = document.getElementById('phaser-feedback')
    newPhaserFeedback.addEventListener("change", () => {
      let newPhaserFeedbackNumber = parseFloat(newPhaserFeedback.value.match(/[\d\.]+/))
      phaser.depth = newPhaserFeedbackNumber;
    })


    let newPhaserRate = document.getElementById('phaser-rate')
    newPhaserRate.addEventListener("change", () => {
      let newPhaserRateNumber = parseFloat(newPhaserRate.value.match(/[\d\.]+/))
      phaser.rate = newPhaserRateNumber;
    })

    let newPhaserStereo = document.getElementById('phaser-stereo')
    newPhaserStereo.addEventListener("change", () => {
      let newPhaserStereoNumber = parseInt(newPhaserStereo.value)
      phaser.stereoPhase = newPhaserStereoNumber;
    })

    let newStatus = document.getElementById('phaser-toggle')
    newStatus.addEventListener('click', () => {
      if (newStatus.checked) {
        phaser.bypass = false;
      }
      else {
        phaser.bypass = true;
      }
    })
})
