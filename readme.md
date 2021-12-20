## DawPCM 1-bit DPCM editor

### Overview

DawPCM is a simple DAW-like environment for editing and instantly previewing  [NES-style 1-bit DPCM audio.](https://wiki.nesdev.org/w/index.php/APU_DMC "NES-style 1-bit DPCM audio.")

It is written in vanilla JavaScript and should work on any browser supporting the Web Audio API.

It aims to improve the usual workflow used in creating these samples, which would involve modifying them in a standalone DAW, exporting as .wav, importing into a DPCM conversion tool and then repeating this lengthy process several times.

### Available effects

DawPCM currently features the following effects:
-  Basic compressor
- Basic IIR filters.
- Waveshaping distortion.
- Naive brickwall limiter implementation.
- Old-school/Skips samples/aliases like heck-style repitching effect
- General-purpose variable gain.

Several effects chains can be active in parallel simultaneously, making processes such as parallel compression and multi-band compression possible.

### Keyboard shortcuts

Most of the functionality of the waveform editor is onl available through the use of keyboard shortcuts/combinations. They are as follows:

- Ctrl+Left and Ctrl+Right: Nudge the start of a seletion a sample backwards/forwards.
- Shift+Left and Shift+Right: Nudge the end of a seletion a sample backwards/forwards.
- Left/Right: Nudge the cursor position a sample backwards/forwards.
- Shift+Click: select all samples between cursor and click position.
- Delete: deletes selected samples
- Ctrl+Delete: deletes all but the selected samples
- Ctrl+Z: undo