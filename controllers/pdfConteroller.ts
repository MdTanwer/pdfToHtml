import { Request, Response, NextFunction } from 'express';
const  pdf2html = require('pdf2html');
import path from 'path';
import fs from 'fs';

// Define the directory to save HTML files
const HTML_DIR = path.join(__dirname, 'public', 'html');

// Ensure the directory exists
if (!fs.existsSync(HTML_DIR)) {
  fs.mkdirSync(HTML_DIR, { recursive: true });
}

export const convertPdfToHtmll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Ensure that the PDF file path is available
    const pdfPath = req.file?.path;

    if (!pdfPath) {
      res.status(400).json({ error: 'No PDF file provided' });
      return;
    }

    // Convert PDF to HTML using async/await
    const html = await pdf2html.html(pdfPath);

    // Define the output HTML file path
    const htmlFileName = `${Date.now()}.html`; // Unique file name
    const htmlFilePath = path.join(HTML_DIR, htmlFileName);
    console.log(htmlFilePath)

    fs.writeFile(htmlFilePath, html, (writeErr) => {
      if (writeErr) {
        console.error('Error saving HTML file:', writeErr);
        res.status(500).json({ error: 'Failed to save HTML file' });
        return;
      }

      console.log('HTML file saved at:', htmlFilePath);

      // Generate the URL for the saved HTML file
      const htmlUrl = `${req.protocol}://${req.get('host')}/html/${htmlFileName}`;

      // Send the URL as the response
      res.json({ url: htmlUrl });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to HTML' });
  }
};
