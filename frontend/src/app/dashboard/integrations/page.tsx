"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plug2, Search, CheckCircle2, AlertCircle, Plus } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const categories = ["All", "Productivity", "Communication", "Developer", "Finance", "AI/ML", "Database"]

const integrations = [
  { id: 1, name: "Slack", desc: "Send messages, create channels, and manage users.", category: "Communication", connected: true, logo: "S" },
  { id: 2, name: "GitHub", desc: "Manage issues, PRs, and repository settings.", category: "Developer", connected: true, logo: "G" },
  { id: 3, name: "OpenAI", desc: "Generate text, summarize content, and analyze sentiment.", category: "AI/ML", connected: false, logo: "O" },
  { id: 4, name: "Stripe", desc: "Process payments, manage subscriptions and customers.", category: "Finance", connected: false, logo: "St" },
  { id: 5, name: "PostgreSQL", desc: "Execute queries and manage relational data.", category: "Database", connected: true, logo: "P" },
  { id: 6, name: "Notion", desc: "Create pages, manage databases, and organize knowledge.", category: "Productivity", connected: false, logo: "N" },
  { id: 7, name: "Discord", desc: "Send messages to channels and manage server roles.", category: "Communication", connected: false, logo: "D" },
  { id: 8, name: "Linear", desc: "Manage issues, cycles, and projects.", category: "Developer", connected: false, logo: "L" },
]

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [localIntegrations, setLocalIntegrations] = useState(integrations)

  const toggleConnection = (id: number) => {
    setLocalIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        const newState = !item.connected
        if (newState) {
          toast.success(`Connected to ${item.name}`)
        } else {
          toast.info(`Disconnected from ${item.name}`)
        }
        return { ...item, connected: newState }
      }
      return item
    }))
  }

  const filteredIntegrations = localIntegrations.filter(i => {
    const matchesCategory = activeCategory === "All" || i.category === activeCategory
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plug2 className="w-6 h-6 text-primary-500" />
            Integrations
          </h1>
          <p className="text-gray-500 mt-1">Connect and manage your external services.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search integrations..." 
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-primary-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {categories.map(cat => (
            <Badge 
              key={cat} 
              variant={activeCategory === cat ? "default" : "secondary"}
              className={`cursor-pointer whitespace-nowrap px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all ${
                activeCategory === cat 
                  ? "bg-primary-600 text-white border-0 shadow-lg shadow-primary-900/20" 
                  : "bg-white/5 text-gray-500 hover:text-white border-white/10"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredIntegrations.map((integration, index) => (
          <motion.div 
            key={integration.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary-500/30 transition-all relative overflow-hidden group shadow-2xl">
              {integration.connected && (
                <div className="absolute top-0 right-0 p-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                </div>
              )}
              <CardContent className="p-6 flex flex-col h-full items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  {integration.logo}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{integration.name}</h3>
                <p className="text-sm text-gray-500 mt-2 mb-6 flex-1 leading-relaxed">{integration.desc}</p>
                
                {integration.connected ? (
                  <Button variant="outline" className="w-full text-red-400 hover:text-white hover:bg-red-500/10 border-red-500/20" onClick={() => toggleConnection(integration.id)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full bg-white/10 text-white hover:bg-white/20 border-0 shadow-lg" onClick={() => toggleConnection(integration.id)}>
                    <Plus className="w-4 h-4 mr-2" /> Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
