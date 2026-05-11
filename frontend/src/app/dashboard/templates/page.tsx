"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Blocks, Search, Filter, GitBranch, MessageSquare, Database, Globe, CloudLightning, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const categories = ["All", "Popular", "Marketing", "Development", "Finance", "HR"]

const templates = [
  { id: 1, name: "GitHub Issues to Slack", desc: "Post a message to a Slack channel whenever a new GitHub issue is created or updated.", category: "Development", icons: [GitBranch, MessageSquare], uses: "12.4k" },
  { id: 2, name: "New Lead to CRM", desc: "Automatically create a contact in Salesforce and notify sales via email when a Typeform is submitted.", category: "Marketing", icons: [Globe, Database], uses: "8.2k" },
  { id: 3, name: "AI Email Responder", desc: "Use AI to categorize incoming support emails and draft an initial response.", category: "Popular", icons: [CloudLightning, MessageSquare], uses: "24.1k" },
  { id: 4, name: "Daily Standup Report", desc: "Aggregate Jira updates and GitHub commits daily at 9 AM and post to Slack.", category: "Development", icons: [Database, GitBranch, MessageSquare], uses: "5.6k" },
  { id: 5, name: "Failed Stripe Payment", desc: "Send an automated recovery email sequence when a subscription payment fails.", category: "Finance", icons: [Database, Globe], uses: "4.3k" },
  { id: 6, name: "New Hire Onboarding", desc: "Create Google Workspace account, invite to Slack, and send welcome email.", category: "HR", icons: [Globe, MessageSquare], uses: "3.1k" },
]

export default function TemplatesPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("All")
  const [isLoading, setIsLoading] = useState<number | null>(null)

  const handleUseTemplate = async (template: any) => {
    setIsLoading(template.id)
    try {
      const res = await api.post("/workflows", { 
        name: template.name,
        description: template.desc
      })
      toast.success(`Created workflow from ${template.name}`)
      router.push(`/workflows/${res.data.id}`)
    } catch (error) {
      console.error(error)
      toast.error("Failed to create workflow from template")
    } finally {
      setIsLoading(null)
    }
  }

  const filteredTemplates = templates.filter(t => activeCategory === "All" || t.category === activeCategory || (activeCategory === "Popular" && t.category === "Popular"))

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Blocks className="w-6 h-6 text-primary-500" />
            Templates
          </h1>
          <p className="text-gray-500 mt-1">Ready-to-use workflow blueprints.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Search templates..." 
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-primary-500/50"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div 
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary-500/30 transition-all duration-300 cursor-pointer group shadow-2xl">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex -space-x-2">
                    {template.icons.map((Icon, i) => (
                      <div key={i} className="w-10 h-10 rounded-xl bg-[#0a0a1a] border border-white/10 shadow-sm flex items-center justify-center relative z-10 hover:z-20 transition-transform hover:scale-110">
                        <Icon className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                  <Badge variant="outline" className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-tighter border-white/5">{template.uses} uses</Badge>
                </div>
                <CardTitle className="text-lg text-white group-hover:text-primary-400 transition-colors font-bold tracking-tight">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2 text-sm text-gray-500 leading-relaxed">{template.desc}</CardDescription>
              </CardHeader>
              <div className="flex-1" />
              <CardFooter className="pt-4 border-t border-white/5 mt-4">
                <Button 
                  variant="ghost" 
                  className="w-full text-primary-400 hover:bg-primary-600 hover:text-white transition-all border border-primary-500/10 uppercase tracking-widest text-[10px] font-bold"
                  onClick={() => handleUseTemplate(template)}
                  disabled={isLoading === template.id}
                >
                  {isLoading === template.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Use Blueprint
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
