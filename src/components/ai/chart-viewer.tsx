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
        <div className="glass apple-shadow rounded-[2rem] border-none overflow-hidden bg-white/60 dark:bg-gray-950/60 h-full flex flex-col relative group">
          {/* Central Ready Visual */}
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative">
            <div className="relative mb-6">
              <div className="relative z-10 w-20 h-20 rounded-3xl bg-white dark:bg-black shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 rounded-3xl border border-primary/5 bg-primary/[0.02]" />
                <Sparkles className="h-8 w-8 text-primary/40" />
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <h2 className="text-xl font-bold tracking-tight text-foreground/40">
                准备就绪
              </h2>
              <p className="max-w-md mx-auto text-muted-foreground/30 text-[10px] font-semibold uppercase tracking-[0.2em]">
                配置任务并上传数据以开启深度洞察
              </p>
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
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        },
        tooltip: {
          ...chartOption.tooltip,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'transparent',
          textStyle: { color: '#000', fontSize: 13, fontWeight: 600 },
          borderRadius: 12,
          padding: [10, 14],
          shadowBlur: 15,
          shadowColor: 'rgba(0, 0, 0, 0.05)',
        },
        grid: {
          ...chartOption.grid,
          top: 60,
          bottom: 30,
          left: 40,
          right: 20,
          containLabel: true,
        },
        series: (chartOption.series || []).map((s: any) => {
          const newSeries = { ...s }
          if (newSeries.type === 'line') {
            newSeries.smooth = true
            newSeries.symbolSize = 6
            newSeries.lineStyle = { width: 3 }
            newSeries.areaStyle = {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{ offset: 0, color: 'rgba(0, 102, 255, 0.08)' }, { offset: 1, color: 'rgba(0, 102, 255, 0)' }]
              }
            }
          }
          if (newSeries.type === 'bar') {
            newSeries.itemStyle = { borderRadius: [6, 6, 0, 0] }
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
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Area */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">
                Analysis Results
              </span>
              <div className={cn(
                "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest",
                data.status === 'succeed' ? "text-green-600/80" :
                data.status === 'running' ? "text-primary/80" : "text-destructive/80"
              )}>
                <div className={cn(
                  "h-1 w-1 rounded-full",
                  data.status === 'succeed' ? "bg-green-500" :
                  data.status === 'running' ? "bg-primary animate-pulse" : "bg-destructive"
                )} />
                {data.status === 'succeed' ? 'Success' :
                 data.status === 'running' ? 'Running' : 'Failed'}
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
              结果看板
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: 'Type', value: data.chartType || 'Chart', icon: BarChart2 },
              { label: 'Mode', value: 'AI Smart', icon: Sparkles },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest px-3 py-1.5 rounded-lg border border-border/10">
                <item.icon className="h-3 w-3 text-primary/40" />
                <span>{item.label}: <span className="text-foreground/60">{item.value}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Simplified Goal Container */}
        <div className="glass p-5 rounded-2xl bg-primary/[0.01] border-none group">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Info className="h-3 w-3" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">分析目标</span>
              <p className="text-sm font-medium text-foreground/70 leading-relaxed italic">
                "{data.goal || '探索性分析模式'}"
              </p>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={`viewer-${data.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8"
        >
          {/* Main Visual Stage */}
          <div className="glass apple-shadow rounded-[2rem] border-none overflow-hidden bg-white/60 dark:bg-gray-950/60 relative flex flex-col min-h-[500px]">
            <div className="px-6 py-4 border-b border-border/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold tracking-tight">可视化看板</h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex items-center justify-center">
              {data.status === 'failed' ? (
                <div className="flex flex-col items-center justify-center space-y-4 p-10 opacity-60">
                  <Trash2 className="h-10 w-10 text-destructive/40" />
                  <div className="text-center space-y-1">
                    <p className="text-base font-bold">分析失败</p>
                    <p className="text-[11px] font-medium">请检查数据格式后重试</p>
                  </div>
                </div>
              ) : data.genChart ? (
                <div className="w-full h-full relative group">
                  <ReactECharts
                    option={chartOption}
                    style={{ height: '400px', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-40">
                  <Cpu className="h-8 w-8 animate-pulse" />
                  <p className="text-[10px] font-bold tracking-widest uppercase italic">Preparing...</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Strategy & Insights */}
          <aside className="glass apple-shadow p-6 rounded-[2rem] border-none bg-white/60 dark:bg-gray-950/60 flex flex-col">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight">AI 洞察报告</h3>
              </div>
            </div>

            {data.genResult ? (
              <div className="flex-1 text-muted-foreground/90 leading-relaxed text-sm scrollbar-thin overflow-y-auto pr-2 max-h-[460px]">
                <MarkdownRender content={data.genResult} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-30">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-center">正在生成分析...</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-border/5 flex items-center justify-between">
              <span className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">
                Trajectory Engine v2.0
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
            </div>
          </aside>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
