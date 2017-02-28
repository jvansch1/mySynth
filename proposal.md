#JavaScript Project Proposal: MySynth digital sythesizer

##Overview

MySynth is a digital single-oscillator synthesizer which is fully functional as a musical instrument. Users will be able to use a musical keyboard to send through MIDI signals which will interact with mySynth. Users can also affect the synthesizers filter, LFO and add effects to truly craft their own unique sounds. mySynth includes a visual representation of the current sound wave so the user can see the effect their action has on the physical audio wave.

## Functionality and MVP
* Send input through computer or MIDI keyboard
* Select between sin, square, and sawtooth waveforms
* presets so that users can see the power of MySynth
* Alter settings in real-time to see how they affect sounds and waveform



##Wireframes

![synth](mySynth.png)


## Architecture and Technologies

mySynth makes use of the following technologies:

* JavaScript Web Audio API
* JavaScript Web MIDI API
* HTML5 Canvas and Easel.js
* Webpack


## Implementation Timeline

Day 1:

Setup all necessary node modules. Create webpack.config.js as well as package.json.
Learn enough about Web Audio Api to be able to setup an audio context and be able to generate an oscillator audio node.

Day 2:

Dedicate this day to learning how Web MIDI Api functions. Be able to send a midi signal using an external keyboard and have Web Audio Api's audio context be able to receive the message.

Day 3:

Use Javascript event handlers and HTML Canvas to add controls which allow user to change settings/add effects
to base oscillator.

Day 4: Add visual oscilloscope using HTML Canvas
