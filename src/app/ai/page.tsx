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

      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[10%] left-[5%] w-[35rem] h-[35rem] bg-primary/5 rounded-full blur-[120px] animate-blob [animation-delay:2s]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1400px] px-6 pt-32 lg:px-12">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-10"
            >
              <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                  <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
                    <div className="p-2 rounded-2xl glass apple-shadow">
                      <HistoryIcon className="h-7 w-7 text-primary" />
                    </div>
                    历史分析记录
                  </h1>
                  <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest ml-1">
                    AI Analysis History
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full glass apple-shadow border-none transition-all duration-500 hover:scale-110 active:scale-95"
                  onClick={() => setShowHistory(false)}
                  title="返回分析配置"
                >
                  <BarChart2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 min-h-[600px]">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-10 lg:flex-row"
            >
              {/* Left Sidebar */}
              <aside className="w-full flex flex-col gap-8 lg:w-[460px] lg:shrink-0">
                <div className="flex items-center justify-between px-2">
                  <div className="space-y-1">
                    <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
                      <div className="p-2 rounded-2xl glass apple-shadow">
                        <Wand2 className="h-7 w-7 text-primary" />
                      </div>
                      数据洞察
                    </h1>
                    <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest ml-1">
                      Data Insights Platform
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full glass apple-shadow border-none transition-all duration-500 hover:scale-110 active:scale-95"
                    onClick={() => setShowHistory(true)}
                    title="查看历史记录"
                  >
                    <HistoryIcon className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1">
                  <AnalysisForm
                    onAnalysisSuccess={setActiveAnalysis}
                    onAnalysisAsyncSuccess={() => {
                      setActiveAnalysis(null)
                    }}
                  />
                </div>
              </aside>

              {/* Right Stage */}
              <section className="flex-1 min-h-[600px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <ChartViewer data={activeAnalysis} />
                </motion.div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
