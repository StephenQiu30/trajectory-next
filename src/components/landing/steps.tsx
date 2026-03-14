"use client"

import { UploadCloud, Wand2, Share, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
    { num: "01", title: "导入数据", desc: "Excel, CSV 或是 API 快速连接", icon: <UploadCloud className="w-6 h-6" /> },
    { num: "02", title: "AI 生成", desc: "输入对话要求，瞬间得到专业图表", icon: <Wand2 className="w-6 h-6" /> },
    { num: "03", title: "分享发布", desc: "一言嵌入手册，或生成公开演示链接", icon: <Share className="w-6 h-6" /> },
]

export default function Steps() {
    return (
        <section className="w-full py-24 md:py-32 relative overflow-hidden bg-muted/30">
            <div className="w-full max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                    >
                        简单 <span className="text-primary">3 步</span> 释放灵感
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg text-foreground/60 font-medium"
                    >
                        无需复杂的学习成本，上手即用。
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Horizontal Connector (Desktop) */}
                    <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-[1px] bg-border/50" />

                    {steps.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col items-center text-center space-y-6 z-10"
                        >
                            <div className="w-20 h-20 rounded-[2rem] glass apple-shadow flex items-center justify-center text-2xl font-bold text-primary relative">
                                {s.num}
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center apple-shadow">
                                    {s.icon}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold tracking-tight">{s.title}</h3>
                                <p className="text-foreground/60 font-medium leading-relaxed max-w-[240px]">
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
