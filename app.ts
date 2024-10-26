import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import pdfRoutes from './routes/pdf2html.routes';
const app = express();
const PORT = process.env.PORT || 9000;

// app.use(cors());

// Define the directory to serve static HTML files
const HTML_DIR = path.join(__dirname, 'public', 'html');

// Serve static files from the 'public/html' directory
app.use('/html', express.static(HTML_DIR));
const htmlDir = path.join(__dirname, 'public', 'html');
if (!fs.existsSync(htmlDir)) {
  fs.mkdirSync(htmlDir, { recursive: true });
}

app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Node.js!');
});
app.use('/api/v1', pdfRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

