import express from 'express'
import cors from 'cors'; // ✅ This is correct in ESM

import  'dotenv/config';
import connectDB from './configs/db.js';
import morgan from 'morgan';


import { clerkMiddleware } from '@clerk/express'
// import { clerkExpressWithAuth } from '@clerk/express';
// import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';

const PORT = 3003;
const app=express()

await connectDB()

//middleware


app.use(express.json())
app.use(cors())
app.use(morgan('dev')) // ✅ This is correct in ESM

app.use(clerkMiddleware())
// app.use(clerkExpressWithAuth()); // ✅ Enables req.auth()


// api routes 
app.get("/" , (req , res) => res.send('server is live'))

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/show" ,showRouter)

app.use('/api/booking', bookingRouter)
 
app.use('/api/admin', adminRouter);

app.use('/api/user', userRouter);

app.listen(PORT ,()=>{
    console.log(`you are at at http:// localhost:${PORT}`)
})

// export default app; // ✅ this is required by Vercel
