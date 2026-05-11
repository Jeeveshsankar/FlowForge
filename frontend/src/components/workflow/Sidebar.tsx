import React, { useState } from "react"
import { Search, Globe, Bot, MessageSquare, Database, Zap, Filter, Repeat } from "lucide-react"
import { Input } from "@/components/ui/input"

const nodeCategories = [
  {
    title: "Triggers",
    color: "green",
    nodes: [
      { type: "flowNode", data: { type: "trigger", icon: "webhook", label: "Webhook", description: "Catch HTTP requests", configSummary: "Waiting for event..." } },
      { type: "flowNode", data: { type: "trigger", icon: "action", label: "Schedule", description: "Run on a timer", configSummary: "Every 1 hour" } }
    ]
  },
  {
    title: "AI Actions",
    color: "primary",
    nodes: [
      { type: "flowNode", data: { type: "ai", icon: "ai", label: "Generate Text", description: "Use GPT-4 to write", configSummary: "Prompt configured" } },
      { type: "flowNode", data: { type: "ai", icon: "ai", label: "Extract Data", description: "Parse JSON from text", configSummary: "Schema defined" } }
    ]
  },
  {
    title: "Integrations",
    color: "blue",
    nodes: [
      { type: "flowNode", data: { type: "integration", icon: "slack", label: "Slack Message", description: "Post to channel", configSummary: "Channel: #general" } },
      { type: "flowNode", data: { type: "integration", icon: "database", label: "Postgres Query", description: "Run SQL", configSummary: "SELECT * FROM users" } }
    ]
  },
  {
    title: "Logic",
    color: "orange",
    nodes: [
      { type: "flowNode", data: { type: "action", icon: "action", label: "Filter", description: "If/Else branching", configSummary: "Condition: status == true" } },
      { type: "flowNode", data: { type: "action", icon: "action", label: "Loop", description: "Iterate over array", configSummary: "Array: steps" } }
    ]
  }
]

export function WorkflowSidebar() {
  const [search, setSearch] = useState("")

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('application/reactflow-data', JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-80 bg-[#0a0a1a] border-r border-white/5 flex flex-col h-full z-10">
      <div className="p-4 border-b border-white/5">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Node Palette</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <Input 
            placeholder="Search nodes..." 
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-700 focus:bg-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {nodeCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{category.title}</h3>
            <div className="space-y-2">
              {category.nodes
                .filter(n => n.data.label.toLowerCase().includes(search.toLowerCase()))
                .map((node, i) => (
                <div
                  key={i}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-primary-500/50 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 group"
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type, node.data)}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 text-gray-400 group-hover:text-primary-400 group-hover:scale-110 transition-all`}>
                    {/* Simplified icon logic for palette */}
                    {node.data.icon === "webhook" && <Globe className="w-5 h-5" />}
                    {node.data.icon === "ai" && <Bot className="w-5 h-5" />}
                    {node.data.icon === "slack" && <MessageSquare className="w-5 h-5" />}
                    {node.data.icon === "database" && <Database className="w-5 h-5" />}
                    {node.data.icon === "action" && <Zap className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">{node.data.label}</p>
                    <p className="text-[10px] text-gray-600 uppercase tracking-tighter">{node.data.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
