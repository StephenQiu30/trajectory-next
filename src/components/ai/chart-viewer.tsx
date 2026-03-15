'use client'

import * as React from 'react'
import ReactECharts from 'echarts-for-react'
import { AnimatePresence, motion } from 'framer-motion'
import { MarkdownRender } from '@/components/markdown/markdown-render'
import { useTheme } from 'next-themes'
import { BarChart2, Cpu, Info, Sparkles, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChartViewer({ data }: { data: AiAPI.ChartVO | null }) {
  const { theme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark' || theme === 'dark'

  if (!data) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 flex h-full w-full flex-col gap-8 duration-1000">
        <div className="glass apple-shadow group relative flex h-full flex-col overflow-hidden rounded-[2rem] border-none bg-white/60 dark:bg-white/[0.03]">
          {/* Central Ready Visual */}
          <div className="relative flex flex-1 flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-6">
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm transition-transform duration-700 group-hover:scale-105 dark:bg-white/5">
                <div className="border-primary/5 bg-primary/[0.02] absolute inset-0 rounded-3xl border" />
                <Sparkles className="text-primary/40 h-8 w-8" />
              </div>
            </div>

            <div className="relative z-10 space-y-2">
              <h2 className="text-foreground/60 text-xl font-bold tracking-tight">准备就绪</h2>
              <p className="text-muted-foreground/50 mx-auto max-w-md text-[10px] font-semibold tracking-[0.2em] dark:text-muted-foreground/70 uppercase">
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
          textStyle: { color: textColor, fontSize: 11, fontWeight: 500 },
        },
        xAxis: safeMergeAxis(chartOption.xAxis, {
          axisLabel: { color: textColor, fontSize: 11 },
          axisLine: { lineStyle: { color: splitLineColor } },
          splitLine: { show: false },
        }),
        yAxis: safeMergeAxis(chartOption.yAxis, {
          axisLabel: { color: textColor, fontSize: 11 },
          splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } },
        }),
        tooltip: {
          ...chartOption.tooltip,
          backgroundColor: isDark ? 'rgba(30, 30, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          textStyle: { color: isDark ? '#fff' : '#000', fontSize: 12, fontWeight: 600 },
          borderRadius: 12,
          padding: [10, 14],
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.2)',
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
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(0, 102, 255, 0.08)' },
                  { offset: 1, color: 'rgba(0, 102, 255, 0)' },
                ],
              },
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
    <div className="animate-in fade-in slide-in-from-bottom-4 flex w-full flex-col gap-10 duration-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={`viewer-${data.id}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-stretch gap-8 lg:flex-row"
        >
          {/* Unified Visual Board - Side by Side Left */}
          <div className="glass group relative flex min-h-[700px] flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] transition-all duration-700 lg:flex-[1.6] dark:border-white/5 dark:bg-white/[0.02] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
            {/* Blueprint Grid Background */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03] transition-opacity duration-700 group-hover:opacity-[0.05] dark:opacity-[0.05] dark:group-hover:opacity-[0.08]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                  backgroundSize: '8px 8px',
                  opacity: 0.3,
                }}
              />
            </div>

            {/* Technical Corner Accents */}
            <div className="text-primary/30 absolute top-6 left-6 h-4 w-4 border-t-2 border-l-2 transition-colors duration-500 group-hover:text-primary/60" />
            <div className="text-primary/30 absolute top-6 right-6 h-4 w-4 border-t-2 border-r-2 transition-colors duration-500 group-hover:text-primary/60" />
            <div className="text-primary/30 absolute right-6 bottom-6 h-4 w-4 border-r-2 border-b-2 transition-colors duration-500 group-hover:text-primary/60" />
            <div className="text-primary/30 absolute bottom-6 left-6 h-4 w-4 border-l-2 border-b-2 transition-colors duration-500 group-hover:text-primary/60" />

            {/* Integrated Header */}
            <div className="border-border/5 relative z-10 flex flex-col border-b bg-white/[0.02] backdrop-blur-md dark:bg-transparent">
              <div className="flex flex-col justify-between gap-4 px-8 py-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-primary/20">
                    <BarChart2 className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xl font-bold tracking-tight">结果看板</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-md bg-green-500/10 px-1.5 py-0.5 ring-1 ring-green-500/20">
                        <div className="h-1 w-1 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <span className="text-green-500 text-[8px] font-black tracking-widest uppercase">
                          {data.status === 'succeed' ? 'Live System' : 'Processing'}
                        </span>
                      </div>
                      <div className="bg-foreground/10 h-1 w-1 rounded-full" />
                      <span className="text-muted-foreground/60 text-[8px] font-bold tracking-widest uppercase monospaced">
                        CORE_ENGINE.v2 • {data.chartType?.toUpperCase() || 'STANDARD'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Diagnostic Label Strip */}
                <div className="hidden items-center gap-3 sm:flex">
                  <div className="flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-black/5 px-3 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-primary/40 text-[7px] font-black tracking-widest uppercase">
                        Diag
                      </span>
                      <span className="text-foreground/40 text-[9px] font-bold monospaced">
                        STATUS_OK
                      </span>
                    </div>
                    <div className="bg-white/10 h-3 w-px" />
                    <div className="flex items-center gap-2">
                      <span className="text-primary/40 text-[7px] font-black tracking-widest uppercase">
                        Freq
                      </span>
                      <span className="text-foreground/40 text-[9px] font-bold monospaced">60Hz</span>
                    </div>
                  </div>

                  {/* Analysis Goal Strip */}
                  <div className="glass bg-primary/[0.03] border-border/5 max-w-[240px] rounded-xl border px-3 py-1.5">
                    <div className="flex items-center gap-2.5">
                      <Info className="text-primary h-3 w-3 shrink-0" />
                      <p className="text-foreground/50 truncate text-[11px] font-medium italic">
                        {data.goal || '探索性分析模式'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-1 items-center justify-center p-8">
              {data.status === 'failed' ? (
                <div className="flex flex-col items-center justify-center space-y-4 p-10 opacity-60">
                  <Trash2 className="text-destructive/40 h-10 w-10" />
                  <div className="space-y-1 text-center">
                    <p className="text-base font-bold">分析失败</p>
                    <p className="text-[11px] font-medium uppercase monospaced">RETRY_REQUIRED</p>
                  </div>
                </div>
              ) : data.genChart ? (
                <div className="group relative z-10 h-full w-full">
                  <ReactECharts
                    option={chartOption}
                    style={{ height: '600px', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-40">
                  <Cpu className="h-8 w-8 animate-pulse text-primary" />
                  <p className="text-[10px] font-bold tracking-widest uppercase italic monospaced animate-pulse">
                    Synthesizing...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Strategy & Insights - Side by Side Right */}
          <aside className="glass group relative flex flex-1 flex-col rounded-[2.5rem] border border-white/10 bg-white/60 p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] transition-all duration-700 dark:border-white/5 dark:bg-white/[0.03] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
            {/* Subtle Texture for Aside */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: '16px 16px',
                }}
              />
            </div>

            <div className="relative z-10 mb-8 flex items-center gap-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-primary/20">
                <Sparkles className="text-primary h-6 w-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight italic uppercase">AI 洞察报告</h3>
                <p className="text-muted-foreground/50 text-[10px] font-bold tracking-[0.2em] uppercase monospaced">
                  Strategic intelligence . 0.9.4
                </p>
              </div>
            </div>

            {data.genResult ? (
              <div className="text-muted-foreground/90 scrollbar-thin flex-1 pr-2 text-base leading-relaxed">
                <MarkdownRender content={data.genResult} />
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 opacity-30">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <p className="text-center text-[10px] font-bold tracking-widest uppercase">
                  正在生成分析...
                </p>
              </div>
            )}

            <div className="border-border/5 mt-6 flex items-center justify-between border-t pt-4">
              <span className="text-muted-foreground/20 text-[9px] font-bold tracking-widest uppercase">
                Trajectory Engine v2.0
              </span>
              <div className="bg-primary/20 h-1.5 w-1.5 rounded-full" />
            </div>
          </aside>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
