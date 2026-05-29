"use client"

import { motion } from "framer-motion"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.2,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({ children, delay = 0 }: PageTransitionProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.2,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ children, direction = "up" }: PageTransitionProps & { direction?: "up" | "down" | "left" | "right" }) {
  const variants = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...variants[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}
