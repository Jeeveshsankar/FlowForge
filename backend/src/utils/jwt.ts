import jwt from "jsonwebtoken"
import { User } from "@prisma/client"

export const generateToken = (user: User) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "7d",
  })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || "default_secret")
}
