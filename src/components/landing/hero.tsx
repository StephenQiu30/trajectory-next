"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Sparkles, BarChart3, TrendingUp, Cpu, ArrowRight } from "lucide-react"

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center px-6 pt-32 pb-24 overflow-hidden">
            {/* Ambient Background Elements */}
            <motion.div style={{ y: yBackground }} className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-5%] w-[100vw] h-[100vh] bg-gradient-to-br from-primary/10 via-purple-600/5 to-transparent dark:from-primary/20 dark:via-purple-600/10 blur-[120px] rounded-full animate-blob mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[100vw] h-[100vh] bg-gradient-to-tl from-teal-400/5 via-blue-500/5 to-transparent dark:from-teal-400/10 dark:via-blue-500/10 blur-[120px] rounded-full animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
            </motion.div>

            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center z-10">
                {/* Left Side: Premium Typography */}
                <motion.div 
                    style={{ opacity: opacityHero }}
                    className="flex flex-col items-start text-left space-y-8"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="glass px-4 py-2 rounded-full flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[13px] font-semibold tracking-wide text-primary uppercase">下一代数据引擎</span>
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
                        >
                            轨迹 <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                                听见数据的声音
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-lg md:text-xl text-foreground/70 font-medium max-w-xl leading-relaxed"
                        >
                            通过强大的 AIGC 引擎，将枯燥的数据瞬间转化为令人惊叹的互动图表。无需复杂的配置，赋予数据极致的表现力。
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
                            className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 h-14 text-base font-bold transition-all apple-shadow group border-none"
                        >
                            立即免费开启
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            className="rounded-full px-8 h-14 text-base font-bold glass"
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
                    className="relative w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center"
                >
                    {/* Main Analytics Card */}
                    <div className="glass apple-shadow w-[85%] rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">核心用户留存</h3>
                                <p className="text-sm text-foreground/50 font-medium">近 30 天趋势</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-primary" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[85, 62, 95, 48].map((w, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-foreground/50">指标 0{i + 1}</span>
                                        <span>{w}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${w}%` }}
                                            transition={{ duration: 1.5, delay: 1 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                                            className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(0,102,255,0.3)]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Floating elements inside or around the card */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-4 right-4 glass px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg"
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider">AIGC Active</span>
                        </motion.div>
                    </div>

                    {/* Additional floating cards for depth */}
                    <motion.div
                        animate={{ y: [-15, 15, -15] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-5%] right-[-5%] glass p-6 rounded-3xl apple-shadow flex items-center gap-4 max-w-[200px]"
                    >
                        <div className="w-10 h-10 rounded-full bg-orange-400/20 text-orange-500 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[24px] font-black">+24%</div>
                            <div className="text-[10px] font-bold text-foreground/50 uppercase">增长率</div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [10, -10, 10] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[-5%] left-[-5%] glass p-6 rounded-3xl apple-shadow flex items-center gap-4 max-w-[240px]"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold">引擎优化中</div>
                            <div className="text-[10px] font-bold text-foreground/50 uppercase">智算增强开启</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
