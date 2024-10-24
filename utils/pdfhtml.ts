const pdf2html = require('pdf2html');

export const convertPdfToHtml = (pdfPath: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    pdf2html.html(pdfPath, (err:any, html:any) => {
      if (err) reject(err);
      else resolve(html);
    });
  });
};




