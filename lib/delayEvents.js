import { delay } from './tuna.js'

document.addEventListener("DOMContentLoaded", () => {
  let newDelayTime = document.getElementById('delay-slider');

  newDelayTime.addEventListener("change", (e) => {
    debugger
    let newDelayNumber = parseFloat(newDelayTime.value.match(/[\d\.]+/))
    delay.delayTime.value = newDelayNumber;
  });

  let newWet = document.getElementById('delay-wet-slider')

  newWet.addEventListener("change", () => {
    let newWetNumber = parseFloat(newWet.value.match(/[\d\.]+/))
    delay.wet.gain.value = newWetNumber;
  })

  let newStatus = document.getElementById('delay-toggle')
  newStatus.addEventListener('click', () => {
    if (newStatus.checked) {
      delay.bypass = false;
    }
    else {
      delay.bypass = true
    }
  })

  let newFeedbackTime = document.getElementById('delay-feedback-slider')
  newFeedbackTime.addEventListener('change', () => {
    let newFeedbackNumber = parseFloat(newFeedbackTime.value.match(/[\d\.]+/))
    delay.feedback.value = newFeedbackNumber;
  })


});
