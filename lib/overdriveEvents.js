import { overdrive } from './tuna.js';

document.addEventListener("DOMContentLoaded", () => {

    let newDrive = document.getElementById('overdrive-drive-slider')
    newDrive.addEventListener("click", () => {
      let newDriveNumber = parseFloat(newDrive.value.match(/[\d\.]+/));
      overdrive.drive.value = newDriveNumber;
    })


    let newGain = document.getElementById('overdrive-output-slider')
    newGain.addEventListener("change", () => {
      let newGainNumber = parseFloat(newGain.value.match(/[\d\.]+/));
      overdrive.outputGain.value = newGainNumber;
    })

    let newCurve = document.getElementById('overdrive-curve-slider')
    newCurve.addEventListener("change", () => {
      let newCurveNumber = parseFloat(newCurve.value.match(/[\d\.]+/));
      overdrive.curveAmount = newCurveNumber;
    })

    let newType = document.getElementById('drive-type')
    newType.addEventListener("change", () => {
      let newTypeNumber = parseInt(newType)
      debugger
      overdrive.algorithmIndex = newTypeNumber;
    })

    let newStatus = document.getElementById('overdrive-toggle')
    newStatus.addEventListener("click", () => {
      if (newStatus.checked) {
        overdrive.bypass = 0
      }
      else {
        overdrive.bypass = 1;
      }
    })


});
