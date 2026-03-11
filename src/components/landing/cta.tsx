"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function CTA() {
    return (
        <section className="relative w-full overflow-hidden px-6 py-24 md:py-32 text-center bg-background">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full max-w-4xl bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-3xl mx-auto space-y-10">
                <div className="space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl font-bold tracking-tight"
                    >
                        让数据讲述它的故事
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg md:text-xl text-foreground/60 font-medium max-w-xl mx-auto"
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
                        className="rounded-full bg-primary hover:bg-primary/90 text-white px-10 h-16 text-lg font-bold transition-all apple-shadow group"
                    >
                        立即免费开启
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
