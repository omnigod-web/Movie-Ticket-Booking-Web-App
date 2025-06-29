import express from 'express'
import cors from 'cors'; // ✅ This is correct in ESM

import  'dotenv/config';
import connectDB from './configs/db.js';

import { clerkMiddleware } from '@clerk/express'

const PORT = 3003;
const app=express()

await connectDB()

//middleware

app.use(express.json())
app.use(cors())

app.use(clerkMiddleware())

// api routes 
app.get("/" , (req , res)=> res.send('server is live'))
 


app.listen(PORT ,()=>{
    console.log(`you are at at http:// localhost:${PORT}`)
})