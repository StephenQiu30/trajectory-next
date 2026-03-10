'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { deleteChart, listMyChartVoByPage } from '@/api/ai/smartAnalysisController'
import { ChartStatusEnum, ChartTypeEnum } from '@/enums/ChartTypeEnum'
import { chartIconMap, getChartIcon } from '@/constants/chartIcons'
import { ChevronRight, Clock, Loader2, Trash2, TrendingUp, } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HistoryPanelProps {
  onSelectChart: (chart: AiAPI.ChartVO) => void
}


export function HistoryPanel({ onSelectChart }: HistoryPanelProps) {
  const [charts, setCharts] = React.useState<AiAPI.ChartVO[]>([])
  const [loading, setLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const pageSize = 12 // Using a grid layout
  const router = useRouter()

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
    } catch (dui e: any) {
      toast.error('因网络原因获取历史记录失败')
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
        fetchCharts(page)
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
      <div className="mt-8 flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded-full"
        >
          上一页
        </Button>
        <span className="text-muted-foreground flex items-center px-4 text-sm font-medium">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="rounded-full"
        >
          下一页
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0 pb-6">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Clock className="h-6 w-6 text-[#0071e3]" />
          历史分析记录
        </CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          查看以往由 AI 生成的数据视图与洞察报告。（共 {total} 条）
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {loading && charts.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[2rem] border border-black/5 bg-white/30 p-8 backdrop-blur-xl dark:border-white/5 dark:bg-black/20">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#0071e3]" />
            <p className="text-muted-foreground font-medium">正在加载历史记录...</p>
          </div>
        ) : charts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-black/5 bg-white/30 p-16 text-center backdrop-blur-xl dark:border-white/5 dark:bg-black/20">
            <div className="mb-6 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
              <TrendingUp className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300">暂无分析记录</p>
            <p className="mt-2 text-gray-500">快去左侧上传数据生成您的第一份洞察吧！</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <AnimatePresence>
                {charts.map((chart, index) => (
                  <motion.div
                    key={chart.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div
                      className="group relative flex h-[220px] cursor-pointer flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 hover:shadow-md dark:border-white/10 dark:bg-black/40 dark:hover:bg-black/50"
                      onClick={() => router.push(`/ai/${chart.id}`)}
                    >

                      <div className="mt-1 mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "rounded-2xl p-3 shadow-sm ring-1 ring-black/5 transition-colors dark:ring-white/10",
                            chartIconMap[chart.chartType as ChartTypeEnum]?.bgColor || 'bg-gray-100'
                          )}>
                            {getChartIcon(chart.chartType)}
                          </div>
                          <div className="flex flex-col">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 group-hover:text-[#0071e3] transition-colors dark:text-gray-100">
                              {chart.name || '未命名图表'}
                              {/* Status Dot */}
                              <div
                                className={cn(
                                  'h-2 w-2 rounded-full',
                                  chart.status === ChartStatusEnum.SUCCEED && 'bg-green-500',
                                  chart.status === ChartStatusEnum.RUNNING && 'bg-blue-500 animate-pulse',
                                  chart.status === ChartStatusEnum.FAILED && 'bg-red-500'
                                )}
                              />
                            </h3>
                            <span className="text-muted-foreground text-xs font-medium">
                              {chart.chartType}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                          onClick={e => handleDelete(e, chart.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-1 font-medium text-gray-700 dark:text-gray-300">
                          目标:
                        </span>
                        {chart.goal}
                      </div>

                      {chart.status === ChartStatusEnum.SUCCEED && chart.genResult && (
                        <div className="mb-4 flex-1 overflow-hidden pt-2 border-t border-black/5 dark:border-white/5">
                          <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            {chart.genResult.replace(/[#*`]/g, '') /* Strip basic markdown chars for preview text */}
                          </p>
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between text-sm">
                        <div className="text-muted-foreground flex items-center gap-1.5">
                          {chart.status === ChartStatusEnum.SUCCEED && (
                            <span className="flex h-2 w-2 rounded-full bg-green-500" />
                          )}
                          {chart.status === ChartStatusEnum.RUNNING && (
                            <span className="flex h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                          )}
                          {chart.status === ChartStatusEnum.FAILED && (
                            <span className="flex h-2 w-2 rounded-full bg-red-500" />
                          )}
                          <span className="capitalize">
                            {chart.status === ChartStatusEnum.SUCCEED
                              ? '分析完成'
                              : chart.status === ChartStatusEnum.RUNNING
                                ? '分析中'
                                : '分析失败'}
                          </span>
                        </div>
                        <div className="flex -translate-x-2 items-center font-medium text-[#0071e3] opacity-0 transition-opacity duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                          查看详情 <ChevronRight className="ml-0.5 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Pagination />
          </div>
        )}
      </CardContent>
    </Card >
  )
}
