import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "janseva-secret-key";

// Database Setup
const db = new Database("janseva.db");

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' -- 'user', 'department', 'admin'
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    lat REAL,
    lng REAL,
    category TEXT,
    department TEXT,
    priorityScore REAL,
    priorityLevel TEXT,
    deadline TEXT,
    isDuplicate INTEGER DEFAULT 0,
    duplicateOf INTEGER,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Resolved'
    createdBy INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (createdBy) REFERENCES users(id)
  );
`);

const app = express();
app.use(express.json());

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- API Routes ---

// Auth
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const info = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(name, email, hashedPassword, role || "user");
    res.json({ id: info.lastInsertRowid });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

// Complaints
app.post("/api/complaints", authenticate, upload.single("image"), async (req: any, res: any) => {
  const { title, description, lat, lng } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const userId = req.user.id;

  // AI Logic: Category Detection (Keyword-based as requested)
  let category = "General";
  let department = "General Administration";
  const desc = description.toLowerCase();
  if (desc.includes("pothole") || desc.includes("road")) {
    category = "Road";
    department = "Road Department";
  } else if (desc.includes("garbage") || desc.includes("trash") || desc.includes("waste")) {
    category = "Garbage";
    department = "Garbage Department";
  } else if (desc.includes("water") || desc.includes("leak")) {
    category = "Water";
    department = "Water Department";
  } else if (desc.includes("drain") || desc.includes("sewage")) {
    category = "Drainage";
    department = "Drainage Department";
  } else if (desc.includes("light") || desc.includes("street light")) {
    category = "Electrical";
    department = "Electrical Department";
  }

  // AI Logic: Duplicate Detection (Simple string similarity for MVP)
  const existingComplaints: any[] = db.prepare("SELECT id, description FROM complaints").all();
  let isDuplicate = 0;
  let duplicateOf = null;
  for (const comp of existingComplaints) {
    // Simple similarity check (could be improved with Gemini)
    if (comp.description.toLowerCase() === desc) {
      isDuplicate = 1;
      duplicateOf = comp.id;
      break;
    }
  }

  // AI Logic: Priority Scoring
  // Priority Score = (ComplaintCount × 0.4) + (TimePending × 0.3) + (AreaWeight × 0.3)
  // For MVP, we'll simplify: ComplaintCount = 1 (new), TimePending = 0, AreaWeight = 0.5 (default)
  const complaintCount = 1;
  const timePending = 0;
  const areaWeight = 0.5;
  const priorityScore = (complaintCount * 0.4 + timePending * 0.3 + areaWeight * 0.3) * 100;
  
  let priorityLevel = "Low";
  let deadlineDays = 7;
  if (priorityScore >= 80) {
    priorityLevel = "Critical";
    deadlineDays = 1;
  } else if (priorityScore >= 60) {
    priorityLevel = "High";
    deadlineDays = 2;
  } else if (priorityScore >= 40) {
    priorityLevel = "Medium";
    deadlineDays = 4;
  }

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + deadlineDays);

  try {
    const info = db.prepare(`
      INSERT INTO complaints (title, description, image, lat, lng, category, department, priorityScore, priorityLevel, deadline, isDuplicate, duplicateOf, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, image, lat, lng, category, department, priorityScore, priorityLevel, deadline.toISOString(), isDuplicate, duplicateOf, userId);
    
    res.json({ id: info.lastInsertRowid, category, department, priorityLevel, isDuplicate });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/complaints", authenticate, (req: any, res) => {
  let complaints;
  if (req.user.role === "admin") {
    complaints = db.prepare("SELECT * FROM complaints ORDER BY createdAt DESC").all();
  } else if (req.user.role === "department") {
    // In a real app, we'd map users to departments. For MVP, we'll assume the user's name is the department name or similar.
    // Let's just show all for now or filter by a query param if needed.
    complaints = db.prepare("SELECT * FROM complaints ORDER BY priorityScore DESC").all();
  } else {
    complaints = db.prepare("SELECT * FROM complaints WHERE createdBy = ? ORDER BY createdAt DESC").all(req.user.id);
  }
  res.json(complaints);
});

app.patch("/api/complaints/:id/status", authenticate, (req: any, res) => {
  const { status } = req.body;
  if (req.user.role !== "admin" && req.user.role !== "department") {
    return res.status(403).json({ error: "Forbidden" });
  }
  db.prepare("UPDATE complaints SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ success: true });
});

app.get("/api/complaints/heatmap", (req, res) => {
  const complaints = db.prepare("SELECT lat, lng, category FROM complaints").all();
  res.json(complaints);
});

app.get("/api/analytics", authenticate, (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  
  const deptStats = db.prepare("SELECT department, COUNT(*) as count FROM complaints GROUP BY department").all();
  const catStats = db.prepare("SELECT category, COUNT(*) as count FROM complaints GROUP BY category").all();
  const statusStats = db.prepare("SELECT status, COUNT(*) as count FROM complaints GROUP BY status").all();
  const priorityStats = db.prepare("SELECT priorityLevel, COUNT(*) as count FROM complaints GROUP BY priorityLevel").all();
  
  res.json({ deptStats, catStats, statusStats, priorityStats });
});

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
