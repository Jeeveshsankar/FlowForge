"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Network, Plus, Search, MoreVertical, PlayCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function WorkflowsPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const res = await api.get("/workflows")
        setWorkflows(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchWorkflows()
  }, [])

  const handleCreateWorkflow = async () => {
    try {
      const res = await api.post("/workflows", { name: "Untitled Workflow" })
      router.push(`/workflows/${res.data.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  const handleRunWorkflow = async (id: string) => {
    try {
      await api.post(`/workflows/${id}/run`)
      // Refresh the list to update runs/status
      const res = await api.get("/workflows")
      setWorkflows(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-primary-500" />
            My Workflows
          </h1>
          <p className="text-gray-500 mt-1">Manage, edit, and monitor your automations.</p>
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Button className="shadow-lg shadow-primary-900/40 bg-primary-600 hover:bg-primary-500 border-0 text-white" onClick={handleCreateWorkflow}>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </motion.div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search workflows..." 
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-primary-500/50"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Badge variant="default" className="cursor-pointer px-4 py-1.5 text-sm bg-primary-600 text-white hover:bg-primary-500 border-0">All</Badge>
          <Badge variant="secondary" className="cursor-pointer px-4 py-1.5 text-sm bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-white/10">Active</Badge>
          <Badge variant="secondary" className="cursor-pointer px-4 py-1.5 text-sm bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-white/10">Drafts</Badge>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="bg-white/5 text-gray-400 font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px]">Name</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px]">Last Run</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px]">Runs</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px]">Nodes</th>
                <th className="px-6 py-4 text-right uppercase tracking-widest text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading workflows...
                  </td>
                </tr>
              ) : workflows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No workflows found. Create one to get started!
                  </td>
                </tr>
              ) : workflows.map((workflow, index) => (
                <motion.tr 
                  key={workflow.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center border border-primary-500/20 text-primary-400">
                      <Network className="w-4 h-4" />
                    </div>
                    <Link href={`/workflows/${workflow.id}`} className="hover:text-primary-600 hover:underline transition-colors">
                      {workflow.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      workflow.status === "active" ? "success" : 
                      workflow.status === "draft" ? "secondary" : "outline"
                    }>
                      {workflow.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {workflow.last_run_at ? new Date(workflow.last_run_at).toLocaleTimeString() : "Never"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium">{workflow._count?.runs || 0}</td>
                  <td className="px-6 py-4 text-gray-400">{workflow.nodes ? (typeof workflow.nodes === "string" ? JSON.parse(workflow.nodes).length : workflow.nodes.length) : 0}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRunWorkflow(workflow.id)}>
                        <PlayCircle className="w-4 h-4 mr-1" /> Run
                      </Button>
                      <Link href={`/workflows/${workflow.id}`}>
                        <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/10">
                          Edit
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
