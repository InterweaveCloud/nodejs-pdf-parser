import * as pdfjsLib from 'pdfjs-dist';

interface RenderOptions {
  normalizeWhitespace: boolean;
  disableCombineTextItems: boolean;
}

interface Options {
  pagerender: (page: pdfjsLib.PDFPageProxy) => Promise<string>;
  max: number;
}

interface PDFResult {
  numpages: number;
  numrender: number;
  info: any;
  metadata: any;
  text: string;
  version: string | null;
}

const DEFAULT_OPTIONS: Options = {
  pagerender: render_page,
  max: 0,
};

// Type guard for TextItem

export async function render_page(
  page: pdfjsLib.PDFPageProxy,
): Promise<string> {
  const textContent = await page.getTextContent();
  let text = '';
  for (const item of textContent.items) {
    const anyItem: any = item; // Type assertion here
    text += '\n' + anyItem.str;
  }
  return text;
}

export async function PDF(dataBuffer: ArrayBuffer): Promise<PDFResult> {
  const ret: PDFResult = {
    numpages: 0,
    numrender: 0,
    info: null,
    metadata: null,
    text: '',
    version: null,
  };

  const { max, pagerender } = DEFAULT_OPTIONS;

  const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
  const pdf = await loadingTask.promise;

  ret.numpages = pdf.numPages;

  const metaData = await pdf.getMetadata().catch(() => null);

  ret.info = metaData?.info || null;
  ret.metadata = metaData?.metadata || null;

  let counter = max <= 0 ? pdf.numPages : max;
  counter = counter > pdf.numPages ? pdf.numPages : counter;

  ret.text = '';

  for (let i = 1; i <= counter; i++) {
    const page = await pdf.getPage(i);
    const pageText = await pagerender(page).catch(() => '');

    // Check if the page text is not empty
    if (pageText.trim() !== '') {
      ret.text = `${ret.text}\n\n${pageText}`;
    }
    console.log(`Processed page ${i}`);
    console.log(`Page Text: ${pageText}`);
  }

  ret.numrender = counter;

  return ret;
}

export default PDF;
