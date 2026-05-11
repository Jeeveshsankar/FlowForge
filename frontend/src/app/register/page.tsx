"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CloudLightning, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const res = await api.post("/auth/register", { 
        email, 
        password, 
        name: `${firstName} ${lastName}`.trim() 
      })
      localStorage.setItem("token", res.data.token)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070711] flex selection:bg-primary-500/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />

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
            Build the next <span className="text-primary-500">generation</span> of work.
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed mb-12">
            Join thousands of modern operatives automating their daily logic with high-fidelity AI tools.
          </p>

          <div className="space-y-6">
            {[
              { label: "Visual Logic Terminal", desc: "Drag-and-drop workflow execution" },
              { label: "AI Architecture", desc: "Instant node scaffold generation" },
              { label: "Neural Network", desc: "500+ secure integrations" }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl group hover:bg-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-primary-600/20 flex items-center justify-center border border-primary-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white text-sm uppercase tracking-widest">{feature.label}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Register Form */}
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
            <h2 className="text-4xl font-bold text-white tracking-tight">Join Orbit</h2>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Initialize your mission control</p>
          </div>

          <Button variant="outline" className="w-full mb-8 h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-xl font-bold text-[11px] uppercase tracking-widest" type="button">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
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
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">First Name</Label>
                <Input 
                  id="firstName" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)} 
                  required 
                  className="h-12 bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-primary-500/50 rounded-2xl transition-all"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)} 
                  required 
                  className="h-12 bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-primary-500/50 rounded-2xl transition-all"
                />
              </div>
            </div>
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
              <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Secure Passkey</Label>
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
              {isLoading ? "Provisioning..." : "Initialize Profile"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <p className="mt-12 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Already registered?{" "}
            <Link href="/login" className="text-primary-500 hover:text-primary-400 transition-colors">
              Enter Terminal
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
