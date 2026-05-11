"use client"

/**
 * FlowForge Dashboard Layout
 * Provides the global navigation, sidebar, and authenticated session management.
 */

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CloudLightning, 
  LayoutDashboard, 
  Network, 
  Blocks, 
  Plug2, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react"

import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me")
        setUser(res.data.user)
      } catch (error) {
        router.push("/login")
      }
    }
    fetchUser()
  }, [router])

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Workflows", href: "/dashboard/workflows", icon: Network },
    { name: "Templates", href: "/dashboard/templates", icon: Blocks },
    { name: "Integrations", href: "/dashboard/integrations", icon: Plug2 },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#070711] text-white flex overflow-hidden font-sans selection:bg-primary-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none" />
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a1a]/80 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/20">
            <CloudLightning className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">FlowForge</span>
          <button className="lg:hidden ml-auto text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-6 space-y-1">
          <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Core</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-500 hover:text-white'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary-600/10 border border-primary-500/20 rounded-xl -z-10 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div
                  whileHover={{ rotate: isActive ? 0 : 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-400' : 'text-gray-500 group-hover:text-primary-400'}`} />
                </motion.div>
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-dot"
                    className="absolute right-3 w-1 h-1 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5">
          <Link
            href="/dashboard/help"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-500" />
            Support
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Topbar */}
        <header className="h-16 bg-[#070711]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-6 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-500 hover:text-dark"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Search..." 
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-primary-500/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:bg-white/5 hover:text-white rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-[#070711]"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-900/20 cursor-pointer hover:scale-105 transition-transform">
              <span className="text-sm">{user ? getInitials(user.name) : "..."}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
