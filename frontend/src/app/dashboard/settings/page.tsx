"use client"

import { useState } from "react"
import { Settings, User, Key, Bell, Users, CreditCard, AlertTriangle, Copy, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    toast.success("API Key copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    toast.success("Profile updated successfully")
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary-500" />
            Settings
          </h1>
          <p className="text-gray-500 mt-1">Configure your environment and account.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? tab.id === "danger" 
                    ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                    : "bg-primary-600 text-white shadow-lg shadow-primary-900/20 border-0" 
                  : "text-gray-500 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "" : "text-gray-600"}`} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card className="border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white uppercase tracking-widest text-sm font-bold">Profile</CardTitle>
                  <CardDescription className="text-gray-500">Personal information and identity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-900/20 border border-white/10">
                      JS
                    </div>
                    <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/10">Update Avatar</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">First Name</Label>
                      <Input id="firstName" defaultValue="John" className="bg-white/5 border-white/10 text-white focus:border-primary-500/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Last Name</Label>
                      <Input id="lastName" defaultValue="Smith" className="bg-white/5 border-white/10 text-white focus:border-primary-500/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" className="bg-white/5 border-white/10 text-white focus:border-primary-500/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Timezone</Label>
                    <Input id="timezone" defaultValue="America/New_York (GMT-4)" className="bg-white/5 border-white/10 text-white focus:border-primary-500/50" />
                  </div>
                </CardContent>
                <CardFooter className="bg-white/5 border-t border-white/5 py-4">
                  <Button className="ml-auto bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20 border-0 uppercase tracking-widest text-[10px] font-bold" onClick={handleSave}>Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "api-keys" && (
            <div className="space-y-6">
              <Card className="border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white uppercase tracking-widest text-sm font-bold">Security</CardTitle>
                  <CardDescription className="text-gray-500">API keys for programmatic access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Default Key</Label>
                    <div className="flex gap-2">
                      <Input readOnly type="password" value="sk_live_1234567890abcdef" className="font-mono text-gray-500 bg-white/5 border-white/10" />
                      <Button variant="outline" className="w-12 px-0 border-white/10 hover:bg-white/10" onClick={handleCopy}>
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                      </Button>
                    </div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-tight mt-2">Last accessed 2 hours ago</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-white/5 border-t border-white/5 py-4 flex justify-between">
                  <Button variant="destructive" className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border-red-500/20 text-[10px] uppercase tracking-widest font-bold">Revoke</Button>
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 text-[10px] uppercase tracking-widest font-bold">Generate Key</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <Card className="border border-primary-500/30 bg-gradient-to-br from-primary-600/10 to-purple-600/10 backdrop-blur-md shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-primary-600/20 blur-3xl animate-pulse" />
                <CardHeader>
                  <CardTitle className="text-white uppercase tracking-widest text-sm font-bold">Billing</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        Pro Plan <Badge className="bg-primary-600 text-white border-0 shadow-lg text-[10px] uppercase font-bold tracking-tighter">Active</Badge>
                      </h3>
                      <p className="text-gray-400 mt-1">$29.00 / month</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                      <span className="text-gray-400">API Usage</span>
                      <span className="text-primary-400">4,523 / 10,000</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                      <div className="bg-primary-500 h-1.5 rounded-full w-[45%] shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-3 bg-white/5 border-t border-white/5 py-4">
                  <Button className="bg-primary-600 hover:bg-primary-500 text-white shadow-lg border-0 text-[10px] uppercase tracking-widest font-bold">Upgrade</Button>
                  <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-[10px] uppercase tracking-widest font-bold">Manage</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "danger" && (
            <div className="space-y-6">
              <Card className="border border-red-500/20 bg-red-500/5 backdrop-blur-md shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-red-500 uppercase tracking-widest text-sm font-bold">Danger Zone</CardTitle>
                  <CardDescription className="text-red-500/60">Destructive actions are irreversible.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-red-500/10">
                    <div>
                      <h4 className="font-bold text-gray-200 uppercase tracking-widest text-xs">Purge Data</h4>
                      <p className="text-xs text-gray-500 mt-1">Permanently delete all workflow history.</p>
                    </div>
                    <Button variant="destructive" className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border-red-500/20 text-[10px] uppercase tracking-widest font-bold">Purge</Button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                    <div>
                      <h4 className="font-bold text-gray-200 uppercase tracking-widest text-xs">Terminate Account</h4>
                      <p className="text-xs text-gray-500 mt-1">Immediately erase all personal data.</p>
                    </div>
                    <Button variant="destructive" className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border-red-500/20 text-[10px] uppercase tracking-widest font-bold">Terminate</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
