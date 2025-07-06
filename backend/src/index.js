import express from "express"
import { authrouter } from "./routes/auth.route.js";
import dotenv from 'dotenv';
import { connet_db } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messagerouter from "./routes/message.route.js";
import cors from 'cors'
import { app ,server,io} from "./lib/socket.js";
dotenv.config();

const port = process.env.PORT

app.use(express.json())
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use('/auth',authrouter)
app.use('/message',messagerouter)
server.listen(port,()=>{
    connet_db()
})