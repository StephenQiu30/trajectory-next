'use client'

import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, BarChart3, Cpu, Sparkles, TrendingUp } from 'lucide-react'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 pt-32 pb-24"
    >
      {/* Ambient Background Elements */}
      <motion.div style={{ y: yBackground }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="from-primary/10 dark:from-primary/20 animate-blob absolute top-[-10%] left-[-5%] h-[100vh] w-[100vw] rounded-full bg-gradient-to-br via-purple-600/5 to-transparent mix-blend-multiply blur-[120px] dark:via-purple-600/10 dark:mix-blend-screen" />
        <div className="animate-blob animation-delay-2000 absolute right-[-5%] bottom-[-10%] h-[100vh] w-[100vw] rounded-full bg-gradient-to-tl from-teal-400/5 via-blue-500/5 to-transparent mix-blend-multiply blur-[120px] dark:from-teal-400/10 dark:via-blue-500/10 dark:mix-blend-screen" />
      </motion.div>

      <div className="z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
        {/* Left Side: Premium Typography */}
        <motion.div
          style={{ opacity: opacityHero }}
          className="flex flex-col items-start space-y-8 text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass flex items-center gap-2 rounded-full px-4 py-2"
          >
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-primary text-[13px] font-semibold tracking-wide uppercase">
              下一代数据引擎
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl leading-[1.1] font-bold tracking-tight md:text-7xl lg:text-8xl"
            >
              轨迹 <br />
              <span className="from-primary bg-gradient-to-r to-blue-400 bg-clip-text text-transparent">
                听见数据的声音
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-foreground/70 max-w-xl text-lg leading-relaxed font-medium md:text-xl"
            >
              通过强大的 AIGC
              引擎，将枯燥的数据瞬间转化为令人惊叹的互动图表。无需复杂的配置，赋予数据极致的表现力。
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 apple-shadow group h-14 rounded-full border-none px-8 text-base font-bold text-white transition-all"
            >
              立即免费开启
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="glass h-14 rounded-full px-8 text-base font-bold"
            >
              查看案例
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Side: Immersive Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex aspect-square w-full items-center justify-center md:aspect-video lg:aspect-square"
        >
          {/* Main Analytics Card */}
          <div className="glass apple-shadow relative w-[85%] space-y-8 overflow-hidden rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">核心用户留存</h3>
                <p className="text-foreground/50 text-sm font-medium">近 30 天趋势</p>
              </div>
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                <BarChart3 className="text-primary h-6 w-6" />
              </div>
            </div>

            <div className="space-y-6">
              {[85, 62, 95, 48].map((w, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground/50">指标 0{i + 1}</span>
                    <span>{w}%</span>
                  </div>
                  <div className="bg-secondary h-2 overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${w}%` }}
                      transition={{ duration: 1.5, delay: 1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-primary h-full rounded-full shadow-[0_0_15px_rgba(0,102,255,0.3)]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Floating elements inside or around the card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="glass absolute right-4 bottom-4 flex items-center gap-2 rounded-2xl px-4 py-2 shadow-lg"
            >
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs font-bold tracking-wider uppercase">AIGC Active</span>
            </motion.div>
          </div>

          {/* Additional floating cards for depth */}
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="glass apple-shadow absolute top-[-5%] right-[-5%] flex max-w-[200px] items-center gap-4 rounded-3xl p-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-400/20 text-orange-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[24px] font-black">+24%</div>
              <div className="text-foreground/50 text-[10px] font-bold uppercase">增长率</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="glass apple-shadow absolute bottom-[-5%] left-[-5%] flex max-w-[240px] items-center gap-4 rounded-3xl p-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-500">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold">引擎优化中</div>
              <div className="text-foreground/50 text-[10px] font-bold uppercase">智算增强开启</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
