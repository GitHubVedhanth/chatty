
import express from 'express'; 
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { app, server } from './lib/socket.js'; 
import { authrouter } from './routes/auth.route.js';
import messagerouter from './routes/message.route.js';
import { connet_db } from './lib/db.js';

const __dirname = path.resolve();
dotenv.config();

const port = process.env.PORT || 8000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  next();
});

app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://chatty-8afs.onrender.com"
  ],
  credentials: true
}));

app.use('/auth', authrouter);
app.use('/message', messagerouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}
app.get('/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

console.log("✅ Dumping all registered routes:");

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    // Routes registered directly on the app
    console.log(middleware.route.path);
  } else if (middleware.name === 'router') {
    // Routes added as router middleware
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(handler.route.path);
      }
    });
  }
});

server.listen(port, () => {
  connet_db();
  console.log(`Server listening on port ${port}`);
});