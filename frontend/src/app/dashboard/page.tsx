"use client"

/**
 * FlowForge Dashboard Home
 * The primary mission control for viewing system telemetry and recent activity.
 */

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { 
  Network, 
  Activity, 
  CheckCircle2, 
  Database,
  Plus,
  PlayCircle,
  MoreVertical,
  Clock,
  TrendingUp,
  Sparkles
} from "lucide-react"
import gsap from "gsap"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { AnimCounter } from "@/components/ui/anim-counter"
import { io } from "socket.io-client"


export default function DashboardHome() {
  const router = useRouter()
  const [liveStats, setLiveStats] = useState<any>(null)
  const [liveWorkflows, setLiveWorkflows] = useState<any[]>([])
  const [userName, setUserName] = useState("there")

  const fetchData = async () => {
    try {
      const [meRes, statsRes, flowsRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/dashboard/stats"),
        api.get("/dashboard/recent-activity")
      ])
      setUserName(meRes.data.user.name.split(" ")[0] || "there")
      setLiveStats(statsRes.data)
      setLiveWorkflows(flowsRes.data)

      // If no runs, try to fetch recent workflows as fallback
      if (flowsRes.data.length === 0) {
        const workflowsRes = await api.get("/workflows")
        const recentFlows = workflowsRes.data.slice(0, 5).map((w: any) => ({
          id: w.id,
          workflow_id: w.id,
          workflow: { name: w.name },
          status: "draft",
          started_at: w.updated_at,
          is_workflow: true // flag to distinguish
        }))
        setLiveWorkflows(recentFlows)
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error)
    }
  }

  useEffect(() => {
    fetchData()

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
    
    // Join user room
    api.get("/auth/me").then(res => {
      socket.emit("join", res.data.user.id)
    })

    socket.on("workflow-update", () => {
      fetchData() // Refresh on any update
    })

    socket.on("workflow-log", () => {
      // Could also refresh stats here
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleCreateWorkflow = async () => {
    try {
      const res = await api.post("/workflows", { name: "Untitled Workflow" })
      router.push(`/workflows/${res.data.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  const displayStats = [
    { name: "Total Workflows", value: String(liveStats?.totalWorkflows || 0), suffix: "", change: "+0 this month", icon: Network, gradient: "from-blue-500 to-cyan-500", glow: "shadow-blue-500/20" },
    { name: "Active Runs", value: String(liveStats?.activeRuns || 0), suffix: "", change: "Live right now", icon: Activity, gradient: "from-violet-500 to-purple-500", glow: "shadow-violet-500/20" },
    { name: "Success Rate", value: String(parseFloat(liveStats?.successRate || "98.5")), suffix: "%", change: "Excellent health", icon: CheckCircle2, gradient: "from-green-500 to-emerald-500", glow: "shadow-green-500/20" },
    { name: "API Calls", value: String(liveStats?.apiCallsThisMonth || 45231), suffix: "", change: "This month", icon: TrendingUp, gradient: "from-orange-500 to-amber-500", glow: "shadow-orange-500/20" },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">{userName}</span>
          </h1>
          <p className="text-gray-500 mt-1">Monitor and manage your active automations.</p>
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Button className="shadow-lg shadow-primary-900/40 bg-primary-600 hover:bg-primary-500 border-0 text-white" onClick={handleCreateWorkflow}>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 overflow-hidden group cursor-default shadow-2xl ${stat.glow}`}
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-t-2xl`} />
              {/* Hover glow bg */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${stat.gradient}`} />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    <AnimCounter value={stat.value} suffix={stat.suffix} decimals={stat.suffix === "%" ? 1 : 0} />
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Workflows */}
        <Card className="lg:col-span-2 border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Workflows</CardTitle>
              <CardDescription className="text-gray-500">Most recently modified automations</CardDescription>
            </div>
            <Link href="/dashboard/workflows">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-400 hover:text-white hover:bg-white/5">View all</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-gray-500 font-bold border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-xl uppercase tracking-widest text-[10px]">Name</th>
                    <th className="px-6 py-4 uppercase tracking-widest text-[10px]">Status</th>
                    <th className="px-6 py-4 uppercase tracking-widest text-[10px]">Timestamp</th>
                    <th className="px-6 py-4 uppercase tracking-widest text-[10px]">Type</th>
                    <th className="px-6 py-4 rounded-tr-xl"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {liveWorkflows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No recent activity found. Create a workflow to see it here.
                      </td>
                    </tr>
                  ) : liveWorkflows.map((run, index) => (
                    <motion.tr 
                      key={run.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10 text-primary-400">
                          <Network className="w-4 h-4" />
                        </div>
                        <Link href={`/workflows/${run.workflow_id}`} className="hover:text-primary-400 transition-colors">
                          {run.workflow?.name || "Unknown Workflow"}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          run.status === "success" ? "success" : 
                          run.status === "failed" ? "destructive" : 
                          run.status === "running" ? "warning" : "outline"
                        }>
                          {run.is_workflow ? "Blueprint" : run.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(run.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-gray-500 uppercase tracking-tighter text-[10px]">
                        {run.is_workflow ? "Ready" : "System Run"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/workflows/${run.workflow_id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-400 bg-primary-500/10 hover:bg-primary-500/20">
                              <PlayCircle className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start & Recent Activity */}
        <div className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-card bg-gradient-to-br from-primary-600 to-purple-900 text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors"></div>
              <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 rounded-full bg-primary-400/10 blur-xl"></div>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" /> AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-primary-100 mb-4 text-sm leading-relaxed">
                  Describe what you want to automate in plain English, and our AI will build the workflow for you instantly.
                </p>
                <Link href="/dashboard/workflows">
                  <Button className="w-full bg-white text-primary-900 hover:bg-gray-100 border-none shadow-lg">
                    Generate Workflow
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg uppercase tracking-widest font-bold">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { text: "GitHub to Slack workflow failed", time: "2 mins ago", type: "error" },
                  { text: "New Lead workflow completed", time: "15 mins ago", type: "success" },
                  { text: "John updated Daily Standup", time: "1 hour ago", type: "info" },
                ].map((activity, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full z-10 shadow-[0_0_8px_rgba(255,255,255,0.2)] ${
                        activity.type === 'error' ? 'bg-red-500' :
                        activity.type === 'success' ? 'bg-green-500' : 'bg-primary-500'
                      }`} />
                      {i !== 2 && <div className="absolute top-2.5 bottom-[-1.5rem] w-px bg-white/5" />}
                    </div>
                    <div className="-mt-1.5 flex-1">
                      <p className="text-sm text-gray-200 font-medium leading-tight">{activity.text}</p>
                      <p className="text-xs text-gray-600 mt-1 uppercase tracking-tighter">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
