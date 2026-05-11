"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CloudLightning, ArrowRight, GitBranch } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const res = await api.post("/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070711] flex selection:bg-primary-500/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 p-16 relative overflow-hidden items-center justify-center border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg"
        >
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center backdrop-blur-xl shadow-lg shadow-primary-900/20">
              <CloudLightning className="w-7 h-7 text-primary-400" />
            </div>
            <span className="font-bold text-3xl text-white tracking-tighter">FlowForge</span>
          </div>

          <h1 className="text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
            Master your <span className="text-primary-500">workflows</span> with precision.
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed">
            The next generation of AI-powered automation is here. Connect your stack, automate your logic, and scale without limits.
          </p>

          <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <GitBranch className="w-24 h-24 text-primary-500" />
            </div>
            <p className="text-white text-lg leading-relaxed font-medium relative z-10">
              "FlowForge redefines efficiency. The seamless integration of AI into our daily ops saved us hundreds of manual hours."
            </p>
            <div className="mt-6 flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg shadow-primary-900/40" />
              <div>
                <p className="font-bold text-white uppercase tracking-widest text-xs">Marcus Thorne</p>
                <p className="text-[10px] text-primary-400 uppercase tracking-[0.2em] font-bold mt-1">VP Operations at Nexus</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
              <CloudLightning className="w-6 h-6 text-primary-400" />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">FlowForge</span>
          </div>

          <div className="space-y-2 mb-10">
            <h2 className="text-4xl font-bold text-white tracking-tight">Sign In</h2>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Access your command center</p>
          </div>

          <Button variant="outline" className="w-full mb-8 h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-xl font-bold text-[11px] uppercase tracking-widest" type="button">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#070711] text-gray-700 text-[10px] font-bold uppercase tracking-[0.3em]">Credentials</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-2xl flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Email Terminal</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="identity@flowforge.ai" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-primary-500/50 rounded-2xl transition-all"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Secure Access</Label>
                <Link href="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-primary-500 hover:text-primary-400 transition-colors">
                  Reset
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="h-12 bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-primary-500/50 rounded-2xl transition-all"
              />
            </div>
            <Button type="submit" className="w-full h-12 group bg-primary-600 hover:bg-primary-500 text-white rounded-2xl shadow-lg shadow-primary-900/20 border-0 uppercase tracking-widest text-[11px] font-bold mt-4" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Establish Connection"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <p className="mt-12 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            New operative?{" "}
            <Link href="/register" className="text-primary-500 hover:text-primary-400 transition-colors">
              Request Access
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
