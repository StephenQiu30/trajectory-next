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
import { Clock, Loader2, Trash2, ChevronRight, BarChart2, Search, Filter, Sparkles } from 'lucide-react'
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
          className="rounded-full glass apple-shadow border-none font-bold px-8 h-11 transition-all active:scale-95 hover:bg-white/50 dark:hover:bg-white/10"
        >
          上一页
        </Button>
        <div className="glass px-6 py-2 rounded-full text-foreground/40 font-bold text-sm border-none apple-shadow">
          {page} / {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="rounded-full glass apple-shadow border-none font-bold px-8 h-11 transition-all active:scale-95 hover:bg-white/50 dark:hover:bg-white/10"
        >
          下一页
        </Button>
      </div>
    )
  }

  const HistorySkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {[...Array(pageSize)].map((_, i) => (
        <div key={i} className="glass apple-shadow p-7 rounded-[2.5rem] space-y-7 border-none bg-white/5 dark:bg-black/20">
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
    <div className="flex flex-col h-full bg-transparent w-full space-y-8">
      {/* Search & Filter Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight">历史记录</h2>
          <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Total {total} Analysis Reports
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-[300px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20 group-hover:text-primary/40 transition-colors" />
             <Input
               placeholder="搜索分析名称..."
               value={searchName}
               onChange={(e) => setSearchName(e.target.value)}
               className="h-12 pl-11 pr-4 rounded-2xl glass apple-shadow border-none bg-white/40 dark:bg-black/20 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
             />
          </div>
          <div className="flex items-center glass p-1 rounded-[1.25rem] apple-shadow border-none bg-white/40 dark:bg-black/20">
            {[
              { label: '全部', value: undefined },
              { label: '成功', value: ChartStatusEnum.SUCCEED },
              { label: '失败', value: 'failed' },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                  statusFilter === tab.value
                    ? "bg-white dark:bg-white/10 text-primary apple-shadow scale-[1.05]"
                    : "text-foreground/30 hover:text-foreground/50"
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
          <div className="flex h-[500px] flex-col items-center justify-center rounded-[3rem] glass apple-shadow p-12 text-center space-y-6">
            <div className="w-24 h-24 rounded-[2rem] bg-primary/5 flex items-center justify-center relative">
              <BarChart2 className="h-12 w-12 text-primary/20" />
              <Search className="h-6 w-6 text-primary/10 absolute -bottom-1 -right-1" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground/40 tracking-tight">暂无匹配记录</p>
              <p className="max-w-xs text-sm text-foreground/30 font-medium leading-relaxed">
                尝试调整搜索词或筛选条件，或者立即开启一次新的数据洞察。
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredCharts.map((chart, index) => (
                  <motion.div
                    key={chart.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Card
                      className="group relative cursor-pointer overflow-hidden border-none bg-secondary/5 glass apple-shadow transition-all duration-700 hover:scale-[1.02] active:scale-[0.98] hover:bg-white/70 dark:hover:bg-white/10 rounded-[2.5rem]"
                      onClick={() => onSelectChart(chart)}
                    >
                      {/* Ambient background glow on hover */}
                      <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-3xl" />
                      </div>

                      <CardContent className="relative z-10 p-7">
                        <div className="flex flex-col gap-6">
                          <div className="flex items-start justify-between">
                            <div className={cn(
                              "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl apple-shadow transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3",
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
                                chart.status === ChartStatusEnum.RUNNING ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                              )}>
                                <div className={cn(
                                  "h-1.5 w-1.5 rounded-full shrink-0",
                                  chart.status === ChartStatusEnum.SUCCEED ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" :
                                  chart.status === ChartStatusEnum.RUNNING ? "bg-primary shadow-[0_0_8px_rgba(0,102,255,0.6)]" : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                                )} />
                                {chart.status === ChartStatusEnum.SUCCEED ? 'Success' :
                                 chart.status === ChartStatusEnum.RUNNING ? 'Analyzing' : 'Failed'}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                                onClick={(e) => handleDelete(e, chart.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <h3 className="truncate text-xl font-bold text-foreground/90 group-hover:text-primary transition-colors tracking-tight leading-none">
                                {chart.name || '未命名分析'}
                              </h3>
                              <p className="text-[12px] font-bold text-foreground/20 uppercase tracking-[0.1em]">
                                {chart.chartType || 'Standard Analysis'}
                              </p>
                            </div>

                            {chart.status === ChartStatusEnum.SUCCEED && chart.genResult && (
                              <div className="rounded-2xl bg-primary/[0.03] p-4 text-[12px] font-medium text-foreground/60 line-clamp-2 italic leading-relaxed border border-primary/5 group-hover:bg-primary/[0.06] transition-colors">
                                {chart.genResult.replace(/[#*`]/g, '').slice(0, 100)}...
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/25 uppercase tracking-widest">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3 w-3" />
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
