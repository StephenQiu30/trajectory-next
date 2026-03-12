'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import { AnimatePresence, motion } from 'framer-motion'
import { MarkdownRender } from '@/components/markdown/markdown-render'
import { Cpu, FileSearch, Sparkles, Trash2, TrendingUp, BarChart2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChartViewer({ data }: { data: AiAPI.ChartVO | null }) {
  if (!data) {
    return (
      <div className="flex flex-col gap-8 w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="glass apple-shadow rounded-[2.5rem] border-none overflow-hidden bg-white/60 dark:bg-gray-950/60 h-full flex flex-col relative group">
          {/* Context Header Area */}
          <div className="px-10 py-6 border-b border-border/10 flex items-center justify-between bg-white/20 dark:bg-black/10">
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight text-muted-foreground/40 uppercase">
                Laboratory Standby
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground/20 uppercase tracking-widest">
                <Cpu className="h-3 w-3" />
                <span>AI Core Engine Ready</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/20 uppercase tracking-widest">
              v2.0.4 AI_CORE
            </div>
          </div>

          {/* Central Ready Visual */}
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative">
            <div className="relative mb-10">
              <div className="relative z-10 w-24 h-24 rounded-3xl bg-white dark:bg-black shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 rounded-3xl border border-primary/5 bg-primary/[0.02]" />
                <Sparkles className="h-10 w-10 text-primary/40" />
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <h2 className="text-2xl font-bold tracking-tight text-muted-foreground/60">
                Waiting for Data
              </h2>
              <p className="max-w-md mx-auto text-muted-foreground/30 text-xs font-medium leading-relaxed uppercase tracking-widest">
                Configure your analysis task and inject data to begin
              </p>
            </div>
          </div>

          {/* Bottom Tech Bar */}
          <div className="px-10 py-5 border-t border-border/10 bg-secondary/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500/40" />
                <span className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">Engine Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500/20" />
                <span className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">Memory Idle</span>
              </div>
            </div>
            <div className="text-muted-foreground/10 font-bold text-[9px] tracking-widest uppercase">
              SYNTHESIS_STAGE_INIT
            </div>
          </div>
        </div>
      </div>
    )
  }

  let chartOption: any = {}
  try {
    if (data.genChart) {
      try {
        chartOption = JSON.parse(data.genChart)
      } catch (e) {
        chartOption = new Function('return ' + data.genChart)()
      }

      const biStyle = {
        backgroundColor: 'transparent',
        textStyle: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        },
        tooltip: {
          ...chartOption.tooltip,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'transparent',
          textStyle: { color: '#000', fontSize: 14, fontWeight: 600 },
          borderRadius: 16,
          padding: [12, 16],
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          ...chartOption.grid,
          top: 80,
          bottom: 40,
          left: 50,
          right: 30,
          containLabel: true,
        },
        series: (chartOption.series || []).map((s: any) => {
          const newSeries = { ...s }
          if (newSeries.type === 'line') {
            newSeries.smooth = true
            newSeries.symbolSize = 8
            newSeries.lineStyle = { width: 4 }
            newSeries.areaStyle = {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{ offset: 0, color: 'rgba(0, 102, 255, 0.1)' }, { offset: 1, color: 'rgba(0, 102, 255, 0)' }]
              }
            }
          }
          if (newSeries.type === 'bar') {
            newSeries.itemStyle = { borderRadius: [8, 8, 4, 4] }
          }
          return newSeries
        }),
      }

      chartOption = { ...chartOption, ...biStyle }
    }
  } catch (error) {
    console.error('Failed to parse chart options:', error)
  }

  return (
    <div className="flex flex-col gap-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Refined Context Header */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight text-foreground/90">
              Insight Dashboard
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">
                <Sparkles className="h-3 w-3" />
                <span>SmartCore v2</span>
              </div>
              <div className="h-3 w-[1px] bg-border hidden sm:block" />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {[
                  { label: 'ID', value: `${data.id}`, icon: Info, color: 'text-muted-foreground/30' },
                  { label: 'Type', value: data.chartType || 'Chart', icon: BarChart2, color: 'text-blue-500/60' },
                  { label: 'Mode', value: 'Interactive', icon: Cpu, color: 'text-purple-500/60' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-widest">
                    <item.icon className={cn("h-3 w-3", item.color)} />
                    <span>{item.label}: <span className="text-foreground/60">{item.value}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm bg-background/50 backdrop-blur-md self-start sm:self-center border border-border/20",
            data.status === 'succeed' ? "text-green-600" :
            data.status === 'running' ? "text-primary" : "text-destructive"
          )}>
            <div className={cn(
              "h-1.5 w-1.5 rounded-full shrink-0",
              data.status === 'succeed' ? "bg-green-500" :
              data.status === 'running' ? "bg-primary animate-pulse" : "bg-destructive"
            )} />
            {data.status === 'succeed' ? 'Analysis Complete' :
             data.status === 'running' ? 'Processing...' : 'Failed'}
          </div>
        </div>

        {/* Analysis Goal Container */}
        <div className="glass apple-shadow p-4 rounded-2xl bg-primary/[0.02] border-none relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="px-2.5 py-1 rounded-lg bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest shrink-0">
              分析目标
            </div>
            <p className="text-sm font-medium text-muted-foreground/70 leading-relaxed italic truncate lg:max-w-4xl">
              "{data.goal || '未设置目标, 探索性分析模式已激活...'}"
            </p>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={`viewer-${data.id}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row gap-8 w-full min-h-[600px]"
        >
          {/* Main Visual Stage (65%) */}
          <div className="flex-1 lg:flex-[1.6] space-y-8 h-full">
            <div className="glass apple-shadow rounded-[2.5rem] border-none overflow-hidden bg-white/60 dark:bg-gray-950/60 relative h-full flex flex-col">
              <div className="px-8 py-5 border-b border-border/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">可视化看板</h3>
                    <p className="text-[9px] font-semibold text-muted-foreground/30 uppercase tracking-widest">Interactive Laboratory</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40 animate-pulse" />
                  <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest whitespace-nowrap">Live Stream</span>
                </div>
              </div>

                <div className="p-8 flex-1">
                  {data.status === 'failed' ? (
                    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[2rem] bg-destructive/5 space-y-4 p-10 border border-destructive/10">
                      <Trash2 className="h-12 w-12 text-destructive opacity-30" />
                      <div className="text-center space-y-1">
                        <p className="text-xl font-bold text-destructive/70">分析任务失败</p>
                        <p className="text-xs text-destructive/40 font-medium">引擎执行过程中可能遇到了不规范的数据源</p>
                      </div>
                    </div>
                  ) : data.genChart ? (
                    <div className="min-h-[450px] w-full bg-white/40 dark:bg-black/20 rounded-[2rem] p-6 shadow-sm relative group">
                      <ReactECharts
                        option={chartOption}
                        style={{ height: '450px', width: '100%' }}
                        opts={{ renderer: 'svg' }}
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-[450px] flex-1 items-center justify-center rounded-[2rem] bg-secondary/10">
                      <div className="flex flex-col items-center gap-5">
                        <div className="relative">
                          <Cpu className="h-10 w-10 text-primary/20 animate-pulse" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground/20 tracking-widest uppercase italic">Preparing Laboratory...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          {/* AI Strategy & Insights Column (35%) */}
          <aside className="w-full lg:w-[400px] shrink-0 space-y-8 flex flex-col h-full">
            {data.genResult ? (
              <div className="relative group flex-1 h-full">
                <div className="glass apple-shadow p-8 rounded-[2.5rem] border-none bg-white/60 dark:bg-gray-950/60 relative z-10 overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500/40" />
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 shadow-sm">
                      <Sparkles className="h-5 w-5 text-amber-500/80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-amber-600/90 dark:text-amber-500/90">AI 深度洞察</h3>
                      <p className="text-[9px] font-semibold text-amber-500/30 uppercase tracking-widest">Strategic Intelligence</p>
                    </div>
                  </div>
                  <div className="text-muted-foreground/90 leading-relaxed prose dark:prose-invert max-w-none prose-sm flex-1">
                    <MarkdownRender content={data.genResult} />
                  </div>

                  {/* Tech Footer in Sidebox */}
                  <div className="mt-8 pt-5 border-t border-border/10">
                    <div className="flex items-center justify-between">
                      <div className="text-[9px] font-bold text-muted-foreground/10 uppercase tracking-[0.2em]">
                        Analytical Engine v2.4
                      </div>
                      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/5" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 glass apple-shadow rounded-[2.5rem] border-none bg-white/60 dark:bg-gray-950/60 flex items-center justify-center p-10 text-center italic h-full">
                <div className="space-y-3">
                  <Sparkles className="h-6 w-6 text-muted-foreground/10 mx-auto" />
                  <p className="text-[11px] font-semibold text-muted-foreground/20 uppercase tracking-widest">Generating Intelligence...</p>
                </div>
              </div>
            )}
          </aside>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
