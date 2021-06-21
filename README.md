<h1 align="center">webm-fix-duration</h1>

<p align="center">
A fork of [fix-webm-duration](https://github.com/yusitnikov/fix-webm-duration), adding TypeScript and Promise support.
</p>

<p align="center">
<img alt="workflow" src="https://img.shields.io/github/workflow/status/mat-sz/webm-fix-duration/Node.js%20CI%20(yarn)">
<a href="https://npmjs.com/package/webm-fix-duration">
<img alt="npm" src="https://img.shields.io/npm/v/webm-fix-duration">
<img alt="npm" src="https://img.shields.io/npm/dw/webm-fix-duration">
<img alt="NPM" src="https://img.shields.io/npm/l/webm-fix-duration">
</a>
</p>

`navigator.mediaDevices.getUserMedia` + `MediaRecorder` create WEBM files without duration metadata.

This library appends missing metadata section right to the file blob.

## Usage

The library exports a `webmFixDuration` function of the following signature:

```ts
function webmFixDuration(
  blob: Blob,
  duration: number,
  type = 'video/webm'
): Promise<Blob>;
```

with:

- `blob: Blob` being the output from MediaRecorder,
- `duration: number` being duration in **milliseconds**,

and returning a Promise, which will be resolved with a Blob object with fixed duration.

If duration is already present, the function will return an unmodified Blob.

## Example

```ts
import { webmFixDuration } from 'webm-fix-duration';

let mediaRecorder: MediaRecorder | undefined;
let mediaParts: Blob = [];
let startTime: number = 0;

function startRecording(stream: MediaStream, options: any) {
  mediaParts = [];
  mediaRecorder = new MediaRecorder(stream, options);
  mediaRecorder.onstop = async () => {
    const duration = Date.now() - startTime;
    const buggyBlob = new Blob(mediaParts, { type: 'video/webm' });

    const fixedBlob = await webmFixDuration(buggyBlob, duration);
    displayResult(fixedBlob);
  };
  mediaRecorder.ondataavailable = event => {
    const data = event.data;
    if (data && data.size > 0) {
      mediaParts.push(data);
    }
  };
  mediaRecorder.start();
  startTime = Date.now();
}

function stopRecording() {
  mediaRecorder.stop();
}

function displayResult(blob: Blob) {
  // ...
}
```

**Note:** this example **is not** a `MediaRecorder` usage guide.
