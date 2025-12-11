const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../uploads")),
  filename: (req, file, cb) => {
    const safeName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "video/mp4"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF and MP4 allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// ========================
// 1) Upload (auth required)
// ========================
router.post("/upload", auth, upload.single("file"), (req, res) => {
  const { privacy } = req.body;

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  if (!["public", "private"].includes(privacy))
    return res.status(400).json({ error: "Invalid privacy value" });

  const shareToken =
    privacy === "private" ? crypto.randomBytes(16).toString("hex") : null;

  db.run(
    `INSERT INTO files (filename, path, size, privacy, uploaded_by, share_token)
     VALUES (?,?,?,?,?,?)`,
    [
      req.file.originalname,
      req.file.filename,
      req.file.size,
      privacy,
      req.user.id,
      shareToken,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: "DB error" });

      res.json({
        message: "Uploaded",
        fileId: this.lastID,
        shareLink: shareToken ? `/api/files/private/${shareToken}` : null,
      });
    }
  );
});

// =====================================
// 2) Public listing (everyone can see)
// =====================================
router.get("/public-files", (req, res) => {
  db.all(
    `SELECT id, filename, size, uploaded_at 
     FROM files 
     WHERE privacy='public'
     ORDER BY uploaded_at DESC`,
    [],
    (err, rows) => res.json(rows || [])
  );
});

// ======================================
// 3) My files listing (auth required)
// ======================================
router.get("/my-files", auth, (req, res) => {
  db.all(
    `SELECT id, filename, size, privacy, uploaded_at, share_token 
     FROM files 
     WHERE uploaded_by=?`,
    [req.user.id],
    (err, rows) => res.json(rows || [])
  );
});

// ======================================================
// 4) Download by id (auth required; public or owner)
// ======================================================
// Download by id (auth required; public or owner)
// ALSO logs download into downloads table
router.get("/files/:id/download", auth, (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM files WHERE id=?", [id], (err, file) => {
    if (!file) return res.status(404).json({ error: "Not found" });

    if (file.privacy === "private" && file.uploaded_by !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    // ✅ log this download event
    db.run(
      "INSERT INTO downloads (file_id, downloaded_by) VALUES (?, ?)",
      [file.id, req.user.id]
    );

    const fullPath = path.join(__dirname, "../../uploads", file.path);
    res.download(fullPath, file.filename);
  });
});


// ======================================================
// 5) Download PUBLIC file by id (no auth needed)
// ======================================================
router.get("/public/:id/download", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM files WHERE id=?", [id], (err, file) => {
    if (!file) return res.status(404).json({ error: "Not found" });

    if (file.privacy !== "public")
      return res.status(403).json({ error: "Not a public file" });

    const fullPath = path.join(__dirname, "../../uploads", file.path);
    res.download(fullPath, file.filename);
  });
});

// ======================================================
// 6) Download private via share token (opens inline)
// ======================================================
router.get("/files/private/:token", (req, res) => {
  const token = req.params.token;

  db.get("SELECT * FROM files WHERE share_token=?", [token], (err, file) => {
    if (!file) return res.status(404).send("Invalid link");

    const fullPath = path.join(__dirname, "../../uploads", file.path);

    // Open in browser instead of forced download:
    res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);
    res.sendFile(fullPath);
  });
});

// Get logged-in user's download history
router.get("/my-downloads", auth, (req, res) => {
  db.all(
    `
    SELECT 
      d.id as download_id,
      d.downloaded_at,
      f.id as file_id,
      f.filename,
      f.size,
      f.privacy,
      u.username as uploader
    FROM downloads d
    JOIN files f ON d.file_id = f.id
    JOIN users u ON f.uploaded_by = u.id
    WHERE d.downloaded_by = ?
    ORDER BY d.downloaded_at DESC
    `,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(rows || []);
    }
  );
});

// ========================
// 7) Delete (owner only)
// ========================
router.delete("/files/:id", auth, (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM files WHERE id=?", [id], (err, file) => {
    if (!file) return res.status(404).json({ error: "Not found" });
    if (file.uploaded_by !== req.user.id)
      return res.status(403).json({ error: "Not your file" });

    const fullPath = path.join(__dirname, "../../uploads", file.path);

    fs.unlink(fullPath, () => {
      db.run("DELETE FROM files WHERE id=?", [id], () =>
        res.json({ message: "Deleted" })
      );
    });
  });
});

module.exports = router;
