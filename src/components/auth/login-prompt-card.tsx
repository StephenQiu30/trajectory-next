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
  description = '请登录以查看系统通知',
  icon,
}: LoginPromptCardProps) {
  return (
    <div className="flex w-full items-center justify-center py-12">
      {/* Card Content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-md"
      >
        <Card className="border-white/40 bg-white/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-zinc-900/60">
          <CardHeader className="flex flex-col items-center space-y-10 pt-16 pb-8">
            {/* Icon Container - Squircle with superellipse-like feel */}
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-white text-[#007AFF] shadow-[0_10px_20px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] dark:bg-zinc-800 dark:text-blue-400 dark:ring-white/[0.05]">
                {icon || <Lock className="h-10 w-10 stroke-[1.5]" />}
              </div>
              <motion.div
                className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFBC00] text-[#1D1D1F] shadow-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </motion.div>
            </div>

            {/* Typography Section */}
            <div className="space-y-4 text-center">
              <h2 className="text-[34px] leading-tight font-bold tracking-[-0.03em] text-[#1D1D1F] dark:text-[#F5F5F7]">
                {title}
              </h2>
              <p className="mx-auto max-w-[260px] text-[17px] leading-relaxed font-medium tracking-tight text-[#86868B]">
                {description}
              </p>
            </div>
          </CardHeader>

          <CardFooter className="flex flex-col gap-4 p-10 pt-4">
            <Button
              onClick={onLoginClick}
              size="lg"
              className="h-14 w-full rounded-2xl bg-[#007AFF] text-[17px] font-semibold tracking-tight text-white shadow-[0_15px_30px_rgba(0,122,255,0.25)] transition-all hover:scale-[1.01] hover:bg-[#007AFF]/90 active:scale-[0.99]"
            >
              立即登录
              <ArrowRight className="ml-2 h-5 w-5 stroke-[2.5]" />
            </Button>

            <Link href="/" className="w-full">
              <Button
                variant="ghost"
                size="lg"
                className="h-14 w-full rounded-2xl text-[17px] font-semibold tracking-tight text-[#007AFF] transition-all hover:bg-[#007AFF]/5 active:scale-[0.99]"
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
