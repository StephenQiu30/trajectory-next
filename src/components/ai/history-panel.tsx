import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { deleteChart, listMyChartVoByPage } from '@/api/ai/smartAnalysisController'
import { ChartStatusEnum } from '@/enums/ChartTypeEnum'
import { chartIconMap } from '@/constants/chartIcons'
import { BarChart2, ChevronRight, Clock, Search, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HistoryPanelProps {
  onSelectChart: (chart: AiAPI.ChartVO) => void
}

export function HistoryPanel({ onSelectChart }: HistoryPanelProps) {
  const [charts, setCharts] = React.useState<AiAPI.ChartVO[]>([])
  const [loading, setLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [searchName, setSearchName] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>(undefined)
  const pageSize = 12

  const fetchCharts = async (current: number, name?: string) => {
    try {
      setLoading(true)
      const res = await listMyChartVoByPage({
        current,
        pageSize,
        name,
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

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchCharts(1, searchName)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchName, statusFilter])

  React.useEffect(() => {
    if (page !== 1) {
      fetchCharts(page, searchName)
    }
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
          fetchCharts(page, searchName)
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
      <div className="mt-12 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="h-10 rounded-full px-6 transition-all active:scale-[0.98]"
        >
          上一页
        </Button>
        <div className="bg-secondary/40 flex h-10 items-center rounded-full px-5 text-sm font-bold">
          <span className="text-primary">{page}</span>
          <span className="text-muted-foreground/30 mx-2 font-black">/</span>
          <span className="text-muted-foreground/60">{totalPages}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="h-10 rounded-full px-6 transition-all active:scale-[0.98]"
        >
          下一页
        </Button>
      </div>
    )
  }

  const HistorySkeleton = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(pageSize)].map((_, i) => (
        <div key={i} className="glass apple-shadow rounded-[2rem] bg-white/40 p-6 dark:bg-white/[0.02]">
          <div className="flex items-start justify-between">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="mt-6 space-y-3">
            <Skeleton className="h-6 w-4/5 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <div className="flex justify-between pt-4">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Local filtering by status
  const filteredCharts = React.useMemo(() => {
    if (!statusFilter) return charts
    return charts.filter(c => {
      if (statusFilter === 'failed') return c.status === 'failed'
      return c.status === statusFilter
    })
  }, [charts, statusFilter])

  return (
    <div className="flex h-full w-full flex-col gap-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-[1.25rem] ring-1 ring-primary/20">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">分析历史</h2>
            <p className="text-muted-foreground/50 text-xs font-bold uppercase tracking-widest monospaced">
              {total} ANALYTICAL RECORDS
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 opacity-40" />
            <Input
              placeholder="搜索任务名称..."
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className="border-none bg-secondary/30 focus:bg-secondary/50 h-11 rounded-full pl-11 text-sm font-medium ring-offset-background transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="bg-secondary/40 flex items-center rounded-full p-1 ring-1 ring-white/10 dark:ring-white/5">
            {[
              { label: '全部', value: undefined },
              { label: '成功', value: ChartStatusEnum.SUCCEED },
              { label: '失败', value: 'failed' },
            ].map(t => (
              <button
                key={t.label}
                onClick={() => setStatusFilter(t.value)}
                className={cn(
                  'rounded-full px-5 py-2 text-[11px] font-bold transition-all',
                  statusFilter === t.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground/60 hover:text-foreground'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden">
        {loading && charts.length === 0 ? (
          <HistorySkeleton />
        ) : filteredCharts.length === 0 ? (
          <div className="glass group relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-white/40 p-12 text-center dark:bg-white/[0.02]">
             <div className="bg-primary/10 text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] shadow-sm transition-transform duration-500 group-hover:scale-110">
              <BarChart2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">暂无相关记录</h3>
              <p className="text-muted-foreground/60 max-w-xs text-sm font-medium">
                没找到匹配的分析报告，请尝试调整筛选条件或新建分析任务。
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredCharts.map((chart) => {
                  const iconConfig = chartIconMap[chart.chartType || '']
                  const Icon = iconConfig?.icon ?? BarChart2
                  return (
                    <motion.div
                      key={chart.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full"
                    >
                      <Card
                        className="glass group apple-shadow flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border-none bg-white/50 transition-all duration-500 hover:bg-white/80 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] active:scale-[0.98] dark:bg-white/[0.02] dark:hover:bg-white/[0.05]"
                        onClick={() => onSelectChart(chart)}
                      >
                        <CardContent className="flex flex-1 flex-col p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div
                              className={cn(
                                'flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] shadow-sm ring-1 ring-white/20 transition-transform duration-500 group-hover:scale-110',
                                iconConfig?.bgColor ?? 'bg-secondary'
                              )}
                            >
                              <Icon className={cn('h-6 w-6', iconConfig?.color ?? 'text-muted-foreground')} />
                            </div>
                            <div className="flex items-center gap-1.5 pt-1">
                              <span
                                className={cn(
                                  'rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest',
                                  chart.status === ChartStatusEnum.SUCCEED
                                    ? 'bg-green-500/10 text-green-600'
                                    : chart.status === ChartStatusEnum.RUNNING
                                      ? 'bg-primary/10 text-primary'
                                      : 'bg-destructive/10 text-destructive'
                                )}
                              >
                                {chart.status === ChartStatusEnum.SUCCEED
                                  ? 'Done'
                                  : chart.status === ChartStatusEnum.RUNNING
                                    ? 'In Progress'
                                    : 'Failed'}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 flex-1 space-y-2">
                             <h3 className="line-clamp-1 text-lg font-bold leading-none tracking-tight">
                                {chart.name || '未命名报告'}
                              </h3>
                              <p className="text-muted-foreground/60 line-clamp-2 text-xs font-semibold leading-relaxed">
                                {chart.goal || '正在执行深度数据洞察与模式探索...'}
                              </p>
                          </div>

                          <div className="mt-8 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <div className="bg-primary/20 h-1.5 w-1.5 rounded-full" />
                               <span className="text-muted-foreground/40 text-[10px] font-bold uppercase monospaced">
                                {chart.createTime
                                  ? new Date(chart.createTime).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', year: 'numeric'})
                                  : 'JAN 01, 2024'}
                               </span>
                            </div>

                            <div className="flex items-center gap-2">
                               <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-xl transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95"
                                  onClick={e => handleDelete(e, chart.id!)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300">
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            <Pagination />
          </div>
        )}
      </div>
    </div>
  )
}
