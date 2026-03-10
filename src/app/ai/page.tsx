'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { AnalysisForm } from '@/components/ai'
import { ChartViewer } from '@/components/ai'
import { HistoryPanel } from '@/components/ai'
import { Sparkles, History as HistoryIcon, Wand2, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AiAnalyticsPage() {
  const [showHistory, setShowHistory] = React.useState(false)
  const [activeAnalysis, setActiveAnalysis] = React.useState<AiAPI.ChartVO | null>(null)

  return (
    <div className="bg-background flex min-h-screen flex-col font-sans selection:bg-[#0071e3]/20">
      {/* Pure color background */}
      <div className="pointer-events-none fixed inset-0 bg-[#fbfbfd] dark:bg-[#000000]" />

      <main className="relative z-10 container mx-auto flex max-w-[1400px] flex-1 flex-col px-4 py-8 md:py-12">
        {/* Apple-style Glass Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-2xl md:flex-row md:items-center dark:border-white/5 dark:bg-black/40"
        >
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Wand2 className="h-3.5 w-3.5" />
              <span>AIGC Analytics Engine</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-gray-100">
              让数据<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">灵动</span>起来。
            </h1>
            <p className="max-w-xl text-base text-gray-500 dark:text-gray-400">
              无需复杂操作，上传数据，输入需求，AI 为您呈现可交互的深度数据洞察。
            </p>
          </div>

          <div className="relative z-10 flex shrink-0 items-center gap-3">
            <Button
              variant={showHistory ? 'default' : 'outline'}
              className={`h-11 rounded-full px-6 text-sm font-medium transition-all ${showHistory
                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                : 'border-black/5 bg-white/80 text-gray-700 shadow-sm backdrop-blur-md hover:bg-gray-50 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20'
                }`}
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? (
                <>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  返回工作台
                </>
              ) : (
                <>
                  <HistoryIcon className="mr-2 h-4 w-4" />
                  历史分析库
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="flex-1">
          {showHistory ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <HistoryPanel
                onSelectChart={chart => {
                  setActiveAnalysis(chart)
                  setShowHistory(false)
                }}
              />
            </motion.div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-12">
              <motion.div
                className="lg:col-span-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="sticky top-6">
                  <AnalysisForm
                    onAnalysisSuccess={setActiveAnalysis}
                    onAnalysisAsyncSuccess={() => {
                      setActiveAnalysis(null)
                      setShowHistory(true)
                    }}
                  />
                </div>
              </motion.div>

              <motion.div
                className="h-full lg:col-span-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                <ChartViewer data={activeAnalysis} />
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
