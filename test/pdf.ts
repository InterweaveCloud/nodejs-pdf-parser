import * as fs from 'fs';
import * as path from 'path';
import { PDF } from '../src/app';

async function main() {
  const pdfPath = path.join(__dirname, './resources/fw4.pdf');
  const dataBuffer = fs.readFileSync(pdfPath);

  // Convert the Buffer to a Uint8Array
  const uint8Array = new Uint8Array(dataBuffer);

  // Parse the PDF
  const result = await PDF(uint8Array);

  console.log({
    result,
  });
}

main();
