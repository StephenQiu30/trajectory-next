'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import { AnimatePresence, motion } from 'framer-motion'
import { MarkdownRender } from '@/components/markdown/markdown-render'
import { Cpu, FileSearch, Sparkles, Trash2, TrendingUp, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChartViewer({ data }: { data: AiAPI.ChartVO | null }) {
  if (!data) {
    return (
      <div className="flex h-full min-h-[500px] w-full flex-col items-center justify-center glass apple-shadow rounded-[2.5rem] border-none">
        <div className="flex flex-col items-center justify-center p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center apple-shadow animate-float">
            <FileSearch className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">等待分析数据</h3>
            <p className="max-w-md text-foreground/60 font-medium leading-relaxed">
              在左侧面板配置您的分析需求并上传数据文件，数据洞察将在此呈现。
            </p>
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
      <div className="flex flex-1 overflow-hidden h-full flex-col lg:flex-row gap-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${data.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row gap-10 w-full"
          >
            {/* Left Sidebar - Strategy & Specs */}
            <aside className="w-full lg:w-[320px] shrink-0 space-y-10">
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/40 bg-clip-text text-transparent">
                    智能分析视图
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>AI Analysis Engine v2</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <FileSearch className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">分析目标</h3>
                  </div>
                  <div className="glass apple-shadow p-6 rounded-3xl bg-primary/5 min-h-[160px] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                      <Sparkles className="h-20 w-20 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground/70 leading-relaxed italic relative z-10">
                      "{data.goal || '未设置具体的分析目标，正在以全局视角为您解读数据...'}"
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10">
                      <Cpu className="h-4 w-4 text-purple-500" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">引擎规格</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: '分析规格', value: data.chartType || '标准', icon: BarChart2, color: 'text-blue-500', bgColor: 'bg-blue-500/5' },
                      { label: '处理引擎', value: 'SmartCore v2', icon: Cpu, color: 'text-purple-500', bgColor: 'bg-purple-500/5' },
                    ].map((item, i) => (
                      <div key={i} className={cn("glass apple-shadow p-4 rounded-3xl flex items-center gap-4 border-none transition-all duration-500 hover:bg-white/40 dark:hover:bg-white/5", item.bgColor)}>
                        <div className={cn("p-2.5 rounded-xl bg-white/50 dark:bg-black/50 apple-shadow", item.color)}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{item.label}</p>
                          <p className="text-xs font-bold text-foreground/80">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Main Area - Visuals & Insights */}
            <div className="flex-1 space-y-12 pb-10">
              {/* Chart Section */}
              <div className="p-1 rounded-[3.5rem] bg-gradient-to-br from-primary/20 via-transparent to-transparent">
                <div className="glass apple-shadow rounded-[3rem] border-none overflow-hidden bg-white/70 dark:bg-gray-950/70">
                  <div className="px-8 py-6 border-b border-border/50 flex align-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                        <BarChart2 className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight">交互式数据实验室</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    {data.status === 'failed' ? (
                      <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[2.5rem] bg-destructive/5 space-y-4 p-12 border border-destructive/10">
                        <Trash2 className="h-12 w-12 text-destructive" />
                        <div className="text-center space-y-1">
                          <p className="text-xl font-bold text-destructive">分析失败</p>
                          <p className="text-sm text-destructive/60 font-medium">AI 处理数据异常，请重试。</p>
                        </div>
                      </div>
                    ) : data.genChart ? (
                      <div className="min-h-[500px] w-full bg-white/30 dark:bg-black/30 rounded-[2rem] p-6 apple-shadow">
                        <ReactECharts
                          option={chartOption}
                          style={{ height: '450px', width: '100%' }}
                          opts={{ renderer: 'svg' }}
                        />
                      </div>
                    ) : (
                      <div className="flex min-h-[500px] flex-1 items-center justify-center rounded-[2.5rem] bg-secondary/20">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative">
                            <Cpu className="h-10 w-10 text-primary animate-pulse" />
                            <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-bounce" />
                          </div>
                          <p className="text-base font-bold text-foreground/40 tracking-widest uppercase">Synthesizing Visuals...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Insights Section */}
              {data.genResult && (
                <div className="relative group">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none transition-all duration-700 group-hover:bg-amber-500/10" />
                  <div className="glass apple-shadow p-12 rounded-[3rem] border-none bg-white/50 dark:bg-black/20 relative z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500/50 to-transparent" />
                    <div className="mb-10 flex items-center gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 apple-shadow">
                        <Sparkles className="h-7 w-7 text-amber-500" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-500">AI 深度洞察</h3>
                        <p className="text-[10px] font-bold text-amber-500/50 uppercase tracking-[0.2em]">Strategic Intelligence Analysis</p>
                      </div>
                    </div>
                    <div className="text-foreground/90 leading-relaxed prose dark:prose-invert max-w-none">
                      <MarkdownRender content={data.genResult} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
  )
}
