'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnalysisForm, ChartViewer, HistoryPanel, ChartDetailModal } from '@/components/ai'
import { BarChart2, History as HistoryIcon, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AiAnalyticsPage() {
  const [showHistory, setShowHistory] = React.useState(false)
  const [activeAnalysis, setActiveAnalysis] = React.useState<AiAPI.ChartVO | null>(null)
  const [selectedHistoryChart, setSelectedHistoryChart] = React.useState<AiAPI.ChartVO | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-20">
      {/* Chart Detail Modal */}
      <ChartDetailModal
        data={selectedHistoryChart}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* Background ambient glow - Subtler */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] right-[10%] w-[30rem] h-[30rem] bg-primary/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-[5%] left-[10%] w-[25rem] h-[25rem] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-8 lg:px-12">
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
                  <h1 className="flex items-center gap-4 text-4xl font-black tracking-tight italic uppercase">
                    <div className="p-3 rounded-2xl glass apple-shadow">
                      <HistoryIcon className="h-8 w-8 text-primary" />
                    </div>
                    Archives
                  </h1>
                  <p className="text-sm font-black text-foreground/20 uppercase tracking-[0.3em] ml-1">
                    AI Analysis History
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-3xl glass apple-shadow border-none transition-all duration-500 hover:scale-110 active:scale-95 group"
                  onClick={() => setShowHistory(false)}
                >
                  <BarChart2 className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                </Button>
              </div>

              <div className="flex-1 min-h-[700px]">
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
              <div className="relative glass apple-shadow rounded-[2.5rem] px-8 py-10 border-none bg-white/40 dark:bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-8 overflow-hidden">
                <div className="space-y-2">
                  <h1 className="flex items-center gap-4 text-4xl font-bold tracking-tight">
                    <div className="p-3 rounded-2xl bg-primary/10">
                      <Wand2 className="h-8 w-8 text-primary" />
                    </div>
                    Synthesis
                  </h1>
                  <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-[0.2em] ml-1">
                    Integrated AI Intelligence & Laboratory Stage
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 rounded-2xl glass apple-shadow border-none transition-all hover:bg-white/60 dark:hover:bg-black/40 active:scale-95 group px-8 gap-3"
                  onClick={() => setShowHistory(true)}
                >
                  <HistoryIcon className="h-5 w-5 text-primary/70 transition-transform group-hover:-rotate-12" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">View History</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-10 items-start">
                {/* Configuration Sidebar */}
                <aside className="w-full">
                  <div className="glass apple-shadow rounded-[2.5rem] p-10 bg-white/60 dark:bg-gray-950/60 border-none">
                    <AnalysisForm
                      onAnalysisSuccess={setActiveAnalysis}
                      onAnalysisAsyncSuccess={() => {
                        setActiveAnalysis(null)
                      }}
                    />
                  </div>
                </aside>

                {/* Laboratory Stage */}
                <section className="w-full min-h-[700px]">
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
      </main>
    </div>
  )
}
