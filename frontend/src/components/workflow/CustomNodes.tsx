/**
 * FlowForge Custom Node System
 * High-fidelity visual components for the React Flow canvas.
 */

import React from "react"
import { Handle, Position, NodeProps } from "@xyflow/react"
import { Bot, Globe, Database, MessageSquare, Zap, Link as LinkIcon, Settings2 } from "lucide-react"

const icons: Record<string, any> = {
  webhook: Globe,
  database: Database,
  slack: MessageSquare,
  ai: Bot,
  action: Zap,
  integration: LinkIcon
}

const nodeStyles: Record<string, any> = {
  trigger: {
    border: "border-emerald-500/50",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20"
  },
  action: {
    border: "border-orange-500/50",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    glow: "shadow-orange-500/20"
  },
  integration: {
    border: "border-blue-500/50",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    glow: "shadow-blue-500/20"
  },
  ai: {
    border: "border-primary-500/50",
    bg: "bg-primary-500/10",
    text: "text-primary-400",
    glow: "shadow-primary-500/20"
  }
}

export function FlowNode({ data, selected }: NodeProps) {
  const type = (data.type as string) || "action"
  const iconName = (data.icon as string) || "action"
  const Icon = icons[iconName] || Zap
  const styles = nodeStyles[type] || nodeStyles.action

  return (
    <div className={`
      relative rounded-2xl bg-[#0a0a1a]/90 backdrop-blur-xl border-2 transition-all min-w-[260px] overflow-hidden
      ${selected 
        ? "border-primary-500 shadow-[0_0_25px_rgba(37,99,235,0.2)] ring-4 ring-primary-500/10" 
        : "border-white/5 shadow-2xl"}
    `}>
      {/* Header */}
      <div className={`px-4 py-3 border-b border-white/5 flex items-center gap-3 ${styles.bg}`}>
        <div className={`p-2 rounded-xl bg-black/40 border border-white/10 shadow-inner`}>
          <Icon className={`w-4 h-4 ${styles.text}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white tracking-tight">{data.label as string}</p>
          <p className={`text-[10px] font-medium uppercase tracking-widest ${styles.text} opacity-80`}>{type}</p>
        </div>
        <div className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center cursor-pointer text-gray-500 transition-colors">
          <Settings2 className="w-4 h-4" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 bg-white/[0.02]">
        <div className="text-[11px] text-gray-400 font-mono bg-black/40 p-3 rounded-xl border border-white/5 truncate shadow-inner">
          {data.configSummary as string || "Ready for configuration"}
        </div>
      </div>

      {/* Footer/Description */}
      <div className="px-4 py-2 border-t border-white/5 bg-black/20">
        <p className="text-[10px] text-gray-600 line-clamp-1">{data.description as string || "No additional metadata"}</p>
      </div>

      {/* Handles */}
      {type !== "trigger" && (
        <Handle 
          type="target" 
          position={Position.Top} 
          className="!w-4 !h-1.5 !rounded-none !border-0 !bg-primary-500/50 !transition-all hover:!bg-primary-500" 
        />
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-4 !h-1.5 !rounded-none !border-0 !bg-primary-500/50 !transition-all hover:!bg-primary-500" 
      />
    </div>
  )
}

export const nodeTypes = {
  flowNode: FlowNode
}
