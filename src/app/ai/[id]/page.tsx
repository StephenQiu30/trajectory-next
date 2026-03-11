'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getChartVoById } from '@/api/ai/smartAnalysisController'
import { ChartViewer } from '@/components/ai'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function DetailedAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [chartData, setChartData] = React.useState<AiAPI.ChartVO | null>(null)

  React.useEffect(() => {
    if (!id) return

    const fetchDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getChartVoById({ id: Number(id) })
        if (res.code === 0 && res.data) {
          setChartData(res.data)
        } else {
          setError(res.message || '获取分析详情失败')
          toast.error(res.message || '获取分析详情失败')
        }
      } catch (err) {
        setError('网络或服务异常，请稍后重试')
        toast.error('网络或服务异常，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  return (
    <div className="bg-background flex min-h-screen flex-col font-sans selection:bg-[#0071e3]/20">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-[#0071e3]/3 opacity-60 blur-[120px] filter" />
        <div className="absolute top-[-10%] right-[20%] h-[50vw] w-[50vw] rounded-full bg-indigo-400/3 opacity-60 blur-[120px] filter" />
      </div>

      <main className="relative z-10 container mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 pt-12 pb-8 md:px-8 md:pt-12 md:pb-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group text-muted-foreground hover:text-foreground -ml-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            返回列表
          </Button>
        </div>

        {loading ? (
          <div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#0071e3]" />
            <p className="text-muted-foreground font-medium">正在加载深度洞察报告...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-full bg-red-50 p-6 dark:bg-red-900/20">
              <AlertCircle className="h-12 w-12 text-red-500 opacity-80" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              加载失败
            </h3>
            <p className="max-w-md text-lg text-gray-500 dark:text-gray-400">{error}</p>
            <Button variant="outline" onClick={() => router.back()} className="mt-6 rounded-full">
              返回上一页
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-1"
          >
            <ChartViewer data={chartData} />
          </motion.div>
        )}
      </main>
    </div>
  )
}
