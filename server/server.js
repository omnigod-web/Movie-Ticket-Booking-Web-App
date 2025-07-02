import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';
import connectDB from './configs/db.js';

const PORT = 3003;
const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Connect to DB once per request (best for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(500).send("Database error");
  }
});

app.get('/', (req, res) => res.send('Server is live'));

app.use('/api/inngest', serve({ client: inngest, functions }));

export default app;
