'use client'

import { Share, UploadCloud, Wand2 } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: '导入数据',
    desc: 'Excel, CSV 或是 API 快速连接',
    icon: <UploadCloud className="h-6 w-6" />,
  },
  {
    num: '02',
    title: 'AI 生成',
    desc: '输入对话要求，瞬间得到专业图表',
    icon: <Wand2 className="h-6 w-6" />,
  },
  {
    num: '03',
    title: '分享发布',
    desc: '一言嵌入手册，或生成公开演示链接',
    icon: <Share className="h-6 w-6" />,
  },
]

export default function Steps() {
  return (
    <section className="bg-muted/30 relative w-full overflow-hidden py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mx-auto mb-20 max-w-2xl space-y-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            简单 <span className="text-primary">3 步</span> 释放灵感
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-foreground/60 text-lg font-medium"
          >
            无需复杂的学习成本，上手即用。
          </motion.p>
        </div>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Horizontal Connector (Desktop) */}
          <div className="bg-border/50 absolute top-10 right-[20%] left-[20%] hidden h-[1px] md:block" />

          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="z-10 flex flex-col items-center space-y-6 text-center"
            >
              <div className="glass apple-shadow text-primary relative flex h-20 w-20 items-center justify-center rounded-[2rem] text-2xl font-bold">
                {s.num}
                <div className="bg-primary apple-shadow absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-xl text-white">
                  {s.icon}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight">{s.title}</h3>
                <p className="text-foreground/60 max-w-[240px] leading-relaxed font-medium">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
