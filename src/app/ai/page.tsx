'use client'

import * as React from 'react'
import { AnalysisForm, ChartDetailModal, ChartViewer, HistoryPanel } from '@/components/ai'
import { BarChart2, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AiAnalyticsPage() {
  const [tab, setTab] = React.useState<'analyze' | 'history'>('analyze')
  const [activeAnalysis, setActiveAnalysis] = React.useState<AiAPI.ChartVO | null>(null)
  const [selectedHistoryChart, setSelectedHistoryChart] = React.useState<AiAPI.ChartVO | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <div className="bg-background text-foreground pb-20">
      {/* Chart Detail Modal */}
      <ChartDetailModal
        data={selectedHistoryChart}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <main className="shell-container pt-12">
        <Tabs value={tab} onValueChange={v => setTab(v as 'analyze' | 'history')}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">智能分析</h1>
              <p className="text-muted-foreground/60 max-w-lg text-sm font-medium leading-relaxed">
                上传数据并描述目标，AI 自动生成图表与深度洞察。
              </p>
            </div>
            <TabsList className="bg-secondary/40 w-full rounded-full p-1 sm:w-auto">
              <TabsTrigger value="analyze" className="rounded-full px-6 py-2 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                新建分析
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-full px-6 py-2 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <BarChart2 className="mr-2 h-4 w-4" />
                历史记录
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analyze" className="m-0 mt-8">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
              <aside className="w-full lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:w-[380px]">
                <div className="glass apple-shadow overflow-hidden rounded-[2rem] bg-white/50 p-8 dark:bg-white/[0.02]">
                  <AnalysisForm
                    onAnalysisSuccess={(data) => {
                      setSelectedHistoryChart(data)
                      setIsModalOpen(true)
                    }}
                    onAnalysisAsyncSuccess={() => {}}
                  />
                </div>
              </aside>

              <section className="min-h-[600px] flex-1">
                <div className="glass group relative flex min-h-[600px] items-center justify-center overflow-hidden rounded-[2.5rem] border-none bg-white/40 p-12 text-center transition-all duration-700 hover:bg-white/60 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                  {/* Subtle Background Elements */}
                  <div className="bg-primary/5 absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-110" />
                  <div className="bg-primary/5 absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-110" />

                  <div className="relative z-10 max-w-sm space-y-6">
                    <div className="bg-primary/10 text-primary mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110">
                      <BarChart2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold tracking-tight">准备就绪</h3>
                      <p className="text-muted-foreground/60 text-sm font-medium leading-relaxed">
                        在左侧配置任务并上传数据源，生成完成后将通过弹窗展示交互式图表与深度结论。
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="history" className="m-0 mt-8">
            <div className="min-h-[600px]">
              <HistoryPanel
                onSelectChart={chart => {
                  setSelectedHistoryChart(chart)
                  setIsModalOpen(true)
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
