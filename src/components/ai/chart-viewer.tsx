'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react'
import { AnimatePresence, motion } from 'framer-motion'
import { MarkdownRender } from '@/components/markdown/markdown-render'
import { useTheme } from 'next-themes'
import { BarChart2, Cpu, Info, Sparkles, Trash2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function ChartViewer({ data }: { data: AiAPI.ChartVO | null }) {
  const { theme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark' || theme === 'dark'

  if (!data) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 flex h-full w-full flex-col gap-8 duration-1000">
        <div className="glass apple-shadow group relative flex h-full min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] border-none bg-white/60 dark:bg-white/[0.03]">
          {/* Central Ready Visual */}
          <div className="relative flex flex-1 flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-8">
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-sm transition-transform duration-700 group-hover:scale-110 dark:bg-white/5">
                <div className="border-primary/5 bg-primary/[0.02] absolute inset-0 rounded-[2rem] border" />
                <Sparkles className="text-primary h-10 w-10" />
              </div>
              <div className="bg-primary/20 absolute -inset-4 z-0 animate-pulse rounded-full blur-2xl" />
            </div>

            <div className="relative z-10 space-y-3">
              <h2 className="text-2xl font-bold tracking-tight">等待分析任务</h2>
              <p className="text-muted-foreground/50 mx-auto max-w-sm text-[10px] font-black tracking-[0.3em] uppercase">
                Ready to synthesize your data
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

      const textColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
      const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'

      const safeMergeAxis = (axis: any, styles: any) => {
        if (!axis) return styles
        if (Array.isArray(axis)) {
          return axis.map(item => ({ ...item, ...styles }))
        }
        return { ...axis, ...styles }
      }

      const biStyle = {
        backgroundColor: 'transparent',
        textStyle: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          color: textColor,
        },
        legend: {
          ...chartOption.legend,
          textStyle: { color: textColor, fontSize: 11, fontWeight: 600 },
        },
        xAxis: safeMergeAxis(chartOption.xAxis, {
          axisLabel: { color: textColor, fontSize: 11, fontWeight: 500 },
          axisLine: { lineStyle: { color: splitLineColor } },
          splitLine: { show: false },
        }),
        yAxis: safeMergeAxis(chartOption.yAxis, {
          axisLabel: { color: textColor, fontSize: 11, fontWeight: 500 },
          splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } },
        }),
        tooltip: {
          ...chartOption.tooltip,
          backgroundColor: isDark ? 'rgba(20, 20, 25, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          textStyle: { color: isDark ? '#fff' : '#000', fontSize: 12, fontWeight: 600 },
          borderRadius: 16,
          padding: [12, 16],
          shadowBlur: 30,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
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
            newSeries.symbolSize = 8
            newSeries.lineStyle = { width: 4 }
            newSeries.areaStyle = {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(0, 102, 255, 0.15)' },
                  { offset: 1, color: 'rgba(0, 102, 255, 0)' },
                ],
              },
            }
          }
          if (newSeries.type === 'bar') {
            newSeries.itemStyle = { borderRadius: [8, 8, 0, 0] }
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
    <div className="animate-in fade-in slide-in-from-bottom-6 flex w-full flex-col duration-1000">
      <AnimatePresence mode="wait">
          <motion.div
            key={`viewer-${data.id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-stretch overflow-hidden lg:flex-row"
          >
          {/* Main Visual Board - Simplified Wrapper */}
          <div className="group relative flex min-h-[600px] flex-1 flex-col overflow-hidden lg:flex-[1.8]">
            {/* Subtler Technical Background */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.015] transition-opacity duration-700 group-hover:opacity-[0.03] dark:opacity-[0.03] dark:group-hover:opacity-[0.05]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                  backgroundSize: '100px 100px',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                  backgroundSize: '25px 25px',
                  opacity: 0.15,
                }}
              />
            </div>

            {/* Subtle Corner Accents */}
            <div className="pointer-events-none absolute top-0 left-0 h-8 w-8 border-t border-l border-primary/10" />
            <div className="pointer-events-none absolute top-0 right-0 h-8 w-8 border-t border-r border-primary/10" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b border-l border-primary/10" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b border-r border-primary/10" />

            {/* Premium Header */}
            <div className="border-border/5 relative z-10 flex flex-col border-b bg-white/10 backdrop-blur-xl dark:bg-black/10">
              <div className="flex flex-col justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-5">
                  <div className="bg-primary shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg ring-1 ring-white/10">
                    <BarChart2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold tracking-tight">分析图表</h3>
                      <Badge variant={data.status === 'succeed' ? 'default' : 'secondary'} className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase border-none",
                        data.status === 'succeed' ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                      )}>
                        {data.status === 'succeed' ? 'Succeed' : 'Processing'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-muted-foreground/50 text-[10px] font-bold tracking-widest uppercase">
                        {data.chartType || '智能推荐'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analysis Goal Badge using Tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-primary/5 hover:bg-primary/10 hidden max-w-[320px] cursor-help items-center gap-3 rounded-2xl border border-primary/10 px-4 py-2.5 transition-colors sm:flex">
                        <Info className="text-primary/60 h-4 w-4 shrink-0" />
                        <p className="text-foreground/70 line-clamp-1 text-xs font-medium italic">
                          {data.goal || '执行深度分析中...'}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3">
                      <p className="text-xs font-medium leading-relaxed">{data.goal || '执行深度分析中...'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="relative flex flex-1 items-center justify-center p-6 md:p-8">
              {data.status === 'failed' ? (
                <div className="flex flex-col items-center justify-center space-y-6 text-center opacity-70">
                  <div className="bg-destructive/10 text-destructive flex h-16 w-16 items-center justify-center rounded-[1.5rem] ring-1 ring-destructive/20 shadow-sm">
                     <Trash2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold">分析失败</h4>
                    <p className="text-muted-foreground/60 text-[10px] font-black tracking-[0.2em] uppercase monospaced">
                      System.Error: RETRY_REQUIRED
                    </p>
                  </div>
                </div>
              ) : data.genChart ? (
                <div className="group relative z-10 h-full w-full">
                  <ReactECharts
                    option={chartOption}
                    style={{ height: '580px', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative h-12 w-12">
                    <div className="border-primary absolute inset-0 animate-ping rounded-full border-2 opacity-20" />
                    <div className="bg-primary flex h-full w-full items-center justify-center rounded-full shadow-lg">
                      <Cpu className="h-6 w-6 animate-pulse text-white" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary animate-pulse">
                    智能分析生成中...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Insights Board - Simplified Wrapper */}
          <aside className="border-border/5 relative flex flex-1 flex-col border-l bg-muted/30 p-6 lg:p-8 transition-all duration-700 lg:max-w-[380px] dark:bg-white/[0.01]">
             {/* Subtle Texture */}
             <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            <div className="relative z-10 mb-6 flex items-center gap-3">
              <div className="bg-primary/5 flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-primary/10">
                <Sparkles className="text-primary/60 h-4 w-4" />
              </div>
              <h3 className="text-base font-bold tracking-tight">AI 洞察报告</h3>
            </div>

            {data.genResult ? (
              <ScrollArea className="flex-1 pr-4">
                <div className="text-muted-foreground/90 text-sm leading-relaxed font-medium">
                  <MarkdownRender content={data.genResult} />
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 opacity-30">
                <Sparkles className="h-6 w-6 animate-pulse" />
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-center">
                  洞察生成中...
                </p>
              </div>
            )}

            <div className="relative z-10 mt-auto flex items-center justify-between border-t border-border/5 pt-6">
              <span className="text-muted-foreground/30 text-[9px] font-bold tracking-widest uppercase">
                TRAJECTORY
              </span>
              <div className="bg-primary/20 h-1 w-1 rounded-full" />
            </div>
          </aside>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
