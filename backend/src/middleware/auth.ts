import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = verifyToken(token)
    ;(req as any).user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
}
