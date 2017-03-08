import { filter } from './tuna.js';

document.addEventListener('DOMContentLoaded', () => {

    let newCutoff = document.getElementById('filter-cutoff-slider')
    newCutoff.addEventListener("change", () => {
      let newCutoffNumber = parseInt(newCutoff.value)
      debugger
      filter.frequency.value = newCutoffNumber
    })

    let newFilterType = document.getElementById('filter-type-dropdown')
    newFilterType.addEventListener("change", () => {
      $('#filter-type-dropdown').blur();
      filter.filter.type = newFilterType.value;
    })

    let newQ = document.getElementById('filter-Q-slider')
    newQ.addEventListener("change", () => {
      let newQNumber = parseInt(newQ.value)
      filter.Q.value = newQNumber;
    })

    let newGain = document.getElementById('filter-gain-slider')
    newGain.addEventListener("change", () => {
      let newGainNumber = parseFloat(newGain.value.match(/^-?[0-9]+(?:\.[0-9]+)?$/));
      filter.output.gain.value = newGainNumber;
    })

})
