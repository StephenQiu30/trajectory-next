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
        xAxis: {
          ...chartOption.xAxis,
          axisLabel: { color: textColor, fontSize: 11 },
          axisLine: { lineStyle: { color: splitLineColor } },
          splitLine: { show: false },
        },
        yAxis: {
          ...chartOption.yAxis,
          axisLabel: { color: textColor, fontSize: 11 },
          splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } },
        },
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
    <div className="animate-in fade-in slide-in-from-bottom-4 flex w-full flex-col gap-8 duration-1000">
      {/* Header Area */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <div className="mb-1 flex items-center gap-2">
              <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[10px] font-bold tracking-widest whitespace-nowrap uppercase">
                Analysis Results
              </span>
              <div
                className={cn(
                  'flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase',
                  data.status === 'succeed'
                    ? 'text-green-600/80'
                    : data.status === 'running'
                      ? 'text-primary/80'
                      : 'text-destructive/80'
                )}
              >
                <div
                  className={cn(
                    'h-1 w-1 rounded-full',
                    data.status === 'succeed'
                      ? 'bg-green-500'
                      : data.status === 'running'
                        ? 'bg-primary animate-pulse'
                        : 'bg-destructive'
                  )}
                />
                {data.status === 'succeed'
                  ? 'Success'
                  : data.status === 'running'
                    ? 'Running'
                    : 'Failed'}
              </div>
            </div>
            <h2 className="text-foreground/90 text-2xl font-bold tracking-tight">结果看板</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: 'Type', value: data.chartType || 'Chart', icon: BarChart2 },
              { label: 'Mode', value: 'AI Smart', icon: Sparkles },
            ].map((item, i) => (
              <div
                key={i}
                className="text-muted-foreground/40 border-border/10 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase"
              >
                <item.icon className="text-primary/40 h-3 w-3" />
                <span>
                  {item.label}: <span className="text-foreground/60">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Simplified Goal Container */}
        <div className="glass bg-primary/[0.01] group rounded-2xl border-none p-5">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg">
              <Info className="h-3 w-3" />
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground/50 text-[10px] font-bold tracking-widest uppercase">
                分析目标
              </span>
              <p className="text-foreground/70 text-sm leading-relaxed font-medium italic">
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
          className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]"
        >
          {/* Main Visual Stage */}
          <div className="glass apple-shadow relative flex min-h-[500px] flex-col overflow-hidden rounded-[2rem] border-none bg-white/60 dark:bg-white/[0.03]">
            <div className="border-border/5 flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="text-primary h-4 w-4" />
                <h3 className="text-sm font-bold tracking-tight">可视化看板</h3>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center p-6">
              {data.status === 'failed' ? (
                <div className="flex flex-col items-center justify-center space-y-4 p-10 opacity-60">
                  <Trash2 className="text-destructive/40 h-10 w-10" />
                  <div className="space-y-1 text-center">
                    <p className="text-base font-bold">分析失败</p>
                    <p className="text-[11px] font-medium">请检查数据格式后重试</p>
                  </div>
                </div>
              ) : data.genChart ? (
                <div className="group relative h-full w-full">
                  <ReactECharts
                    option={chartOption}
                    style={{ height: '400px', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-40">
                  <Cpu className="h-8 w-8 animate-pulse" />
                  <p className="text-[10px] font-bold tracking-widest uppercase italic">
                    Preparing...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Strategy & Insights */}
          <aside className="glass apple-shadow flex flex-col rounded-[2rem] border-none bg-white/60 p-6 dark:bg-white/[0.03]">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl">
                <Sparkles className="text-primary h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight">AI 洞察报告</h3>
              </div>
            </div>

            {data.genResult ? (
              <div className="text-muted-foreground/90 scrollbar-thin max-h-[460px] flex-1 overflow-y-auto pr-2 text-sm leading-relaxed">
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
