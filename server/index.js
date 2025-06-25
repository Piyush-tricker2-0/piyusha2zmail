import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

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

app.listen(3000, () => console.log("Server started on port 3000"));
