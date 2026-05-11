import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 shadow-purple",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-200 bg-white hover:bg-gray-100 text-dark",
        secondary: "bg-primary-100 text-primary-900 hover:bg-primary-200",
        ghost: "hover:bg-primary-50 text-dark hover:text-primary-600",
        link: "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(props as HTMLMotionProps<"button">)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
