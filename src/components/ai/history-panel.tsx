'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { deleteChart, listMyChartVoByPage } from '@/api/ai/smartAnalysisController'
import { ChartStatusEnum } from '@/enums/ChartTypeEnum'
import { chartIconMap, getChartIcon } from '@/constants/chartIcons'
import { Clock, Loader2, Trash2, ChevronRight, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HistoryPanelProps {
  onSelectChart: (chart: AiAPI.ChartVO) => void
}

export function HistoryPanel({ onSelectChart }: HistoryPanelProps) {
  const [charts, setCharts] = React.useState<AiAPI.ChartVO[]>([])
  const [loading, setLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const pageSize = 12

  const fetchCharts = async (current: number) => {
    try {
      setLoading(true)
      const res = await listMyChartVoByPage({
        current,
        pageSize,
        sortField: 'createTime',
        sortOrder: 'descend',
      })
      if (res.code === 0 && res.data) {
        setCharts(res.data.records || [])
        setTotal(res.data.total || 0)
      } else {
        toast.error('获取历史记录失败')
      }
    } catch (e: any) {
      toast.error('获取历史记录失败')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchCharts(page)
  }, [page])

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    try {
      const res = await deleteChart({ id })
      if (res.code === 0) {
        toast.success('删除成功')
        if (charts.length === 1 && page > 1) {
          setPage(page - 1)
        } else {
          fetchCharts(page)
        }
      } else {
        toast.error('删除失败')
      }
    } catch {
      toast.error('网络错误，删除失败')
    }
  }

  const Pagination = () => {
    const totalPages = Math.ceil(total / pageSize)
    if (totalPages <= 1) return null
    return (
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded-full glass apple-shadow border-none font-bold px-6 h-10 transition-all active:scale-95"
        >
          上一页
        </Button>
        <span className="text-foreground/40 font-bold px-2 text-sm">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="rounded-full glass apple-shadow border-none font-bold px-6 h-10 transition-all active:scale-95"
        >
          下一页
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-transparent w-full">
      <div className="pb-8 px-2">
        <h2 className="text-2xl font-bold tracking-tight">历史记录</h2>
        <p className="text-sm text-foreground/40 mt-1.5 font-medium">共计 {total} 份分析报告</p>
      </div>

      <div className="flex-1 overflow-x-hidden px-2">
        {loading && charts.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-[3rem] glass apple-shadow">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
            <p className="text-base font-bold text-foreground/40 tracking-widest uppercase">Initializing History...</p>
          </div>
        ) : charts.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-[3rem] glass apple-shadow p-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-4">
              <BarChart2 className="h-10 w-10 text-primary/30" />
            </div>
            <p className="text-xl font-bold text-foreground/40">暂无分析记录</p>
            <p className="max-w-xs text-sm text-foreground/30 font-medium">
              您生成的每一份智能分析报告都会在此安全存储。
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {charts.map((chart, index) => (
                  <motion.div
                    key={chart.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Card
                      className="group relative cursor-pointer overflow-hidden border-none bg-secondary/5 glass apple-shadow transition-all duration-700 hover:scale-[1.04] active:scale-[0.98] hover:bg-white/50 dark:hover:bg-white/10 rounded-[2.5rem]"
                      onClick={() => onSelectChart(chart)}
                    >
                      <CardContent className="p-7">
                        <div className="flex flex-col gap-7">
                          <div className="flex items-start justify-between">
                            <div className={cn(
                              "flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl apple-shadow transition-all duration-700 group-hover:scale-110 group-hover:rotate-6",
                              chartIconMap[chart.chartType || '']?.bgColor || 'bg-secondary'
                            )}>
                              {chartIconMap[chart.chartType || '']
                                ? getChartIcon(chart.chartType)
                                : <BarChart2 className="h-8 w-8 text-primary" />
                              }
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                chart.status === ChartStatusEnum.SUCCEED ? "bg-green-500/10 text-green-500" :
                                chart.status === ChartStatusEnum.RUNNING ? "bg-primary/10 text-primary animate-pulse" : "bg-destructive/10 text-destructive"
                              )}>
                                <div className={cn(
                                  "h-1.5 w-1.5 rounded-full shrink-0",
                                  chart.status === ChartStatusEnum.SUCCEED ? "bg-green-500" :
                                  chart.status === ChartStatusEnum.RUNNING ? "bg-primary" : "bg-destructive"
                                )} />
                                {chart.status === ChartStatusEnum.SUCCEED ? 'Success' :
                                 chart.status === ChartStatusEnum.RUNNING ? 'Analyzing' : 'Failed'}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                                onClick={(e) => handleDelete(e, chart.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h3 className="truncate text-xl font-bold text-foreground/90 group-hover:text-primary transition-colors leading-tight">
                                {chart.name || '未命名分析'}
                              </h3>
                              <p className="text-[13px] font-medium text-foreground/40 line-clamp-2 min-h-[40px] leading-relaxed">
                                {chart.goal || '没有分析目标描述'}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.15em]">
                                <span className="text-foreground/50">{chart.chartType || '未知规格'}</span>
                                <div className="w-1 h-1 rounded-full bg-foreground/10" />
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-primary/30" />
                                  <span>{chart.createTime ? new Date(chart.createTime).toLocaleDateString() : ''}</span>
                                </div>
                              </div>
                              <div className="p-2 rounded-full glass bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1 group-hover:bg-primary/10">
                                <ChevronRight className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Pagination />
          </div>
        )}
      </div>
    </div>
  )
}
