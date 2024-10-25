import { Router } from 'express';
import { convertPdfToHtml } from '../controllers/pdfConteroller';
import upload from '../middlewares/multermiddlewares';

const router = Router();

// Route for PDF to HTML conversion
router.post('/convert-pdf2html',  upload.single('file'), convertPdfToHtml);

export default router;

