import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middlewares/catchAsyncErrors';

// Define the directory to save HTML files
const HTML_DIR = path.join(__dirname, '..', 'public', 'html');

// Ensure the directory exists
if (!fs.existsSync(HTML_DIR)) {
  fs.mkdirSync(HTML_DIR, { recursive: true });
}

// Function to ensure quotes around file paths with special characters
const quoteFilePath = (filePath: string) => {
  return `"${filePath}"`; // Add quotes around the file path
};

// Modified function to convert multiple PDFs to HTML
export const convertPdfsToHtml = CatchAsyncError( async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pdfBuffers = req.files; // Assuming 'files' contains multiple PDFs

    if (!pdfBuffers || !Array.isArray(pdfBuffers) || pdfBuffers.length === 0) {
      return next(new ErrorHandler("No PDF files uploaded", 400));
    }

    const htmlUrls: string[] = [];

    for (const file of pdfBuffers) {
      const pdfBuffer = file.buffer;

      // Create a temporary file for the PDF buffer
      const tempPdfPath = path.join(os.tmpdir(), `${uuidv4()}.pdf`);
      await fs.promises.writeFile(tempPdfPath, pdfBuffer);

      // Generate a unique name for the output HTML file
      const htmlFileName = `${uuidv4()}.html`;

      // Quote paths to handle special characters properly
      const quotedPdfPath = quoteFilePath(tempPdfPath);
      const quotedHtmlFilePath = quoteFilePath(htmlFileName);
      const quotedHtmlDir = quoteFilePath(HTML_DIR);

      // Command to convert PDF to HTML using pdf2htmlEX
      const command = `pdf2htmlEX --dest-dir ${quotedHtmlDir} ${quotedPdfPath} ${quotedHtmlFilePath}`;

      // Execute the conversion command
      await new Promise<void>((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            return reject(new ErrorHandler(error.message, 400));
          }
          // Add the HTML URL to the list
          const htmlUrl = `${req.protocol}://${req.get('host')}/html/${htmlFileName}`;
          htmlUrls.push(htmlUrl);
          resolve();
        });
      });
    }

    // Send response with the list of URLs
    res.json({ urls: htmlUrls });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
}

)