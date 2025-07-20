import express from "express"
import http from "http"
import dotenv from "dotenv"
import userRoutes from "./routes/auth.route.js"
import { Server as SocketIOServer } from "socket.io";
import cors from "cors"
import job from "./utils/cronJobs.js";

import { connectDB } from "./utils/db.js";
import createRoomRoutes from "./routes/room.route.js";
import setupSocketHandlers from "./controllers/socket.controller.js";
dotenv.config()

const app = express();
const server = http.createServer(app);
const port = process.env.PORT||5001;
const io = new SocketIOServer(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"]
  }
});
connectDB();
job.start(); // Start the cron job to keep the server alive

app.use(express.json())
app.use(cors());
app.get('/',(req,res)=>{
  res.send("chat server is running");
})
app.use('/api/users',userRoutes);
app.use('/api/rooms',createRoomRoutes(io));

setupSocketHandlers(io);


server.listen(port, () => {
  console.log("Server is running on port", process.env.PORT);
});