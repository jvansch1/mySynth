import { convolver } from './tuna.js';

document.addEventListener("DOMContentLoaded", () => {


    let newReverbAmount = document.getElementById('reverb-wet-slider')
    newReverbAmount.addEventListener("change", () => {
      let newReverbNumber = parseFloat(newReverbAmount.value.match(/[\d\.]+/));
      convolver.wet.gain.value = newReverbNumber;
    })

    let newStatus = document.getElementById('reverb-toggle')
    newStatus.addEventListener("click", () => {
      if (newStatus.checked) {
        convolver.bypass = 0;
      }
      else {
        convolver.bypass = 1;
      }
    })

})
