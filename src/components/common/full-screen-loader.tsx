'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { SITE_NAME } from '@/constants/app'

export function FullScreenLoader() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || SITE_NAME
  const logoLetter = siteName.charAt(0).toUpperCase()

  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="bg-primary flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg"
        >
          <span className="text-primary-foreground text-4xl font-bold">{logoLetter}</span>
        </motion.div>

        <motion.div
          className="absolute -right-2 -bottom-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-background rounded-full p-1 shadow-md">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-foreground text-xl font-medium tracking-wide"
      >
        {siteName}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-muted-foreground text-sm"
      >
        正在加载资源...
      </motion.p>
    </div>
  )
}
