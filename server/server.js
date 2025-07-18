import express from 'express'
import cors from 'cors'; // ✅ This is correct in ESM

import  'dotenv/config';
import connectDB from './configs/db.js';
import morgan from 'morgan';

import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';

const PORT = 3003;
const app=express()

await connectDB()

//middleware


app.use(express.json())
app.use(cors())
app.use(morgan('dev')) // ✅ This is correct in ESM

app.use(clerkMiddleware())

// api routes 
app.get("/" , (req , res) => res.send('server is live'))

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/show" ,showRouter)
 


app.listen(PORT ,()=>{
    console.log(`you are at at http:// localhost:${PORT}`)
})

// export default app; // ✅ this is required by Vercel
