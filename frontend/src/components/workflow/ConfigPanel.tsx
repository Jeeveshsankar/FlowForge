import React from "react"
import { X, PlayCircle, Variable, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ConfigPanelProps {
  selectedNode: any | null
  onClose: () => void
  onUpdate: (id: string, data: any) => void
}

export function ConfigPanel({ selectedNode, onClose, onUpdate }: ConfigPanelProps) {
  if (!selectedNode) return null

  const { id, data } = selectedNode

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="w-80 bg-[#0a0a1a] border-l border-white/5 shadow-2xl flex flex-col h-full z-20 absolute right-0 top-0"
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Configure Node</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-gray-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Node Name</Label>
              <Input 
                value={data.label} 
                onChange={(e) => onUpdate(id, { ...data, label: e.target.value })}
                className="bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-primary-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Description</Label>
              <Input 
                value={data.description} 
                onChange={(e) => onUpdate(id, { ...data, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-primary-500/50"
              />
            </div>

            {/* Dynamic configuration based on node type would go here in a real app */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                <Variable className="w-4 h-4 text-primary-400" />
                Parameters
              </h3>
              
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Dynamic Source</Label>
                <div className="flex gap-2">
                  <Input defaultValue="{{trigger.payload.email}}" className="font-mono text-[11px] bg-white/5 border-white/10 text-primary-400" />
                  <Button variant="outline" size="icon" className="shrink-0 border-white/10 text-primary-400 hover:bg-primary-500/10">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-2">Reference node outputs using double braces.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-white/5">
          <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 shadow-lg text-[10px] uppercase tracking-widest font-bold" variant="secondary">
            <PlayCircle className="w-4 h-4 mr-2 text-primary-400" />
            Test Output
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
