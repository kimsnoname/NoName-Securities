import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = 4000;

// Create __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'src/view/post')));

// Create uploads directory if not exists
const createDirectories = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { boardId, postId } = req.body;
    const dir = path.join(__dirname, 'src/view/post', String(boardId), String(postId));
    createDirectories(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

app.post('/upload', upload.single('file'), (req, res) => {
  const { boardId, postId } = req.body;
  const filePath = path.join('src', 'view', 'post', String(boardId), String(postId), req.file.filename);
  res.json({ url: `/uploads/${String(boardId)}/${String(postId)}/${req.file.filename}` });
});

app.post('/posts', upload.none(), (req, res) => {
  const { id, title, author, date, content, views, comments, boardId } = req.body;
  const postId = String(id);
  const postDir = path.join(__dirname, 'src/view/post', String(boardId), postId);
  createDirectories(postDir);

  const postContent = {
    id,
    title,
    author,
    date,
    content,
    views,
    comments: comments ? JSON.parse(comments) : [],
  };

  fs.writeFileSync(path.join(postDir, 'post.json'), JSON.stringify(postContent, null, 2));

  res.status(201).json(postContent);
});

app.get('/posts', (req, res) => {
  const allPosts = [];
  const baseDir = path.join(__dirname, 'src/view/post');

  fs.readdirSync(baseDir).forEach((boardId) => {
    const boardDir = path.join(baseDir, boardId);
    fs.readdirSync(boardDir).forEach((postId) => {
      const postDir = path.join(boardDir, postId);
      const postFile = path.join(postDir, 'post.json');
      if (fs.lstatSync(postFile).isFile()) {
        const postContent = fs.readFileSync(postFile);
        allPosts.push(JSON.parse(postContent));
      }
    });
  });

  res.json(allPosts);
});

app.get('/posts/:boardId', (req, res) => {
  const { boardId } = req.params;
  const boardDir = path.join(__dirname, 'src/view/post', String(boardId));

  if (!fs.existsSync(boardDir)) {
    return res.status(404).json({ message: 'Board not found' });
  }

  const boardPosts = [];
  fs.readdirSync(boardDir).forEach((postId) => {
    const postDir = path.join(boardDir, postId);
    const postFile = path.join(postDir, 'post.json');
    if (fs.lstatSync(postFile).isFile()) {
      const postContent = fs.readFileSync(postFile);
      boardPosts.push(JSON.parse(postContent));
    }
  });

  res.json(boardPosts);
});

app.get('/posts/:boardId/:postId', (req, res) => {
  const { boardId, postId } = req.params;
  const postDir = path.join(__dirname, 'src/view/post', String(boardId), String(postId));

  if (!fs.existsSync(postDir)) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const postFile = path.join(postDir, 'post.json');
  if (fs.lstatSync(postFile).isFile()) {
    const postContent = fs.readFileSync(postFile);
    res.json(JSON.parse(postContent));
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.delete('/posts/:boardId/:postId', (req, res) => {
  const { boardId, postId } = req.params;
  const postDir = path.join(__dirname, 'src/view/post', String(boardId), String(postId));

  if (fs.existsSync(postDir)) {
    fs.rmSync(postDir, { recursive: true, force: true });
    res.status(200).json({ message: 'Post deleted successfully' });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Notice routes
const noticeDir = path.join(__dirname, 'src/view/notice');
createDirectories(noticeDir);

app.post('/notices', (req, res) => {
  const { id, title, author, date, content, views, comments } = req.body;
  const noticeId = String(id);
  const noticeContent = {
    id,
    title,
    author,
    date,
    content,
    views,
    comments: comments ? JSON.parse(comments) : [],
  };

  fs.writeFileSync(path.join(noticeDir, `${noticeId}.json`), JSON.stringify(noticeContent, null, 2));
  res.status(201).json(noticeContent);
});

app.get('/notices', (req, res) => {
  const allNotices = [];
  fs.readdirSync(noticeDir).forEach((file) => {
    const noticeFile = path.join(noticeDir, file);
    if (fs.lstatSync(noticeFile).isFile()) {
      const noticeContent = fs.readFileSync(noticeFile);
      allNotices.push(JSON.parse(noticeContent));
    }
  });

  res.json(allNotices);
});

app.get('/notices/:id', (req, res) => {
  const { id } = req.params;
  const noticeFile = path.join(noticeDir, `${id}.json`);

  if (!fs.existsSync(noticeFile)) {
    return res.status(404).json({ message: 'Notice not found' });
  }

  const noticeContent = fs.readFileSync(noticeFile);
  res.json(JSON.parse(noticeContent));
});

app.delete('/notices/:id', (req, res) => {
  const { id } = req.params;
  const noticeFile = path.join(noticeDir, `${id}.json`);

  if (fs.existsSync(noticeFile)) {
    fs.unlinkSync(noticeFile);
    res.status(200).json({ message: 'Notice deleted successfully' });
  } else {
    res.status(404).json({ message: 'Notice not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
