import { Router } from 'express';
import upload from '../middlewares/multermiddlewares';
import { convertPdfToHtml } from '../controllers/pdfConteroller';


const router = Router();

// Route for PDF to HTML conversion
router.post('/convert-pdf2html', upload.single('file'), convertPdfToHtml);

export default router;
