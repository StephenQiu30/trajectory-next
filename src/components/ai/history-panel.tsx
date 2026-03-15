import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { deleteChart, listMyChartVoByPage } from '@/api/ai/smartAnalysisController'
import { ChartStatusEnum } from '@/enums/ChartTypeEnum'
import { chartIconMap, getChartIcon } from '@/constants/chartIcons'
import { BarChart2, ChevronRight, Clock, Search, Sparkles, Trash2 } from 'lucide-react'
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
          className="glass apple-shadow h-11 rounded-full border-none px-8 font-bold transition-all hover:bg-white/50 active:scale-95 dark:hover:bg-white/5"
        >
          上一页
        </Button>
        <div className="glass text-foreground/40 apple-shadow rounded-full border-none px-6 py-2 text-sm font-bold">
          {page} / {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="glass apple-shadow h-11 rounded-full border-none px-8 font-bold transition-all hover:bg-white/50 active:scale-95 dark:hover:bg-white/5"
        >
          下一页
        </Button>
      </div>
    )
  }

  const HistorySkeleton = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {[...Array(pageSize)].map((_, i) => (
        <div
          key={i}
          className="glass apple-shadow space-y-7 rounded-[2.5rem] border-none bg-white/5 p-7 dark:bg-black/20"
        >
          <div className="flex items-start justify-between">
            <Skeleton className="h-16 w-16 rounded-3xl" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Local filtering by status since backend typing is missing it
  const filteredCharts = React.useMemo(() => {
    if (!statusFilter) return charts
    return charts.filter(c => {
      if (statusFilter === 'failed') return c.status === 'failed'
      return c.status === statusFilter
    })
  }, [charts, statusFilter])

  return (
    <div className="flex h-full w-full flex-col space-y-8 bg-transparent">
      {/* Search & Filter Header */}
      <div className="flex flex-col justify-between gap-6 px-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-5">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">历史记录</h2>
            <p className="text-foreground/40 text-[10px] font-bold tracking-widest dark:text-foreground/60 uppercase">
              Total {total} Analysis Reports
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="group relative w-full sm:w-[280px]">
            <Search className="text-foreground/20 group-hover:text-primary absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 transition-colors duration-300" />
            <Input
              placeholder="搜索任务..."
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className="glass apple-shadow focus-visible:ring-primary/20 h-11 rounded-xl border-none pr-4 pl-10 text-xs font-medium transition-all duration-500 focus-visible:ring-1"
            />
          </div>
          <div className="glass apple-shadow flex items-center rounded-2xl border-none p-1.5">
            {[
              { label: '全部', value: undefined },
              { label: '成功', value: ChartStatusEnum.SUCCEED },
              { label: '失败', value: 'failed' },
            ].map(tab => (
              <button
                key={tab.label}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  'rounded-xl px-6 py-2.5 text-xs font-bold transition-all duration-500',
                  statusFilter === tab.value
                    ? 'text-primary bg-background/80 shadow-sm scale-105'
                    : 'text-foreground/40 hover:text-foreground/60'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden px-2">
        {loading && charts.length === 0 ? (
          <HistorySkeleton />
        ) : filteredCharts.length === 0 ? (
          <div className="glass apple-shadow flex h-[500px] flex-col items-center justify-center space-y-6 rounded-[3rem] p-12 text-center">
            <div className="bg-primary/5 relative flex h-24 w-24 items-center justify-center rounded-[2rem]">
              <BarChart2 className="text-primary/20 h-12 w-12" />
              <Search className="text-primary/10 absolute -right-1 -bottom-1 h-6 w-6" />
            </div>
            <div className="space-y-2">
              <p className="text-foreground/40 text-2xl font-bold tracking-tight">暂无匹配记录</p>
              <p className="text-foreground/30 max-w-xs text-sm leading-relaxed font-medium">
                尝试调整搜索词或筛选条件，或者立即开启一次新的数据洞察。
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col gap-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredCharts.map((chart) => (
                  <motion.div
                    key={chart.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                  >
                    <Card
                      className="glass apple-shadow group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[2.5rem] border-none transition-all duration-700 hover:translate-y-[-4px] hover:scale-[1.01] active:scale-[0.98] dark:hover:bg-white/[0.05]"
                      onClick={() => onSelectChart(chart)}
                    >
                      {/* Atmospheric Background & Technical Accents */}
                      <div className="pointer-events-none absolute inset-0 opacity-10 transition-opacity duration-700 group-hover:opacity-20">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                            backgroundSize: '24px 24px',
                          }}
                        />
                      </div>
                      <div className="pointer-events-none absolute -inset-2 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                        <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent blur-3xl" />
                      </div>

                      {/* Technical Corner Accents */}
                      <div className="text-primary/20 absolute top-4 left-4 h-2 w-2 border-t border-l transition-colors duration-500 group-hover:text-primary/40" />
                      <div className="text-primary/20 absolute right-4 bottom-4 h-2 w-2 border-r border-b transition-colors duration-500 group-hover:text-primary/40" />

                      <CardContent className="relative z-10 flex flex-1 flex-col p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  'flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-transform duration-500 group-hover:rotate-6',
                                  chartIconMap[chart.chartType || '']?.bgColor || 'bg-secondary'
                                )}
                              >
                                {(() => {
                                  const iconConfig = chartIconMap[chart.chartType || '']
                                  if (iconConfig) {
                                    const Icon = iconConfig.icon
                                    return <Icon className={cn('h-5 w-5', iconConfig.color)} />
                                  }
                                  return <BarChart2 className="text-foreground/40 h-5 w-5" />
                                })()}
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-primary/40 block text-[8px] font-black tracking-widest uppercase monospaced">
                                  ID: {chart.id?.toString().padStart(6, '0') || '000000'}
                                </span>
                                <p className="text-foreground/30 text-[9px] font-bold tracking-widest uppercase">
                                  {chartIconMap[chart.chartType || '']?.label ||
                                    'Intelligence Report'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-black tracking-widest uppercase shadow-sm transition-all duration-500',
                                  chart.status === ChartStatusEnum.SUCCEED
                                    ? 'bg-green-500/10 text-green-500 ring-1 ring-green-500/20'
                                    : chart.status === ChartStatusEnum.RUNNING
                                      ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                                      : 'bg-destructive/10 text-destructive ring-1 ring-destructive/20'
                                )}
                              >
                                <div
                                  className={cn(
                                    'h-1 w-1 rounded-full',
                                    chart.status === ChartStatusEnum.SUCCEED
                                      ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                                      : chart.status === ChartStatusEnum.RUNNING
                                        ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                                        : 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                                  )}
                                />
                                {chart.status === ChartStatusEnum.SUCCEED
                                  ? 'Success'
                                  : chart.status === ChartStatusEnum.RUNNING
                                    ? 'Running'
                                    : 'Failed'}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100"
                                onClick={e => handleDelete(e, chart.id!)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <h3 className="text-foreground/90 group-hover:text-primary line-clamp-1 text-lg font-bold tracking-tight transition-colors">
                              {chart.name || '未命名报告'}
                            </h3>
                            <div className="bg-primary/5 h-px w-12 transition-all duration-500 group-hover:w-full" />
                          </div>

                          {/* Mission Brief Section */}
                          <div className="bg-secondary/20 group-hover:bg-secondary/40 relative h-20 overflow-hidden rounded-xl p-3.5 transition-colors">
                            <div className="bg-primary/20 absolute top-0 left-0 h-full w-1" />
                            <span className="text-primary/30 mb-1 block text-[7px] font-black tracking-[0.2em] uppercase">
                              Mission Brief
                            </span>
                            <p className="text-foreground/60 line-clamp-2 text-[11px] leading-relaxed font-medium italic">
                              "{chart.goal || '此项分析任务未设定明确目标。'}"
                            </p>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="text-foreground/30 flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase">
                              <Clock className="h-3 w-3 opacity-40" />
                              {chart.createTime
                                ? new Date(chart.createTime).toLocaleDateString()
                                : 'Recently'}
                            </div>
                            <div className="bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white flex h-7 w-7 items-center justify-center rounded-lg shadow-sm transition-all active:scale-90">
                              <ChevronRight className="h-4 w-4" />
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
