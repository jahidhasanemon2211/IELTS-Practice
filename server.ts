import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`[SERVER_REQ] ${req.method} ${req.url}`);
    next();
  });

  // Setup local data storage
  const storageDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const dbFile = path.join(process.cwd(), 'database.json');
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ tests: [], results: [] }, null, 2));
  }

  function getDb() {
    return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  }
  function saveDb(data: any) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
  }

  // File upload configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, storageDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
      cb(null, uniqueName);
    }
  });
  const upload = multer({ storage: storage });

  // Serve uploaded files statically
  app.use('/uploads', express.static(storageDir));

  // --- API Endpoints ---
  app.post('/api/admin/login', (req, res) => {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;
    if (username === 'emon' && password === 'emon@123') {
      res.json({ success: true, token: 'secret_admin_token' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

  const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const auth = req.headers.authorization;
    if (auth === 'Bearer secret_admin_token') {
      next();
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  };

  // Tests Endpoints
  app.get('/api/tests', (req, res) => {
    const { type } = req.query;
    const db = getDb();
    if (type) {
      res.json(db.tests.filter((t: any) => t.type === type));
    } else {
      res.json(db.tests);
    }
  });

  app.post('/api/tests', authMiddleware, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), (req, res) => {
    const { title, type } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const thumbnail = files['thumbnail']?.[0];
    const pdf = files['pdf']?.[0];
    
    if (!thumbnail || !pdf || !title || !type) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const db = getDb();
    const newTest = {
      id: Date.now().toString(),
      title,
      type, // 'ielts' or 'next-prep'
      thumbnailUrl: `/uploads/${thumbnail.filename}`,
      pdfUrl: `/uploads/${pdf.filename}`,
      createdAt: new Date().toISOString()
    };
    
    db.tests.unshift(newTest);
    saveDb(db);
    res.json({ success: true, data: newTest });
  });

  // Results Endpoints
  app.get('/api/results', (req, res) => {
    const db = getDb();
    res.json(db.results);
  });

  app.post('/api/results', authMiddleware, (req, res) => {
    const { testName, date, studentName, score } = req.body;
    
    if (!testName || !date || !studentName || !score) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const db = getDb();
    const newResult = {
      id: Date.now().toString(),
      testName,
      date,
      studentName,
      score,
      createdAt: new Date().toISOString()
    };
    
    db.results.unshift(newResult);
    saveDb(db);
    res.json({ success: true, data: newResult });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production / static file serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
