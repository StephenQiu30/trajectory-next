'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { ArrowRight, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface LoginPromptCardProps {
  onLoginClick: () => void
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function LoginPromptCard({
  onLoginClick,
  title = '需要登录',
  description = '请先登录以查看该页面的主要内容和数据',
  icon,
}: LoginPromptCardProps) {
  return (
    <div className="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden px-4 py-16">
      {/* Dynamic Background Blob */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#0066FF]/20 to-purple-500/20 opacity-60 blur-[80px] dark:opacity-40" />

      {/* Ambient noise texture (optional, nice for Apple feel) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      ></div>

      {/* Card Content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]">
          <CardHeader className="flex flex-col items-center space-y-8 pt-16 pb-6">
            {/* Icon Container - Squircle with superellipse-like feel */}
            <div className="group relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-50 to-blue-100/50 text-[#0066FF] shadow-inner ring-1 ring-black/[0.04] transition-transform duration-500 group-hover:scale-105 dark:from-blue-900/20 dark:to-blue-800/10 dark:ring-white/[0.05]">
                {icon || <Lock className="h-10 w-10 stroke-[1.5]" />}
              </div>
              <motion.div
                className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#FFBC00] text-[#1D1D1F] shadow-md dark:border-[#1C1C1E]"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            </div>

            {/* Typography Section */}
            <div className="space-y-3 px-4 text-center">
              <h2 className="bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-[32px] leading-tight font-extrabold tracking-tight text-transparent md:text-[36px] dark:from-white dark:to-gray-400">
                {title}
              </h2>
              <p className="mx-auto max-w-[280px] text-[16px] leading-relaxed font-medium text-[#8E8E93] dark:text-[#6E6E73]">
                {description}
              </p>
            </div>
          </CardHeader>

          <CardFooter className="flex flex-col gap-4 px-10 pt-4 pb-12">
            <Button
              onClick={onLoginClick}
              size="lg"
              className="group h-14 w-full rounded-2xl bg-[#0066FF] text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(0,102,255,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0055D4] hover:shadow-[0_15px_30px_rgba(0,102,255,0.35)]"
            >
              <span>立即登录体验</span>
              <ArrowRight className="ml-2 h-5 w-5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Link href="/" className="w-full">
              <Button
                variant="ghost"
                size="lg"
                className="h-14 w-full rounded-2xl text-[16px] font-semibold text-[#8E8E93] transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-[#6E6E73] dark:hover:bg-white/5 dark:hover:text-white"
              >
                返回首页
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
