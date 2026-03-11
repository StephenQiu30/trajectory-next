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
        <DialogHeader className="px-10 pt-10 pb-8 shrink-0 border-b border-border/50">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className={cn(
                "flex h-20 w-20 items-center justify-center rounded-[2rem] apple-shadow transition-transform duration-700 hover:rotate-6",
                chartIconMap[data.chartType || '']?.bgColor || 'bg-secondary'
              )}>
                {(() => {
                  const iconConfig = chartIconMap[data.chartType || '']
                  if (iconConfig) {
                    const Icon = iconConfig.icon
                    return <Icon className={cn("h-10 w-10", iconConfig.color)} />
                  }
                  return <BarChart2 className="h-10 w-10 text-primary" />
                })()}
              </div>
              <div className="space-y-1.5 pt-2">
                <DialogTitle className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/40 bg-clip-text text-transparent">
                  {data.name || '分析报告详情'}
                </DialogTitle>
                <div className="flex items-center gap-2 text-[11px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>Strategic Intelligence Report</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: '图表规格', value: chartIconMap[data.chartType || '']?.label || '未知类型', icon: BarChart2, color: 'text-blue-500' },
                { label: '生成日期', value: data.createTime ? new Date(data.createTime).toLocaleDateString() : '未知日期', icon: Calendar, color: 'text-emerald-500' },
                { label: '解析状态', value: data.status === ChartStatusEnum.SUCCEED ? '解析成功' : '解析中', icon: Info, color: data.status === ChartStatusEnum.SUCCEED ? 'text-green-500' : 'text-primary' },
              ].map((item, i) => (
                <div key={i} className="glass apple-shadow p-4 rounded-3xl flex items-center gap-3 border-none bg-white/5 dark:bg-black/20">
                  <div className={cn("p-2.5 rounded-xl bg-white/50 dark:bg-black/50 apple-shadow", item.color)}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">{item.label}</p>
                    <p className="text-xs font-bold text-foreground/80">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-10 py-10">
          <div className="space-y-12 pb-10">
            {/* Analysis Goal Section */}
            <div className="glass apple-shadow p-8 rounded-[2.5rem] border-none bg-primary/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <Target className="h-32 w-32 text-primary" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">分析目标</h3>
                </div>
                <p className="text-lg font-medium text-foreground/70 leading-relaxed italic pr-12">
                  "{data.goal || '未设置具体的分析目标，正在以全局视角为您解读数据...'}"
                </p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-[1.25rem] bg-blue-500/10 text-blue-500 apple-shadow">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-bold tracking-tight">数据视图</h3>
                  <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">Interactive Data Visualization</p>
                </div>
              </div>
              <div className="p-6 rounded-[3rem] bg-secondary/10 apple-shadow min-h-[450px] border-none group transition-all duration-700 hover:bg-secondary/20">
                {data.genChart ? (
                  <div className="bg-white/30 dark:bg-black/30 rounded-[2rem] p-6 apple-shadow">
                    <ReactECharts
                      option={chartOption}
                      style={{ height: '400px', width: '100%' }}
                      opts={{ renderer: 'svg' }}
                    />
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-foreground/20 font-bold uppercase tracking-widest text-sm italic">
                    无可用图表数据
                  </div>
                )}
              </div>
            </div>

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
                <div className="p-10 rounded-[3rem] bg-white/5 dark:bg-black/10 glass border-none">
                  <div className="text-foreground/90 leading-loose prose dark:prose-invert max-w-none">
                    <MarkdownRender content={data.genResult} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Metadata Footer */}
            <div className="pt-8 border-t border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[9px] font-bold text-foreground/20 uppercase tracking-[0.2em]">
                <Info className="h-3 w-3" />
                <span>REPORT_ID: {data.id} &nbsp;|&nbsp; GENERATED_BY: TRAJECTORY_SMART_CORE</span>
              </div>
              <div className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em]">
                Confidential Analysis
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
