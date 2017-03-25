# mySynth

## Overview

mySynth is a polyphonic digital synthesizer created using JavaScript. Additional libraries include jQuery, Web Audio API, and Tuna.js.

![mySynth](/mySynth.jpg)

## Web Audio API

The main functionality of mySynth comes from JavaScript's Web Audio API. A jQuery event listener is used to detect keypresses. Each key stores the frequency which should be played upon the activation of the corresponding note. Upon a keypress, two Web Audio API oscillator objects will be created with the appropriate frequency and the note will begin to play. On keyup, these oscillator objects will be destroyed and note will stop.

```

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

```
