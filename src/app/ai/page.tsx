'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnalysisForm, ChartDetailModal, ChartViewer, HistoryPanel } from '@/components/ai'
import { BarChart2, History as HistoryIcon, Loader2, Wand2 } from 'lucide-react'
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

      {/* Background ambient glow - Subtler */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/3 absolute top-[5%] right-[10%] h-[30rem] w-[30rem] rounded-full blur-[100px]" />
        <div className="bg-primary/3 absolute bottom-[5%] left-[10%] h-[25rem] w-[25rem] rounded-full blur-[100px]" />
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
                    <p className="text-foreground/20 ml-1 text-sm font-black tracking-[0.3em] uppercase">
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
                <div className="glass apple-shadow relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[2.5rem] border-none bg-white/40 px-8 py-10 sm:flex-row dark:bg-black/20">
                  <div className="space-y-2">
                    <h1 className="flex items-center gap-4 text-4xl font-bold tracking-tight">
                      <div className="bg-primary/10 rounded-2xl p-3">
                        <Wand2 className="text-primary h-8 w-8" />
                      </div>
                      Synthesis
                    </h1>
                    <p className="text-muted-foreground/50 ml-1 text-xs font-semibold tracking-[0.2em] uppercase">
                      Integrated AI Intelligence & Laboratory Stage
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="glass apple-shadow group h-14 gap-3 rounded-2xl border-none px-8 transition-all hover:bg-white/60 active:scale-95 dark:hover:bg-black/40"
                    onClick={() => setShowHistory(true)}
                  >
                    <HistoryIcon className="text-primary/70 h-5 w-5 transition-transform group-hover:-rotate-12" />
                    <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                      View History
                    </span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-[400px_1fr]">
                  {/* Configuration Sidebar */}
                  <aside className="w-full">
                    <div className="glass apple-shadow rounded-[2.5rem] border-none bg-white/60 p-10 dark:bg-gray-950/60">
                      <AnalysisForm
                        onAnalysisSuccess={setActiveAnalysis}
                        onAnalysisAsyncSuccess={() => {
                          setActiveAnalysis(null)
                        }}
                      />
                    </div>
                  </aside>

                  {/* Laboratory Stage */}
                  <section className="min-h-[700px] w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full"
                    >
                      <ChartViewer data={activeAnalysis} />
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
