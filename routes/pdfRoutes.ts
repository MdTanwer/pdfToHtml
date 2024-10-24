import { Router } from 'express';
import upload from '../middlewares/multermiddlewares';
import { convertPdfToHtmll } from '../controllers/pdfConteroller';

const router = Router();

// Route for PDF to HTML conversion
router.post('/convert', upload.single('file'), convertPdfToHtmll);

export default router;

