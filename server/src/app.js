import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app= express();

app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    // credentials: true

    origin:  ['http://localhost:5173', 'http://localhost:5175'], 
    credentials: true,
}));

// Helps to accept JSON data
app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())


// Routes
import farmerRouter from "./routes/farmer.routes.js"
app.use("/api/v1/farmer",farmerRouter) 

import supplierRouter from "./routes/supplier.routes.js"
app.use("/api/v1/supplier",supplierRouter)

import newsRouter from "./routes/news.routes.js"
app.use("/api/v1/news",newsRouter)

import likeRouter from "./routes/like.routes.js"
app.use("/api/v1/like",likeRouter)

import dislikeRouter from "./routes/dislike.routes.js"
app.use("/api/v1/dislike",dislikeRouter)

export {app}