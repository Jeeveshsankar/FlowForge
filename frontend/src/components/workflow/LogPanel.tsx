import React, { useState } from "react"
import { Terminal, X, CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface LogPanelProps {
  isOpen: boolean
  onClose: () => void
  logs?: any[]
}

const mockLogs = [
  { id: 1, node: "Webhook Trigger", status: "success", time: "10:42:01.234", duration: "12ms", data: { "email": "test@example.com", "plan": "pro" } },
  { id: 2, node: "Extract Data", status: "success", time: "10:42:01.246", duration: "145ms", data: { "intent": "upgrade", "sentiment": "positive" } },
  { id: 3, node: "Slack Message", status: "success", time: "10:42:01.391", duration: "84ms", data: { "ok": true, "message_ts": "123456.789" } },
]

export function LogPanel({ isOpen, onClose, logs = mockLogs }: LogPanelProps) {
  const [expandedLog, setExpandedLog] = useState<number | null>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute bottom-0 left-0 right-0 h-72 bg-[#0a0a1a]/95 backdrop-blur-2xl border-t border-white/10 z-30 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
            <div className="flex items-center gap-3 text-white">
              <Terminal className="w-4 h-4 text-primary-400" />
              <span className="text-xs font-bold uppercase tracking-widest">System Output</span>
              <div className="h-4 w-px bg-white/10 mx-2" />
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                </span>
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Live Monitor</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm">
            {logs.map((log) => (
              <div key={log.id} className="rounded-xl border border-white/5 overflow-hidden">
                <div 
                  className="flex items-center gap-6 p-3 bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-all"
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  {log.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 drop-shadow-[0_0_5px_rgba(34,197,94,0.3)]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 drop-shadow-[0_0_5px_rgba(239,68,68,0.3)]" />
                  )}
                  <span className="text-[10px] text-gray-500 w-24 shrink-0 font-bold">{log.time}</span>
                  <span className="text-gray-100 font-bold tracking-tight flex-1 truncate uppercase text-xs">{log.node}</span>
                  <div className="flex items-center gap-1.5 text-gray-500 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{log.duration}</span>
                  </div>
                  {expandedLog === log.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                
                {expandedLog === log.id && (
                  <div className="p-4 bg-black/40 border-t border-white/5">
                    <pre className="text-primary-400/80 text-[11px] overflow-x-auto leading-relaxed">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
