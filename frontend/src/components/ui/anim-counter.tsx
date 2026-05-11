"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"
import gsap from "gsap"

interface AnimCounterProps {
  value: string | number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

export function AnimCounter({ 
  value, 
  suffix = "", 
  prefix = "", 
  duration = 1.5,
  decimals = 0
}: AnimCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (!isInView || !ref.current) return
    
    const stringValue = String(value)
    const num = parseFloat(stringValue.replace(/[^0-9.]/g, ""))
    
    if (isNaN(num)) {
      ref.current.textContent = stringValue
      return
    }
    
    gsap.fromTo(ref.current,
      { innerText: 0 },
      { 
        innerText: num, 
        duration: duration, 
        ease: "power2.out",
        snap: { innerText: decimals > 0 ? 1 / Math.pow(10, decimals) : 1 },
        onUpdate() {
          if (!ref.current) return
          const v = parseFloat(ref.current.innerText)
          ref.current.textContent = prefix + (decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()) + suffix
        }
      }
    )
  }, [isInView, value, suffix, prefix, duration, decimals])

  return <span ref={ref}>{prefix}0{suffix}</span>
}
