import * as fs from 'fs';
import * as path from 'path';
import { PDF } from '../src/app';

describe('PDF Parsing', () => {
  it('should parse a local PDF', async () => {
    // Read the PDF into a buffer
    const pdfPath = path.join(__dirname, './resources/fw4.pdf');
    const dataBuffer = fs.readFileSync(pdfPath);

    // Convert the Buffer to a Uint8Array
    const uint8Array = new Uint8Array(dataBuffer);

    // Parse the PDF
    const result = await PDF(uint8Array);

    console.log({
      result,
    });

    // Perform your assertions
    expect(result.numpages).toBeGreaterThan(0);
    expect(result.text).toBeDefined();
  });
});
