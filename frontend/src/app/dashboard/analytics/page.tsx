"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Database } from "lucide-react"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimCounter } from "@/components/ui/anim-counter"

const areaData = [
  { name: 'Mon', runs: 4000, api: 2400 },
  { name: 'Tue', runs: 3000, api: 1398 },
  { name: 'Wed', runs: 2000, api: 9800 },
  { name: 'Thu', runs: 2780, api: 3908 },
  { name: 'Fri', runs: 1890, api: 4800 },
  { name: 'Sat', runs: 2390, api: 3800 },
  { name: 'Sun', runs: 3490, api: 4300 },
]

const pieData = [
  { name: 'Success', value: 85, color: '#10B981' },
  { name: 'Failed', value: 10, color: '#EF4444' },
  { name: 'Timeout', value: 5, color: '#F59E0B' },
]

const barData = [
  { name: 'GitHub to Slack', runs: 1200 },
  { name: 'Stripe Recovery', runs: 800 },
  { name: 'Lead routing', runs: 600 },
  { name: 'Daily Report', runs: 400 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-500" />
            Analytics
          </h1>
          <p className="text-gray-500 mt-1">Performance and usage insights.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {["24h", "7d", "30d", "All"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timeRange === range ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "Total Runs", value: 19540, icon: TrendingUp, color: "text-green-500", gradient: "from-green-500 to-emerald-500", trend: "+12.5%", trendIcon: ArrowUpRight, trendColor: "text-green-600" },
          { name: "API Calls", value: 45231, icon: Database, color: "text-primary-600", gradient: "from-primary-600 to-indigo-600", trend: "-4.2%", trendIcon: ArrowDownRight, trendColor: "text-red-600" },
          { name: "Error Rate", value: 1.2, suffix: "%", icon: AlertTriangle, color: "text-orange-500", gradient: "from-orange-500 to-amber-500", trend: "Improved", trendIcon: ArrowDownRight, trendColor: "text-green-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary-500/30 transition-all group overflow-hidden shadow-2xl">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{stat.name}</p>
                  <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mt-2">
                  <AnimCounter value={stat.value} suffix={stat.suffix} decimals={stat.suffix === "%" ? 1 : 0} />
                </p>
                <p className={`text-sm ${stat.trendColor} flex items-center mt-2 font-medium`}>
                  <stat.trendIcon className="w-4 h-4 mr-1" /> {stat.trend}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl h-full">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-widest text-sm font-bold">Execution Trend</CardTitle>
              <CardDescription className="text-gray-500">Workflow runs over the selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', textTransform: 'uppercase', letterSpacing: '1px' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="runs" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorRuns)" isAnimationActive={true} animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl h-full">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-widest text-sm font-bold">Health</CardTitle>
              <CardDescription className="text-gray-500">Status distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-white">
                  <AnimCounter value={85} suffix="%" />
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Success</span>
              </div>
              <div className="flex gap-4 mt-4 text-[10px] font-bold uppercase tracking-widest">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-500">{d.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-3"
        >
          <Card className="border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-widest text-sm font-bold">Top Workflows</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#aaa' }} width={120} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ borderRadius: '12px', background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="runs" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} isAnimationActive={true} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
