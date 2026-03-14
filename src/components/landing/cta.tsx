'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="bg-background relative w-full overflow-hidden px-6 py-24 text-center md:py-32">
      <div className="bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-full w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />

      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-bold tracking-tight md:text-6xl"
          >
            让数据讲述它的故事
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-foreground/60 mx-auto max-w-xl text-lg font-medium md:text-xl"
          >
            告别繁琐配置，将精力回归本质洞察。剩下的，交给我们。
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 apple-shadow group h-16 rounded-full px-10 text-lg font-bold text-white transition-all"
          >
            立即免费开启
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
