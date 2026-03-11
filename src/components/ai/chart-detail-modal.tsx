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
      <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden glass apple-shadow border-none rounded-[3rem]">
        <DialogHeader className="px-10 pt-10 pb-6 shrink-0 border-b border-border/50">
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
            <div className="space-y-1 pt-1">
              <DialogTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/40 bg-clip-text text-transparent">
                {data.name || '分析报告详情'}
              </DialogTitle>
              <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>Strategic Intelligence Report</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden h-full flex-col lg:flex-row">
          {/* Sidebar - Meta & Goal */}
          <aside className="w-full lg:w-[320px] shrink-0 border-b lg:border-b-0 lg:border-r border-border/50 bg-secondary/5 overflow-y-auto">
            <div className="p-8 space-y-10">
              {/* Analysis Goal */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">分析目标</h3>
                </div>
                <div className="glass apple-shadow p-5 rounded-3xl bg-white/50 dark:bg-black/20 relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                    <Target className="h-16 w-16 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground/70 leading-relaxed italic relative z-10">
                    "{data.goal || '正在以全局视角为您解读数据...'}"
                  </p>
                </div>
              </div>

              {/* Status Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10">
                    <Info className="h-4 w-4 text-blue-500" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">报告规格</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: '图表规格', value: chartIconMap[data.chartType || '']?.label || '未知类型', icon: BarChart2, color: 'text-blue-500' },
                    { label: '生成日期', value: data.createTime ? new Date(data.createTime).toLocaleDateString() : '未知日期', icon: Calendar, color: 'text-emerald-500' },
                    { label: '处理状态', value: data.status === ChartStatusEnum.SUCCEED ? '解析成功' : '处理中', icon: Info, color: 'text-purple-500' },
                  ].map((item, i) => (
                    <div key={i} className="glass apple-shadow p-4 rounded-2xl flex items-center gap-3 border-none bg-white/40 dark:bg-black/20">
                      <div className={cn("p-2 rounded-xl bg-white/50 dark:bg-black/50 apple-shadow", item.color)}>
                        <item.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">{item.label}</p>
                        <p className="text-xs font-bold text-foreground/80">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Meta */}
              <div className="pt-6 border-t border-border/50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-foreground/20 uppercase tracking-[0.2em]">
                    <Info className="h-3 w-3" />
                    <span>ID: {data.id}</span>
                  </div>
                  <div className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em]">
                    TRAJECTORY_SMART_CORE
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - ScrollArea */}
          <ScrollArea className="flex-1">
            <div className="p-10 space-y-12 max-w-4xl mx-auto">
              {/* Chart Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-[1.25rem] bg-blue-500/10 text-blue-500 apple-shadow">
                      <BarChart2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-2xl font-bold tracking-tight">可视化实验室</h3>
                      <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">Interactive Data Visualization</p>
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-[3.5rem] bg-gradient-to-br from-primary/20 via-transparent to-transparent">
                  <div className="p-8 rounded-[3rem] bg-white/70 dark:bg-gray-950/70 glass apple-shadow min-h-[450px] border-none group transition-all duration-700">
                    {data.genChart ? (
                      <div className="bg-white/30 dark:bg-black/30 rounded-[2rem] p-6 apple-shadow">
                        <ReactECharts
                          option={chartOption}
                          style={{ height: '400px', width: '100%'} }
                          opts={{ renderer: 'svg' }}
                        />
                      </div>
                    ) : (
                      <div className="h-[400px] flex items-center justify-center text-foreground/20 font-bold uppercase tracking-widest text-sm italic">
                        图表引擎待命中...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Insights Section */}
              {data.genResult && (
                <div className="space-y-6 pb-10">
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
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-amber-500/10" />
                    <div className="p-10 rounded-[3rem] bg-white/50 dark:bg-black/20 glass border-none relative z-10 apple-shadow overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500/50 to-transparent" />
                      <div className="text-foreground/90 leading-loose prose dark:prose-invert max-w-none">
                        <MarkdownRender content={data.genResult} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
