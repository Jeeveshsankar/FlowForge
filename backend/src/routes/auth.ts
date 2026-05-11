/**
 * Authentication & Identity API
 * Manages user sessions, JWT issuance, and profile synchronization.
 */

import { Router } from "express"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "../index"
import { generateToken } from "../utils/jwt"
import { requireAuth } from "../middleware/auth"

const router = Router()

/**
 * Validation Schemas
 */
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

/**
 * @route   POST /auth/register
 * @desc    Onboard a new operative into the FlowForge network
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body)

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: "Identity already registered" })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        name,
      },
    })

    const token = generateToken(user)
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token })
  } catch (error) {
    console.error("[Auth] Registration failed:", error)
    res.status(400).json({ error: "Invalid registration payload" })
  }
})

/**
 * @route   POST /auth/login
 * @desc    Authenticate operative credentials and issue JWT session
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = generateToken(user)
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token })
  } catch (error) {
    console.error("[Auth] Login failed:", error)
    res.status(400).json({ error: "Invalid login payload" })
  }
})

/**
 * @route   GET /auth/me
 * @desc    Synchronize current operative profile
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, avatar_url: true, plan: true, api_key: true }
    })
    
    if (!user) return res.status(404).json({ error: "Operative not found" })
    
    res.json({ user })
  } catch (error) {
    console.error("[Auth] Profile sync error:", error)
    res.status(500).json({ error: "Telemetry failed" })
  }
})

/**
 * @route   POST /auth/refresh-token
 * @desc    Extend session duration via token rotation
 */
router.post("/refresh-token", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ error: "Identity mismatch" })
      
    const token = generateToken(user)
    res.json({ token })
  } catch (error) {
    res.status(500).json({ error: "Session rotation failed" })
  }
})

/**
 * @route   POST /auth/logout
 * @desc    Terminate active session (client-side)
 */
router.post("/logout", (req, res) => {
  res.json({ message: "Session terminated successfully" })
})

export { router as authRouter }
