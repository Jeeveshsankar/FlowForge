"use client"

/**
 * FlowForge Workflow Canvas
 * The primary visual editor for building and managing automation pipelines.
 */

import React, { useCallback, useState, useRef, useEffect } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { v4 as uuidv4 } from "uuid"
import { motion } from "framer-motion"
import { PlayCircle, Save, Share2, Sparkles, Terminal, X, Loader2, Bot } from "lucide-react"

import { nodeTypes } from "./CustomNodes"
import { LogPanel } from "./LogPanel"
import { WorkflowSidebar } from "./Sidebar"
import { ConfigPanel } from "./ConfigPanel"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { io } from "socket.io-client"
import { toast } from "sonner"

const initialNodes = [
  {
    id: "1",
    type: "flowNode",
    position: { x: 250, y: 100 },
    data: { type: "trigger", icon: "webhook", label: "Webhook Trigger", description: "Catch HTTP requests", configSummary: "URL: /webhook/abc-123" },
  },
]

function WorkflowCanvasContent({ workflowId }: { workflowId?: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [isLogOpen, setIsLogOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [workflowName, setWorkflowName] = useState("Loading...")
  const [workflowStatus, setWorkflowStatus] = useState("draft")
  const [isSaving, setIsSaving] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  useEffect(() => {
    if (!workflowId || workflowId === "new") return
    const fetchWorkflow = async () => {
      try {
        const res = await api.get(`/workflows/${workflowId}`)
        setWorkflowName(res.data.name)
        setWorkflowStatus(res.data.status)
        if (res.data.nodes) setNodes(typeof res.data.nodes === "string" ? JSON.parse(res.data.nodes) : res.data.nodes)
        if (res.data.edges) setEdges(typeof res.data.edges === "string" ? JSON.parse(res.data.edges) : res.data.edges)
      } catch (error) {
        console.error("Failed to load workflow", error)
      }
    }
    fetchWorkflow()

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
    
    // Join user room to receive targeted logs
    api.get("/auth/me").then(res => {
      socket.emit("join", res.data.user.id)
    })

    socket.on("workflow-log", (data) => {
      if (data.workflowId === workflowId) {
        const log = data.log
        setLogs(prev => [...prev, {
          id: Date.now() + Math.random(),
          node: log.node,
          status: log.status,
          time: new Date().toLocaleTimeString(),
          duration: log.duration,
          data: log.data
        }])
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [workflowId, setNodes, setEdges])

  const handleSave = async () => {
    if (!workflowId || workflowId === "new") return
    setIsSaving(true)
    try {
      await api.put(`/workflows/${workflowId}`, {
        name: workflowName,
        nodes: nodes,
        edges: edges
      })
      toast.success("Workflow saved successfully")
    } catch (error) {
      console.error("Failed to save workflow", error)
      toast.error("Failed to save workflow")
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success("Workflow link copied to clipboard")
  }

  const handleRun = async () => {
    if (!workflowId || workflowId === "new") return
    await handleSave()
    setLogs([]) // Clear old logs
    setIsLogOpen(true)
    try {
      await api.post(`/workflows/${workflowId}/run`)
      toast.success("Workflow deployment started")
    } catch (error) {
      console.error("Failed to run workflow", error)
      toast.error("Deployment failed")
    }
  }

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 } }, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      const nodeDataStr = event.dataTransfer.getData('application/reactflow-data')
      
      if (typeof type === 'undefined' || !type || !nodeDataStr) return

      const nodeData = JSON.parse(nodeDataStr)
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) || { x: 0, y: 0 }

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { ...nodeData },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes]
  )

  const onNodeClick = (_: React.MouseEvent, node: any) => {
    setSelectedNode(node)
  }

  const updateNodeData = (id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = data
        }
        return node
      })
    )
    setSelectedNode((prev: any) => ({ ...prev, data }))
  }

  const handleAIGenerate = async () => {
    if (!aiPrompt) return
    setIsGenerating(true)
    try {
      const res = await api.post("/ai/generate-workflow", { prompt: aiPrompt })
      const data = res.data
      if (data.nodes && data.edges) {
        setNodes(data.nodes)
        setEdges(data.edges)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
      setIsAIModalOpen(false)
      setAiPrompt("")
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#070711] overflow-hidden pt-16 selection:bg-primary-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary-600/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>
      
      <WorkflowSidebar />
      
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        {/* Topbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 pointer-events-auto shadow-2xl"
          >
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="font-bold text-white tracking-tight">{workflowName}</span>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{workflowStatus}</span>
          </motion.div>
          
          <div className="flex items-center gap-2 pointer-events-auto">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="bg-white/5 backdrop-blur-xl border-white/10 text-gray-400 hover:text-white hover:bg-white/10 shadow-xl" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="bg-white/5 backdrop-blur-xl border-white/10 text-gray-400 hover:text-white hover:bg-white/10 shadow-xl" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20 border-0" onClick={handleRun}>
                <PlayCircle className="w-4 h-4 mr-2" /> Deploy
              </Button>
            </motion.div>
            <Button variant="secondary" onClick={() => setIsLogOpen(!isLogOpen)} className="ml-2 bg-white/5 border-white/10 text-gray-400 hover:text-white">
              <Terminal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedNode(null)}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#070711]"
        >
          <Background color="#1a1a2e" gap={24} size={1} />
          <Controls className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl [&_button]:bg-transparent [&_button]:text-gray-400 hover:[&_button]:text-white [&_svg]:fill-current" />
          <MiniMap 
            className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl" 
            nodeColor={(n) => {
              if (n.data?.type === 'trigger') return '#10b981'
              if (n.data?.type === 'ai') return '#7c3aed'
              if (n.data?.type === 'integration') return '#3b82f6'
              return '#f97316'
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>

        <ConfigPanel 
          selectedNode={selectedNode} 
          onClose={() => setSelectedNode(null)} 
          onUpdate={updateNodeData}
        />

        <LogPanel isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} logs={logs.length > 0 ? logs : undefined} />

        {/* Floating AI Button */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAIModalOpen(true)}
          className="absolute bottom-8 right-8 z-20 w-16 h-16 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-900/30 flex items-center justify-center border border-primary-500/20"
        >
          <Sparkles className="w-7 h-7" />
        </motion.button>

        {/* AI Generation Modal */}
        {isAIModalOpen && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a1a] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Bot className="w-6 h-6 text-primary-400" />
                  AI Architect
                </h2>
                <button onClick={() => setIsAIModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed uppercase tracking-widest font-bold">
                  Prompt
                </p>
                <textarea
                  className="w-full h-40 p-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:bg-white/10 focus:border-primary-500/50 transition-all resize-none outline-none placeholder:text-gray-600"
                  placeholder="Describe your automation goals..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
              <div className="p-6 pt-0 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsAIModalOpen(false)} className="text-gray-500 hover:text-white">Cancel</Button>
                <Button onClick={handleAIGenerate} disabled={!aiPrompt || isGenerating} className="bg-primary-600 hover:bg-primary-500 text-white min-w-[140px] shadow-lg shadow-primary-900/20 border-0">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Build Flow"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export function WorkflowCanvas({ workflowId }: { workflowId?: string }) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasContent workflowId={workflowId} />
    </ReactFlowProvider>
  )
}
