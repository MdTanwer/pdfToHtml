import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import pdfRoutes from './routes/pdfRoutes';
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Node.js!');
});

// app.use(cors());
// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Define the directory to serve static HTML files
const HTML_DIR = path.join(__dirname, 'public', 'html');

// Serve static files from the 'public/html' directory
app.use('/html', express.static(HTML_DIR));
const htmlDir = path.join(__dirname, 'public', 'html');
if (!fs.existsSync(htmlDir)) {
  fs.mkdirSync(htmlDir, { recursive: true });
}
app.use(express.json());
// Routes

app.use('/api/pdf', pdfRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
