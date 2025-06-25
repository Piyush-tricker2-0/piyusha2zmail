// server/index.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

// Required for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, "../client"))); // Serve frontend

// Temp Mail APIs
app.get("/generate", (req, res) => {
  const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  let name = "";
  for (let i = 0; i < 10; i++) name += chars[Math.floor(Math.random() * chars.length)];
  const domain = "1secmail.com";
  res.json({ email: `${name}@${domain}`, login: name, domain });
});

app.get("/inbox", async (req, res) => {
  const { login, domain } = req.query;
  const inbox = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
  res.json(await inbox.json());
});

app.get("/read", async (req, res) => {
  const { login, domain, id } = req.query;
  const msg = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
  res.json(await msg.json());
});

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
