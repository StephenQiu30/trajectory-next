'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import ReactECharts from 'echarts-for-react'
import { MarkdownRender } from '@/components/markdown/markdown-render'
import {
  Sparkles,
  Calendar,
  Target,
  BarChart2,
  Info,
} from 'lucide-react'
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
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
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
      <DialogContent className="max-w-7xl h-[90vh] p-0 overflow-hidden glass apple-shadow border-none rounded-[3rem]">
        <DialogHeader className="px-10 pt-10 pb-8 shrink-0 border-b border-border/50 bg-secondary/5">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl apple-shadow transition-transform duration-700 hover:rotate-6",
                  chartIconMap[data.chartType || '']?.bgColor || 'bg-secondary'
                )}>
                  {(() => {
                    const iconConfig = chartIconMap[data.chartType || '']
                    if (iconConfig) {
                      const Icon = iconConfig.icon
                      return <Icon className={cn("h-8 w-8", iconConfig.color)} />
                    }
                    return <BarChart2 className="h-8 w-8 text-primary" />
                  })()}
                </div>
                <div className="space-y-2 pt-1">
                  <DialogTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/40 bg-clip-text text-transparent">
                    {data.name || '分析报告详情'}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] whitespace-nowrap">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span>Intelligence Report</span>
                    </div>
                    <div className="h-3 w-[1px] bg-border/50 hidden sm:block" />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      {[
                        { label: 'ID', value: `${data.id}`, icon: Info, color: 'text-primary/40' },
                        { label: '图表', value: chartIconMap[data.chartType || '']?.label || '未知', icon: BarChart2, color: 'text-blue-500' },
                        { label: '日期', value: data.createTime ? new Date(data.createTime).toLocaleDateString() : '未知', icon: Calendar, color: 'text-emerald-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                          <item.icon className={cn("h-3 w-3", item.color)} />
                          <span>{item.label}: <span className="text-foreground/60">{item.value}</span></span>
                        </div>
                      ))}
                    </div>
                    <div className="h-3 w-[1px] bg-border/50 hidden sm:block" />
                    <div className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] whitespace-nowrap">
                      CORE_V1
                    </div>
                  </div>
                </div>
              </div>

              <div className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest apple-shadow bg-background/50 backdrop-blur-md",
                data.status === ChartStatusEnum.SUCCEED ? "text-green-500" :
                data.status === ChartStatusEnum.RUNNING ? "text-primary" : "text-destructive"
              )}>
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0 animate-pulse",
                  data.status === ChartStatusEnum.SUCCEED ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" :
                  data.status === ChartStatusEnum.RUNNING ? "bg-primary shadow-[0_0_8px_rgba(0,102,255,0.6)]" : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                )} />
                {data.status === ChartStatusEnum.SUCCEED ? 'Success' :
                 data.status === ChartStatusEnum.RUNNING ? 'Analyzing' : 'Failed'}
              </div>
            </div>

            {/* Analysis Goal Area in Header */}
            <div className="glass apple-shadow p-4 rounded-2xl bg-white/40 dark:bg-black/20 border-none relative overflow-hidden group">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.05] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <Target className="h-12 w-12 text-primary" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="px-2.5 py-1 rounded-lg bg-primary/10 text-[10px] font-extrabold text-primary uppercase tracking-widest shrink-0">
                  分析目标
                </div>
                <p className="text-sm font-medium text-foreground/60 leading-relaxed italic truncate">
                  "{data.goal || '正在以全局视角为您解读数据...'}"
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden h-full flex-col lg:flex-row">
          {/* Left Column - Visualization (Fixed/Primary) */}
          <div className="flex-1 lg:flex-[1.6] border-b lg:border-b-0 lg:border-r border-border/50 bg-secondary/[0.01] overflow-hidden flex flex-col">
            <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center min-h-[450px]">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-[1.25rem] bg-blue-500/10 text-blue-500 apple-shadow">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-2xl font-bold tracking-tight">可视化实验室</h3>
                    <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">Interactive Data Visualization</p>
                  </div>
                </div>

                <div className="p-1 rounded-[3.5rem] bg-gradient-to-br from-primary/20 via-transparent to-transparent">
                  <div className="p-8 rounded-[3rem] bg-white/70 dark:bg-gray-950/70 glass apple-shadow min-h-[480px] border-none group transition-all duration-700 flex items-center justify-center">
                    {data.genChart ? (
                      <div className="bg-white/30 dark:bg-black/30 rounded-[2rem] p-6 apple-shadow w-full">
                        <ReactECharts
                          option={chartOption}
                          style={{ height: '420px', width: '100%'} }
                          opts={{ renderer: 'svg' }}
                        />
                      </div>
                    ) : (
                      <div className="h-[420px] flex items-center justify-center text-foreground/20 font-bold uppercase tracking-widest text-sm italic">
                        图表引擎待命中...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Insights Purely (Scrollable) */}
          <aside className="w-full lg:w-[480px] shrink-0 overflow-hidden flex flex-col bg-secondary/[0.02]">
            <ScrollArea className="flex-1">
              <div className="p-8 lg:p-10 space-y-8 pb-24">
                {/* Insights Section */}
                {data.genResult && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-[1.25rem] bg-amber-500/10 text-amber-500 apple-shadow">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-500">AI 深度洞察</h3>
                        <p className="text-[10px] font-bold text-amber-500/30 uppercase tracking-widest">Strategic Intelligence Analysis</p>
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
                      <div className="p-8 rounded-[2.5rem] bg-white/50 dark:bg-black/20 glass border-none relative z-10 apple-shadow overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500/50 to-transparent" />
                        <div className="text-foreground/90 leading-relaxed prose dark:prose-invert max-w-none text-sm">
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
