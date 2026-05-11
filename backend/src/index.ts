import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import { PrismaClient } from "@prisma/client"

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", process.env.FRONTEND_URL || ""].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
})

export const prisma = new PrismaClient()

import { authRouter } from "./routes/auth"
import { dashboardRouter } from "./routes/dashboard"
import { workflowsRouter } from "./routes/workflows"
import { aiRouter } from "./routes/ai"

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", process.env.FRONTEND_URL || ""].filter(Boolean),
    credentials: true,
  })
)
app.use(helmet())
app.use(compression())
app.use(morgan("dev"))

// Routes
app.use("/auth", authRouter)
app.use("/dashboard", dashboardRouter)
app.use("/workflows", workflowsRouter)
app.use("/ai", aiRouter)

// Base route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  socket.on("join", (userId: string) => {
    socket.join(userId)
    console.log(`Socket ${socket.id} joined room ${userId}`)
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
  })
})

export { app, io }
