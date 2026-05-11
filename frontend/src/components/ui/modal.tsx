import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className={cn(
                "w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl pointer-events-auto border border-gray-100",
                className
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  {title && <h2 className="text-xl font-semibold text-dark">{title}</h2>}
                  {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-dark transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
