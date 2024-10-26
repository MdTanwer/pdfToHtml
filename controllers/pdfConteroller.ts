import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import ErrorHandler from '../utils/ErrorHandler';


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

// Renamed function to convert PDF to HTML
export const convertPdfToHtml = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pdfPath =  req.file?.buffer;
    console.log( "pdf file path" ,pdfPath)
    

    if (!pdfPath) {
      return next(new ErrorHandler("filePath not found", 400));
    }

         // Create a temporary file for the PDF buffer
         const tempPdfPath = path.join(os.tmpdir(), `${uuidv4()}.pdf`);
         await fs.promises.writeFile(tempPdfPath, pdfPath);
        // Generate a unique name for the output HTML file
        const htmlFileName = `${uuidv4()}.html`;
    
  
    // Quote paths to handle special characters properly
    const quotedPdfPath = quoteFilePath(tempPdfPath);
    const quotedHtmlFilePath = quoteFilePath(htmlFileName);
    const quotedHtmlDir = quoteFilePath(HTML_DIR);

    // Command to convert PDF to HTML using pdf2htmlEX
    const command = `pdf2htmlEX --dest-dir ${quotedHtmlDir} ${quotedPdfPath} ${quotedHtmlFilePath}`;

    // Execute the conversion command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return next(new ErrorHandler(error.message, 400));
      }

      console.log('Conversion result:', stdout || stderr);

      const htmlUrl = `${req.protocol}://${req.get('host')}/html/${htmlFileName}`;
      res.json({ url: htmlUrl });
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
};




