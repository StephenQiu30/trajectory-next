'use client'

import { Card } from '@/components/ui/card'
import { Activity, GripHorizontal, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: <Zap className="text-primary h-6 w-6" />,
    title: '极致响应速度',
    desc: '毫秒级的数据处理引擎，确保您的每一项操作都能得到即时反馈。',
    isWide: true,
  },
  {
    icon: <Sparkles className="text-primary h-6 w-6" />,
    title: 'AIGC 智能引擎',
    desc: '一句话描述需求，AI 自动提取数据特征并生成最佳可视化图表。',
    isWide: false,
  },
  {
    icon: <Activity className="text-primary h-6 w-6" />,
    title: '实时数据联动',
    desc: '支持多种数据源接入，改动即时反映在图表中，拒绝反复导出。',
    isWide: false,
  },
  {
    icon: <GripHorizontal className="text-primary h-6 w-6" />,
    title: '灵动自由排版',
    desc: '像做 PPT 一样搭建数据看板，感受无拘无束的自由画布体验。',
    isWide: true,
  },
]

export default function Features() {
  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-6 py-24 md:py-32">
      <div className="mb-16 max-w-2xl space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-bold tracking-tight md:text-5xl"
        >
          释放数据的潜力
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-foreground/60 text-lg font-medium"
        >
          克制的工具，带来最高效的创造力体验。每一个细节都经过精心打磨。
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={f.isWide ? 'md:col-span-2' : 'md:col-span-1'}
          >
            <Card className="glass apple-shadow group relative h-full overflow-hidden rounded-[2.5rem] border-none p-8 transition-all duration-500 hover:-translate-y-1 md:p-10">
              <div className="relative z-10 space-y-6">
                <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110">
                  {f.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight">{f.title}</h3>
                  <p className="text-foreground/60 leading-relaxed font-medium">{f.desc}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
