import { Router } from 'express';
import upload from '../middlewares/multer';
import { convertPdfsToHtml } from '../controllers/pdf2html.Conteroller';



const router = Router();

// Route for PDF to HTML conversion
router.post('/convert-pdf2html', upload.array('files'), convertPdfsToHtml);

export default router;
