import { testInput } from './testInput';
import { webmFixDuration } from '../src';

// @ts-ignore
const fixWebmDuration = require('./old');

function readBlob(blob: Blob): Promise<ArrayBuffer> {
  return new Promise(resolve => {
    var fileReader = new FileReader();
    fileReader.addEventListener('loadend', () => {
      resolve(fileReader.result as ArrayBuffer);
    });
    fileReader.readAsArrayBuffer(blob);
  });
}

const promiseFixWebmDuration = (
  blob: Blob,
  duration: number
): Promise<Blob> => {
  return new Promise<Blob>((resolve, reject) => {
    fixWebmDuration(blob, duration, (blob: Blob) => resolve(blob));
  });
};

jest.setTimeout(500000);

describe('webm-fix-duration', () => {
  it('matches the output with upstream', async () => {
    const blobA = new Blob([new Uint8Array(testInput)]);
    const blobB = new Blob([new Uint8Array(testInput)]);

    const outA = await webmFixDuration(blobA, 1);
    const outB = await promiseFixWebmDuration(blobB, 1);

    const abA = await readBlob(outA);
    const abB = await readBlob(outB);
    expect(new Uint8Array(abA)).toEqual(new Uint8Array(abB));
  });
});
