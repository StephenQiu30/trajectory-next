'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, BarChart3, Code2, Cpu, Layers, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function LandingPage() {
  const { scrollY } = useScroll()
  const yHero = useTransform(scrollY, [0, 500], [0, 100])
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const scale = useSpring(useTransform(scrollY, [0, 500], [1, 0.95]), springConfig)

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
      title: 'AI 智能生成',
      description: '只需输入一段文字，AI 即可根据您的业务需求，自动生成精准、专业的分析图表。',
      className: 'md:col-span-2',
      bg: 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30',
    },
    {
      icon: <Layers className="h-6 w-6 text-orange-500" />,
      title: '全维度数据洞察',
      description: '深度挖掘数据背后的关联，自动识别异常点与趋势，提供全方位的数据视角。',
      className: 'md:col-span-1',
      bg: 'bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30',
    },
    {
      icon: <Cpu className="h-6 w-6 text-purple-500" />,
      title: '强大的算法引擎',
      description: '集成多种先进的大模型算法，支持大规模数据并行处理，让分析效率大幅提升。',
      className: 'md:col-span-3',
      bg: 'bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30',
    },
  ]

  return (
    <div className="bg-background min-h-screen overflow-x-hidden font-sans selection:bg-[#0071e3]/20">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-6 pt-32 pb-20 md:pt-48">
        {/* Background Gradients - Refined Apple Style */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-[#0071e3]/5 opacity-60 blur-[120px] filter" />
          <div className="absolute top-[-10%] right-[20%] h-[50vw] w-[50vw] rounded-full bg-indigo-400/5 opacity-60 blur-[120px] filter" />
        </div>

        <motion.div
          style={{ y: yHero, opacity: opacityHero, scale }}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/50 px-4 py-1.5 text-sm font-medium text-black/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-white/80">
              <Sparkles className="h-3.5 w-3.5 text-[#0071e3]" />
              <span>AIGC 数据智能</span>
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mt-8 text-5xl font-semibold tracking-tight text-black md:text-7xl lg:text-8xl dark:text-white"
          >
            轨迹：
            <br />
            <span className="bg-gradient-to-r from-[#0071e3] to-indigo-600 bg-clip-text pb-2 text-transparent">
              让数据讲述故事。
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mt-6 max-w-2xl text-xl leading-relaxed font-medium md:text-2xl"
          >
            基于 AIGC 的智能数据可视化平台。
            <br className="hidden md:block" />
            通过自然语言，开启您的智能数据探索之旅。
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-full bg-black px-8 text-base font-medium text-white shadow-lg transition-all hover:scale-105 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              asChild
            >
              <Link href="/ai">立即开始</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-black/10 bg-white/50 px-8 text-base font-medium backdrop-blur-md transition-all hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              asChild
            >
              <Link href="https://github.com/StephenQiu30/trajectory-next" target="_blank">
                查看源码
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-20 px-4 pb-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative h-[400px] w-full overflow-hidden rounded-[3rem] border border-black/5 bg-white/50 shadow-2xl backdrop-blur-3xl md:h-[600px] dark:border-white/10 dark:bg-white/5"
          >
            {/* Visual Design Mockup */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)] from-blue-500/10 opacity-50" />
            <div className="relative flex h-full items-center justify-center p-8 md:p-12">
              <div className="grid w-full items-center gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-blue-500">AI 分析中...</span>
                  </div>
                  <h3 className="text-2xl font-bold md:text-3xl">轨迹：让数据讲述动人故事</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    无需复杂的专业知识，通过简单的对话即可将原始零散的数据转化为具备深度洞察力的可视化看板。
                  </p>
                  <div className="flex gap-4">
                    <div className="h-1 w-24 rounded-full bg-blue-500/20">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </div>
                <div className="relative aspect-square md:aspect-auto md:h-[400px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <BarChart3 className="h-32 w-32 text-blue-500 opacity-20" />
                      <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-indigo-500" />
                      </motion.div>
                    </div>
                  </div>
                  {/* Floating abstract chart elements */}
                  <div className="absolute top-10 right-10 flex gap-1">
                    {[30, 60, 45, 80, 50].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-4 rounded-t-lg bg-blue-500/40"
                        initial={{ height: 0 }}
                        whileInView={{ height: h }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="bg-secondary/30 relative px-6 py-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">释放数据的力量</h2>
            <p className="text-muted-foreground mt-4 text-xl font-medium md:text-2xl">
              让每一个数据点都讲述动人的故事。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'group relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-white/5 dark:bg-black/40',
                  feature.className
                )}
              >
                <div
                  className={cn(
                    'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                    feature.bg
                  )}
                />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110 dark:bg-white/10">
                      {feature.icon}
                    </div>
                    <h3 className="mb-3 text-2xl font-semibold tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase / Parallax Section */}
      <section className="overflow-hidden px-6 py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="grid items-center gap-20 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#0071e3]/10 px-3 py-1 text-sm font-semibold text-[#0071e3]">
                  <Code2 className="h-4 w-4" />
                  <span>开发者优先</span>
                </div>
                <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
                  为学生和专业人士 <br />
                  <span className="text-muted-foreground">精心打造。</span>
                </h2>
                <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                  无论您是企业管理者还是数据分析师，我们的 AIGC 平台都能为您提供最直观的数据支持。
                </p>

                <ul className="space-y-6 pt-4">
                  {[
                    { icon: Cpu, text: 'AI 自动生成图表' },
                    { icon: Layers, text: '多维数据联动' },
                    { icon: Sparkles, text: '极简录入与探索' },
                  ].map((Item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-4 text-lg font-medium"
                    >
                      <div className="bg-secondary text-primary flex h-12 w-12 items-center justify-center rounded-full">
                        <Item.icon className="h-6 w-6" />
                      </div>
                      {Item.text}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[3rem] border border-black/5 bg-gradient-to-tr from-gray-50 to-white p-8 shadow-2xl dark:border-white/10 dark:from-gray-900 dark:to-black">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="relative z-10 w-full max-w-sm rounded-2xl bg-[#0a0a0a] p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-3xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-[#5c6370] uppercase">
                      AIGC_ANALYTICS.PRO
                    </div>
                  </div>
                  <div className="font-mono text-[13px] leading-relaxed">
                    <div className="flex gap-2">
                      <span className="text-[#c678dd]">User:</span>
                      <span className="text-white">帮我分析去年的销售趋势</span>
                    </div>
                    <div className="my-3 border-t border-white/5" />
                    <div className="flex gap-2">
                      <span className="text-[#98c379]">AI:</span>
                      <span className="text-white/80">正在生成年度销售趋势图表...</span>
                    </div>
                    <div className="mt-4 flex h-16 items-end gap-1.5">
                      <div className="h-[40%] w-2 rounded-t-sm bg-[#61afef]/40" />
                      <div className="h-[60%] w-2 rounded-t-sm bg-[#61afef]/60" />
                      <div className="h-[90%] w-2 rounded-t-sm bg-[#61afef]" />
                      <div className="h-[70%] w-2 rounded-t-sm bg-[#61afef]/70" />
                      <div className="h-[50%] w-2 rounded-t-sm bg-[#61afef]/50" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-40">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-semibold tracking-tight md:text-7xl">准备好开始了吗？</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl font-medium md:text-2xl">
              立即使用我们的智能工具，开启您的数据可视化探索之旅。
            </p>
            <div className="flex items-center justify-center gap-4 pt-8">
              <Button
                size="lg"
                className="h-16 rounded-full bg-[#0071e3] px-12 text-xl font-medium text-white shadow-xl transition-all hover:scale-105 hover:bg-[#0071e3]/90 active:scale-95"
                asChild
              >
                <Link href="/ai">
                  立即开启之旅 <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
