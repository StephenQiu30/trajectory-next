'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Cpu, FileUp, Loader2, Sparkles, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

import { ChartTypeEnum } from '../../enums/ChartTypeEnum'
import { chartIconMap } from '@/constants/chartIcons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { genChartByAi, genChartByAiAsync } from '@/api/ai/smartAnalysisController'

const formSchema = z.object({
  name: z.string().min(2, {
    message: '图表名称至少需要 2 个字符',
  }),
  goal: z.string().min(5, {
    message: '分析目标至少需要 5 个字符',
  }),
  chartType: z.string().min(1, {
    message: '请选择一个图表类型',
  }),
})

interface AnalysisFormProps {
  onAnalysisSuccess: (response: AiAPI.ChartVO) => void
  onAnalysisAsyncSuccess: () => void
}

export function AnalysisForm({ onAnalysisSuccess, onAnalysisAsyncSuccess }: AnalysisFormProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const submitMode = React.useRef<'sync' | 'async'>('sync')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      goal: '',
      chartType: '',
    },
  })

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      // Check if it's an excel file or csv
      if (
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel' ||
        selectedFile.type === 'text/csv'
      ) {
        setFile(selectedFile)
      } else {
        toast.error('请上传 Excel 或 CSV 文件')
        e.target.value = '' // Reset input
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      toast.error('请先上传数据文件')
      return
    }

    setIsAnalyzing(true)

    try {
      if (submitMode.current === 'async') {
        toast.loading('任务已提交，AI 正在后台处理中...', { id: 'analyze' })

        const aiRes = await genChartByAiAsync(
          {
            chartGenRequest: {
              name: values.name,
              goal: values.goal,
              chartType: values.chartType,
            },
          },
          {},
          file
        )

        if (aiRes.code === 0) {
          toast.success('任务已提交，后台处理完成后可在「历史」中查看。', { id: 'analyze' })
          onAnalysisAsyncSuccess()
        } else {
          throw new Error(aiRes.message || '提交异步分析失败')
        }
      } else {
        toast.loading('AI 正在冥思苦想中...', { id: 'analyze' })

        // Call AI generate API directly with the file
        const aiRes = await genChartByAi(
          {
            chartGenRequest: {
              name: values.name,
              goal: values.goal,
              chartType: values.chartType,
            },
          },
          {},
          file
        )

        if (aiRes.code === 0 && aiRes.data) {
          toast.success('分析完成！', { id: 'analyze' })
          // Adapt Chart to ChartVO
          const chartVO: AiAPI.ChartVO = {
            ...aiRes.data,
            createTime: aiRes.data.createTime || new Date().toISOString(),
            updateTime: aiRes.data.updateTime || new Date().toISOString(),
          }
          onAnalysisSuccess(chartVO)
        } else {
          throw new Error(aiRes.message || '生成分析失败')
        }
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || '请求发生错误，请稍后重试', { id: 'analyze' })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="pb-8">
        <h2 className="text-2xl font-bold tracking-tight">配置任务</h2>
        <p className="text-muted-foreground/50 mt-1.5 text-xs font-semibold uppercase tracking-widest">
          Step 1: Define your goal
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-foreground/80 ml-0.5 text-[13px] font-bold">
                    图表名称
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例如：2023年Q3销售汇总"
                      className="border-none bg-secondary/30 focus:bg-secondary/50 h-12 rounded-2xl px-5 text-sm font-medium ring-offset-background transition-all placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="ml-1 text-[11px] font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-foreground/80 ml-0.5 text-[13px] font-bold">
                    分析目标
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="描述你想从数据中获得什么洞察，例如：分析各地区的销售总额及其占比情况..."
                      className="border-none bg-secondary/30 focus:bg-secondary/50 min-h-[110px] resize-none rounded-2xl p-5 text-sm font-medium leading-relaxed ring-offset-background transition-all placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="ml-1 text-[11px] font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chartType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-foreground/80 ml-0.5 text-[13px] font-bold">
                    推荐图表
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-none bg-secondary/30 focus:bg-secondary/50 flex h-12 rounded-2xl px-5 text-sm font-medium ring-offset-background transition-all focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="智能选择最合适的图表类型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="glass apple-shadow rounded-[1.5rem] border-none p-1">
                      {Object.values(ChartTypeEnum).map(type => {
                        const iconConfig = chartIconMap[type]
                        const Icon = iconConfig?.icon
                        return (
                          <SelectItem
                            key={type}
                            value={type}
                            className="focus:bg-primary/5 m-1 cursor-pointer rounded-xl py-3 text-sm transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-background shadow-sm", iconConfig?.color?.replace('text-', 'bg-') + '/10')}>
                                {Icon && <Icon className={cn("h-4 w-4", iconConfig.color)} />}
                              </div>
                              <span className="font-semibold">{type}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage className="ml-1 text-[11px] font-medium" />
                </FormItem>
              )}
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-3">
            <FormLabel className="text-foreground/80 ml-0.5 text-[13px] font-bold">
              上传数据源
            </FormLabel>
            <div className="group border-border/40 bg-secondary/20 hover:border-primary/30 hover:bg-primary/[0.02] relative overflow-hidden rounded-[2rem] border p-8 text-center transition-all duration-500">
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileChange}
              />

              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ring-1 ring-primary/20">
                      <FileUp className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="max-w-[240px] truncate text-sm font-bold">
                        {file.name}
                      </span>
                      <span className="text-muted-foreground/50 text-[10px] font-bold uppercase monospaced">
                        {(file.size / 1024).toFixed(2)} KB • READY
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="bg-primary shadow-primary/20 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:scale-110">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-bold">点击上传或拖拽文件</span>
                      <p className="text-muted-foreground/40 text-[10px] font-semibold uppercase tracking-tight">
                        Excel, CSV (Max 5MB)
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Button
              type="submit"
              disabled={isAnalyzing}
              onClick={() => {
                submitMode.current = 'sync'
              }}
              className="bg-primary hover:bg-primary/90 h-14 w-full rounded-[1.25rem] text-base font-bold text-white shadow-[0_8px_16px_-4px_rgba(0,102,255,0.3)] transition-all active:scale-[0.98] dark:shadow-[0_8px_16px_-4px_rgba(0,102,255,0.5)]"
            >
              {isAnalyzing && submitMode.current === 'sync' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  正在深度分析中
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  开始智能分析
                </>
              )}
            </Button>

            <div className="relative py-2 opacity-30">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-dotted border-foreground" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                <span className="bg-background px-3">或</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isAnalyzing}
              onClick={() => {
                submitMode.current = 'async'
              }}
              variant="outline"
              className="border-border/40 bg-secondary/30 hover:bg-secondary/50 h-14 w-full rounded-[1.25rem] text-sm font-bold transition-all active:scale-[0.98]"
            >
              {isAnalyzing && submitMode.current === 'async' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  已提交队列
                </>
              ) : (
                <>
                  <Cpu className="text-primary/70 mr-2 h-4 w-4" />
                  启用高性能异步分析
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
