'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnalysisForm, ChartDetailModal, ChartViewer, HistoryPanel } from '@/components/ai'
import { BarChart2, History as HistoryIcon, Loader2, Target, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AiAnalyticsPage() {
  const [showHistory, setShowHistory] = React.useState(false)
  const [activeAnalysis, setActiveAnalysis] = React.useState<AiAPI.ChartVO | null>(null)
  const [selectedHistoryChart, setSelectedHistoryChart] = React.useState<AiAPI.ChartVO | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <div className="bg-background text-foreground min-h-screen pb-20 transition-colors duration-500">
      {/* Chart Detail Modal */}
      <ChartDetailModal
        data={selectedHistoryChart}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* Atmospheric Backgrounds */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Technical Mesh Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Technical Large Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '200px 200px',
          }}
        />
        <div className="bg-primary/5 absolute top-[5%] right-[10%] h-[30rem] w-[30rem] rounded-full blur-[100px] dark:bg-primary/20" />
        <div className="bg-primary/5 absolute bottom-[5%] left-[10%] h-[25rem] w-[25rem] rounded-full blur-[100px] dark:bg-primary/20" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-8 lg:px-12">
        <React.Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          }
        >
          <AnimatePresence mode="wait">
            {showHistory ? (
              <motion.div
                key="history-view"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-12"
              >
                <div className="flex items-center justify-between px-2">
                  <div className="space-y-1">
                    <h1 className="flex items-center gap-4 text-4xl font-black tracking-tight uppercase italic">
                      <div className="glass apple-shadow rounded-2xl p-3">
                        <HistoryIcon className="text-primary h-8 w-8" />
                      </div>
                      Archives
                    </h1>
                    <p className="text-foreground/40 ml-1 text-sm font-black tracking-[0.3em] dark:text-foreground/60 uppercase">
                      AI Analysis History
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="glass apple-shadow group h-14 w-14 rounded-3xl border-none transition-all duration-500 hover:scale-110 active:scale-95"
                    onClick={() => setShowHistory(false)}
                  >
                    <BarChart2 className="h-6 w-6 transition-transform group-hover:rotate-12" />
                  </Button>
                </div>

                <div className="min-h-[700px] flex-1">
                  <HistoryPanel
                    onSelectChart={chart => {
                      setSelectedHistoryChart(chart)
                      setIsModalOpen(true)
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="main-view"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-10"
              >
                <div className="glass apple-shadow group relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/40 px-10 py-8 shadow-xl sm:flex-row dark:border-white/5 dark:bg-white/[0.02]">
                  {/* Subtle Accent for Header Board */}
                  <div className="bg-primary/5 absolute top-0 left-0 h-1 w-full" />
                  
                  <div className="flex items-center gap-6">
                    <div className="glass flex h-16 w-16 items-center justify-center rounded-2xl p-4 shadow-inner ring-1 ring-white/20">
                      <Wand2 className="text-primary h-8 w-8 transition-transform duration-500 group-hover:rotate-6" />
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-4xl font-black tracking-tight italic uppercase">Synthesis</h1>
                      <div className="flex items-center gap-3">
                        <p className="text-muted-foreground/60 text-[10px] font-black tracking-[0.3em] dark:text-muted-foreground/80 uppercase">
                          AI Intelligence Stage
                        </p>
                        <div className="bg-primary/20 h-1 w-1 rounded-full" />
                        <span className="text-primary/40 text-[8px] font-black tracking-[0.4em] uppercase">SYSTEM_READY</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="glass apple-shadow group h-14 gap-3 rounded-2xl border-none px-8 font-bold transition-all hover:bg-primary hover:text-white active:scale-95"
                    onClick={() => setShowHistory(true)}
                  >
                    <HistoryIcon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                    <span className="text-[12px] tracking-[0.1em] uppercase">
                      Archives
                    </span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[380px_1fr]">
                  {/* Configuration Sidebar */}
                  <aside className="w-full lg:sticky lg:top-8">
                    <div className="glass apple-shadow flex h-full flex-col rounded-[2.5rem] border-none p-10">
                      <div className="mb-10 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                            <Target className="text-primary h-5 w-5" />
                          </div>
                          <h2 className="text-3xl font-bold tracking-tight">配置分析任务</h2>
                        </div>
                        <p className="text-muted-foreground/40 text-[11px] font-bold tracking-[0.2em] uppercase">
                          Mission Configuration Intelligence
                        </p>
                      </div>
                      <div className="flex-1">
                        <AnalysisForm
                          onAnalysisSuccess={setActiveAnalysis}
                          onAnalysisAsyncSuccess={() => setActiveAnalysis(null)}
                        />
                      </div>
                    </div>
                  </aside>

                  {/* Laboratory Stage */}
                  <section className="flex flex-1 flex-col overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full"
                    >
                      {activeAnalysis ? (
                        <ChartViewer data={activeAnalysis} />
                      ) : (
                        <div className="glass group relative flex h-full flex-1 flex-col items-center justify-center rounded-[3.5rem] border border-white/10 bg-white/40 shadow-2xl dark:border-white/5 dark:bg-white/[0.02]">
                          {/* Corner Accents for Placeholder */}
                          <div className="text-primary/20 absolute top-10 left-10 h-6 w-6 border-t-2 border-l-2 transition-colors duration-500 group-hover:text-primary/40" />
                          <div className="text-primary/20 absolute right-10 bottom-10 h-6 w-6 border-r-2 border-b-2 transition-colors duration-500 group-hover:text-primary/40" />
                          
                          <div className="relative mb-8">
                            <div className="bg-primary/10 absolute inset-0 animate-pulse rounded-full blur-3xl" />
                            <div className="bg-primary/20 relative flex h-32 w-32 items-center justify-center rounded-[2.5rem] backdrop-blur-xl ring-1 ring-white/20">
                              <BarChart2 className="text-primary h-14 w-14 animate-pulse" />
                            </div>
                          </div>
                          <div className="relative z-10 space-y-4 text-center">
                            <h3 className="text-4xl font-black tracking-tight italic uppercase">准备就绪</h3>
                            <p className="text-muted-foreground/40 mx-auto max-w-[320px] text-[10px] font-black tracking-[0.2em] leading-relaxed uppercase">
                              配置任务并上传数据源，让 AI 引擎为您挖掘深层数据脉络。
                            </p>
                          </div>
                          
                          {/* Diagnostic Info Strip at Bottom */}
                          <div className="absolute bottom-10 flex items-center gap-8 opacity-20">
                            <span className="text-[10px] font-bold tracking-[0.4em] monospaced uppercase italic">Ready_to_process</span>
                            <div className="bg-foreground/40 h-1 w-1 rounded-full" />
                            <span className="text-[10px] font-bold tracking-[0.4em] monospaced uppercase italic">Awaiting_data</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </React.Suspense>
      </main>
    </div>
  )
}
