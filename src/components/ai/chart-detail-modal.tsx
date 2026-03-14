'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import ReactECharts from 'echarts-for-react'
import { MarkdownRender } from '@/components/markdown/markdown-render'
import { BarChart2, Calendar, Info, Sparkles, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { chartIconMap } from '@/constants/chartIcons'
import { ChartStatusEnum } from '@/enums/ChartTypeEnum'

interface ChartDetailModalProps {
  data: AiAPI.ChartVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChartDetailModal({ data, open, onOpenChange }: ChartDetailModalProps) {
  if (!data) return null

  let chartOption: Record<string, any> = {}
  try {
    if (data.genChart) {
      try {
        chartOption = JSON.parse(data.genChart)
      } catch {
        chartOption = new Function('return ' + data.genChart)()
      }

      const biStyle = {
        backgroundColor: 'transparent',
        textStyle: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'transparent',
          textStyle: { color: '#000', fontSize: 14, fontWeight: 600 },
          borderRadius: 16,
          padding: [12, 16],
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          top: 40,
          bottom: 40,
          left: 50,
          right: 30,
          containLabel: true,
        },
      }

      chartOption = { ...chartOption, ...biStyle }
    }
  } catch (error) {
    console.error('Failed to parse chart options:', error)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass apple-shadow h-[90vh] max-w-7xl overflow-hidden rounded-[3rem] border-none p-0">
        <DialogHeader className="border-border/50 bg-secondary/5 shrink-0 border-b px-10 pt-10 pb-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div
                  className={cn(
                    'apple-shadow flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-700 hover:rotate-6',
                    chartIconMap[data.chartType || '']?.bgColor || 'bg-secondary'
                  )}
                >
                  {(() => {
                    const iconConfig = chartIconMap[data.chartType || '']
                    if (iconConfig) {
                      const Icon = iconConfig.icon
                      return <Icon className={cn('h-8 w-8', iconConfig.color)} />
                    }
                    return <BarChart2 className="text-primary h-8 w-8" />
                  })()}
                </div>
                <div className="space-y-2 pt-1">
                  <DialogTitle className="from-foreground to-foreground/40 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                    {data.name || '分析报告详情'}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-foreground/30 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] whitespace-nowrap uppercase">
                      <Sparkles className="text-primary h-3 w-3" />
                      <span>Intelligence Report</span>
                    </div>
                    <div className="bg-border/50 hidden h-3 w-[1px] sm:block" />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      {[
                        { label: 'ID', value: `${data.id}`, icon: Info, color: 'text-primary/40' },
                        {
                          label: '图表',
                          value: chartIconMap[data.chartType || '']?.label || '未知',
                          icon: BarChart2,
                          color: 'text-blue-500',
                        },
                        {
                          label: '日期',
                          value: data.createTime
                            ? new Date(data.createTime).toLocaleDateString()
                            : '未知',
                          icon: Calendar,
                          color: 'text-emerald-500',
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="text-foreground/40 flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase"
                        >
                          <item.icon className={cn('h-3 w-3', item.color)} />
                          <span>
                            {item.label}: <span className="text-foreground/60">{item.value}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-border/50 hidden h-3 w-[1px] sm:block" />
                    <div className="text-primary/30 text-[9px] font-black tracking-[0.2em] whitespace-nowrap uppercase">
                      CORE_V1
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  'apple-shadow bg-background/50 flex items-center gap-2 rounded-full px-5 py-2.5 text-[10px] font-black tracking-widest uppercase backdrop-blur-md',
                  data.status === ChartStatusEnum.SUCCEED
                    ? 'text-green-500'
                    : data.status === ChartStatusEnum.RUNNING
                      ? 'text-primary'
                      : 'text-destructive'
                )}
              >
                <div
                  className={cn(
                    'h-1.5 w-1.5 shrink-0 animate-pulse rounded-full',
                    data.status === ChartStatusEnum.SUCCEED
                      ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                      : data.status === ChartStatusEnum.RUNNING
                        ? 'bg-primary shadow-[0_0_8px_rgba(0,102,255,0.6)]'
                        : 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                  )}
                />
                {data.status === ChartStatusEnum.SUCCEED
                  ? 'Success'
                  : data.status === ChartStatusEnum.RUNNING
                    ? 'Analyzing'
                    : 'Failed'}
              </div>
            </div>

            {/* Analysis Goal Area in Header */}
            <div className="glass apple-shadow group relative overflow-hidden rounded-2xl border-none bg-white/40 p-4 dark:bg-black/20">
              <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 opacity-[0.05] transition-transform duration-700 group-hover:scale-110">
                <Target className="text-primary h-12 w-12" />
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="bg-primary/10 text-primary shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-extrabold tracking-widest uppercase">
                  分析目标
                </div>
                <p className="text-foreground/60 truncate text-sm leading-relaxed font-medium italic">
                  "{data.goal || '正在以全局视角为您解读数据...'}"
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-full flex-1 flex-col overflow-hidden lg:flex-row">
          {/* Left Column - Visualization (Fixed/Primary) */}
          <div className="border-border/50 bg-secondary/[0.01] flex flex-1 flex-col overflow-hidden border-b lg:flex-[1.6] lg:border-r lg:border-b-0">
            <div className="flex min-h-[450px] flex-1 flex-col justify-center p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="apple-shadow rounded-[1.25rem] bg-blue-500/10 p-2.5 text-blue-500">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-2xl font-bold tracking-tight">可视化实验室</h3>
                    <p className="text-foreground/20 text-[10px] font-bold tracking-widest uppercase">
                      Interactive Data Visualization
                    </p>
                  </div>
                </div>

                <div className="from-primary/20 rounded-[3.5rem] bg-gradient-to-br via-transparent to-transparent p-1">
                  <div className="glass apple-shadow group flex min-h-[480px] items-center justify-center rounded-[3rem] border-none bg-white/70 p-8 transition-all duration-700 dark:bg-gray-950/70">
                    {data.genChart ? (
                      <div className="apple-shadow w-full rounded-[2rem] bg-white/30 p-6 dark:bg-black/30">
                        <ReactECharts
                          option={chartOption}
                          style={{ height: '420px', width: '100%' }}
                          opts={{ renderer: 'svg' }}
                        />
                      </div>
                    ) : (
                      <div className="text-foreground/20 flex h-[420px] items-center justify-center text-sm font-bold tracking-widest uppercase italic">
                        图表引擎待命中...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Insights Purely (Scrollable) */}
          <aside className="bg-secondary/[0.02] flex w-full shrink-0 flex-col overflow-hidden lg:w-[480px]">
            <ScrollArea className="flex-1">
              <div className="space-y-8 p-8 pb-24 lg:p-10">
                {/* Insights Section */}
                {data.genResult && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="apple-shadow rounded-[1.25rem] bg-amber-500/10 p-2.5 text-amber-500">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-500">
                          AI 深度洞察
                        </h3>
                        <p className="text-[10px] font-bold tracking-widest text-amber-500/30 uppercase">
                          Strategic Intelligence Analysis
                        </p>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-amber-500/5 blur-[80px]" />
                      <div className="glass apple-shadow relative z-10 overflow-hidden rounded-[2.5rem] border-none bg-white/50 p-8 dark:bg-black/20">
                        <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-amber-500/50 to-transparent" />
                        <div className="text-foreground/90 prose dark:prose-invert max-w-none text-sm leading-relaxed">
                          <MarkdownRender content={data.genResult} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  )
}
