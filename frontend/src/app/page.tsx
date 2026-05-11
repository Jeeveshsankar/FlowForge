"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Bot, Zap, Puzzle, LayoutDashboard, Send, CheckCircle2, PlayCircle, CloudLightning, MessageSquare, Globe, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ── Reusable reveal wrapper ── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Floating Orb ── */
function Orb({ className }: { className: string }) {
  return <div className={`absolute rounded-full blur-[120px] opacity-30 pointer-events-none ${className}`} />
}

/* ── Animated counter ── */
function AnimCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  useEffect(() => {
    if (!isInView || !ref.current) return
    gsap.fromTo(ref.current, { innerText: 0 }, {
      innerText: to, duration: 1.8, ease: "power2.out",
      snap: { innerText: 1 },
      onUpdate() { if (ref.current) ref.current.textContent = Math.round(Number(ref.current.innerText)).toLocaleString() + suffix }
    })
  }, [isInView, to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  /* GSAP line draw for How It Works */
  const lineRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!lineRef.current) return
    gsap.fromTo(lineRef.current, { scaleX: 0 }, {
      scaleX: 1, transformOrigin: "left center", ease: "none",
      scrollTrigger: { trigger: lineRef.current, start: "top 70%", end: "top 30%", scrub: true }
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className="min-h-screen bg-[#070711] text-white overflow-x-hidden selection:bg-violet-500/30">

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#070711]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <CloudLightning className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">FlowForge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            {["Features","How it Works","Pricing","Docs"].map(item => (
              <Link key={item} href={`#${item.toLowerCase().replace(/ /g,"-")}`} className="hover:text-white transition-colors duration-200">{item}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/register">
              <Button className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/50 border-0">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background orbs */}
        <Orb className="w-[600px] h-[600px] bg-violet-600 -top-32 -left-32" />
        <Orb className="w-[500px] h-[500px] bg-blue-600 top-1/2 -right-48" />
        <Orb className="w-[300px] h-[300px] bg-fuchsia-600 bottom-0 left-1/3" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
              Build Workflows That{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 animate-pulse">
                  Work For You
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Drag, drop, and deploy AI-powered automations in minutes — no code required. The smartest way to connect your apps and automate your work.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register">
                <Button size="lg" className="group bg-violet-600 hover:bg-violet-500 border-0 shadow-xl shadow-violet-900/50 text-white px-8">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm">
                <PlayCircle className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="mt-20 relative"
          >
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl scale-105" />
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-2 shadow-2xl overflow-hidden">
              <div className="rounded-xl bg-[#0a0a18] h-[400px] w-full relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(139,92,246,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12 px-4">
                  {[
                    { icon: Globe, label: "Webhook Trigger", sub: "Receives payload", color: "green", border: "border-green-500", bg: "bg-green-500/10", iconColor: "text-green-400" },
                    { icon: Bot, label: "AI Generate", sub: "Extracts sentiment", color: "violet", border: "border-violet-500", bg: "bg-violet-500/10", iconColor: "text-violet-400" },
                    { icon: MessageSquare, label: "Slack Message", sub: "Posts to #general", color: "blue", border: "border-blue-500", bg: "bg-blue-500/10", iconColor: "text-blue-400" },
                  ].map((node, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, i % 2 === 0 ? -12 : 12, 0] }}
                      transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: "easeInOut", delay: i * 0.3 }}
                      className={`bg-[#0f0f1e] border-l-4 ${node.border} rounded-xl p-4 flex items-center gap-3 w-56 shadow-xl`}
                    >
                      <div className={`${node.bg} p-2 rounded-lg ${node.iconColor}`}>
                        <node.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-white">{node.label}</p>
                        <p className="text-xs text-gray-500">{node.sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Connecting lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div animate={{ opacity: [0.3,1,0.3] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="hidden md:block absolute w-[28%] h-0.5 bg-gradient-to-r from-green-500 to-violet-500" style={{ left: "24%", top: "50%" }} />
                  <motion.div animate={{ opacity: [0.3,1,0.3] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    className="hidden md:block absolute w-[28%] h-0.5 bg-gradient-to-r from-violet-500 to-blue-500" style={{ left: "50%", top: "50%" }} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-white/5 bg-white/2 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 50000, suffix: "+", label: "Active workflows" },
            { value: 99.9, suffix: "%", label: "Uptime SLA" },
            { value: 500, suffix: "+", label: "Integrations" },
            { value: 12000, suffix: "+", label: "Teams using FlowForge" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                <AnimCounter to={s.value} suffix={s.suffix} />
              </div>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you need to automate</h2>
            <p className="mt-4 text-lg text-gray-500">Powerful features wrapped in an incredibly simple interface.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: LayoutDashboard, title: "Visual Builder", desc: "Build complex workflows simply by dragging nodes onto a canvas and connecting them.", gradient: "from-violet-500 to-purple-600" },
              { icon: Bot, title: "AI Writes Your Logic", desc: "Just describe what you want in plain English, and our AI will build the workflow for you.", gradient: "from-blue-500 to-cyan-600" },
              { icon: Puzzle, title: "500+ Integrations", desc: "Connect natively to all the tools your team already uses. No messy custom code required.", gradient: "from-fuchsia-500 to-pink-600" },
              { icon: Zap, title: "Real-time Testing", desc: "Test your workflows step-by-step with live data and instant visual feedback.", gradient: "from-amber-500 to-orange-600" },
              { icon: Send, title: "One-click Deploy", desc: "Push your automations to production instantly with zero downtime and automatic scaling.", gradient: "from-green-500 to-emerald-600" },
              { icon: Users, title: "Team Collaboration", desc: "Share workflows, use multiplayer editing, and manage permissions across your org.", gradient: "from-red-500 to-rose-600" },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="group relative rounded-2xl border border-white/5 bg-white/3 backdrop-blur-sm p-8 overflow-hidden cursor-default h-full"
                >
                  {/* Hover glow */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${feature.gradient} rounded-2xl`} />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-32 relative overflow-hidden">
        <Orb className="w-[400px] h-[400px] bg-violet-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4">Process</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500">From idea to production in three simple steps.</p>
          </Reveal>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Animated connecting line */}
            <div ref={lineRef} className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-violet-500 via-blue-500 to-green-500 origin-left" />

            {[
              { step: "01", title: "Connect your tools", desc: "Authenticate with your favorite apps securely using OAuth.", icon: Puzzle },
              { step: "02", title: "Build your flow", desc: "Use the visual builder or ask AI to create the logic.", icon: Bot },
              { step: "03", title: "Deploy instantly", desc: "Click deploy and watch your automation run 24/7 in the cloud.", icon: Send },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.15} className="relative text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-6 relative z-10 shadow-xl shadow-violet-900/50"
                >
                  <item.icon className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-xs text-violet-400 font-bold tracking-widest mb-2">{item.step}</p>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-gray-500">Start for free, upgrade when you need more power.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {[
              { name: "Free", price: "$0", desc: "Perfect for exploring", features: ["5 active workflows","100 runs / month","Standard integrations","Community support"], popular: false },
              { name: "Pro", price: "$29", desc: "For professionals", features: ["Unlimited workflows","10,000 runs / month","AI workflow assistant","Premium integrations","Priority support"], popular: true },
              { name: "Enterprise", price: "$99", desc: "For teams & scaling", features: ["Unlimited everything","Custom integrations","Dedicated success manager","99.99% Uptime SLA","SSO & Advanced Security"], popular: false },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-2xl p-8 flex flex-col ${
                    plan.popular
                      ? "bg-gradient-to-b from-violet-600/30 to-blue-600/10 border-2 border-violet-500 shadow-2xl shadow-violet-900/50 scale-105"
                      : "bg-white/3 border border-white/10"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">Most Popular</span>
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-300 mb-1">{plan.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 mb-2">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-400">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? "text-violet-400" : "text-gray-600"}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className={`w-full ${plan.popular ? "bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/50 border-0" : "bg-white/5 hover:bg-white/10 border border-white/10"}`}>
                      {plan.price === "$0" ? "Get Started" : "Upgrade"}
                    </Button>
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32">
        <Reveal className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-3xl overflow-hidden p-16 border border-white/10"
            style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, rgba(7,7,17,1) 70%)" }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
            <h2 className="relative text-4xl md:text-5xl font-bold mb-6">Ready to automate?</h2>
            <p className="relative text-gray-400 text-lg mb-8">Join 12,000+ teams using FlowForge to save hundreds of hours every month.</p>
            <Link href="/register">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-500 border-0 shadow-xl shadow-violet-900/50 text-white px-12 text-base group">
                Start for Free — No card needed
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <CloudLightning className="w-5 h-5 text-violet-400" />
            <span className="font-bold text-lg">FlowForge</span>
          </div>
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} FlowForge Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
