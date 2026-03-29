import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

async function ocrImage(filePath: string): Promise<string> {
  const { data } = await Tesseract.recognize(filePath, 'eng', {
    logger: () => undefined,
  });
  return data.text || '';
}

async function readPdf(filePath: string): Promise<string> {
  const pdfParse: any = require('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  const parsed = await pdfParse(buffer);
  return parsed.text?.trim() || '';
}

export async function extractDocumentText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt' || ext === '.md') {
    return fs.readFileSync(filePath, 'utf8');
  }

  if (ext === '.pdf') {
    return readPdf(filePath);
  }

  if (ext === '.docx') {
    const out = await mammoth.extractRawText({ path: filePath });
    return out.value || '';
  }

  if (['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'].includes(ext)) {
    return ocrImage(filePath);
  }

  throw new Error(`Unsupported file type for OCR/context ingestion: ${ext}`);
}
