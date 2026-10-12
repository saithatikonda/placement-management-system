const pdfParseLib = require('pdf-parse');

/**
 * Parses binary PDF buffer and extracts text and page metadata
 * Compatible with pdf-parse v1.x (function) and v2.x (PDFParse class)
 */
async function parsePdfBuffer(buffer) {
  try {
    let extractedText = '';
    let numPages = 1;

    // Check if pdfParseLib is a class with PDFParse constructor (v2.x)
    if (pdfParseLib.PDFParse && typeof pdfParseLib.PDFParse === 'function') {
      const parser = new pdfParseLib.PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        extractedText = result && result.text ? result.text.trim() : '';
        numPages = result && (result.total || (result.pages ? result.pages.length : 1)) || 1;
      } finally {
        if (typeof parser.destroy === 'function') {
          await parser.destroy();
        }
      }
    } 
    // Check if pdfParseLib is directly callable as a function (v1.x)
    else if (typeof pdfParseLib === 'function') {
      const data = await pdfParseLib(buffer);
      extractedText = data && data.text ? data.text.trim() : '';
      numPages = data && data.numpages ? data.numpages : 1;
    } 
    // Check if default export is callable
    else if (pdfParseLib.default && typeof pdfParseLib.default === 'function') {
      const data = await pdfParseLib.default(buffer);
      extractedText = data && data.text ? data.text.trim() : '';
      numPages = data && data.numpages ? data.numpages : 1;
    } else {
      // Fallback: extract ASCII string content if any stream exists
      const str = buffer.toString('utf8');
      const textMatches = str.match(/\(([^()]+)\)[\s]*Tj/g) || [];
      extractedText = textMatches.map(m => m.replace(/^\(/, '').replace(/\)[\s]*Tj$/, '')).join(' ');
    }

    return {
      success: true,
      numPages: numPages || 1,
      text: extractedText
    };
  } catch (error) {
    console.error('[PDF Parser] Error parsing PDF buffer:', error.message);
    
    // Graceful fallback: text pattern extraction
    try {
      const str = buffer.toString('utf8');
      const textMatches = str.match(/\(([^()]+)\)[\s]*Tj/g) || [];
      const extractedText = textMatches.map(m => m.replace(/^\(/, '').replace(/\)[\s]*Tj$/, '')).join(' ');
      if (extractedText.length > 20) {
        return {
          success: true,
          numPages: 1,
          text: extractedText
        };
      }
    } catch (_) {}

    return {
      success: false,
      error: error.message,
      text: ''
    };
  }
}

async function parseBase64Pdf(base64String) {
  try {
    const cleanBase64 = base64String.replace(/^data:application\/pdf;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    return parsePdfBuffer(buffer);
  } catch (err) {
    return {
      success: false,
      error: err.message,
      text: ''
    };
  }
}

module.exports = {
  parsePdfBuffer,
  parseBase64Pdf
};
