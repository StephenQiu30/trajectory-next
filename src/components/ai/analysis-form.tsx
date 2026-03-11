'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { FileUp, Loader2, Sparkles, Upload, Cpu } from 'lucide-react'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

import { ChartTypeEnum } from '../../enums/ChartTypeEnum'
import { chartIconMap } from '@/constants/chartIcons'
import { Button } from '@/components/ui/button'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
          toast.success('异步分析任务提交成功，请在历史记录中查看！', { id: 'analyze' })
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
    <div className="flex flex-col h-full w-full glass apple-shadow p-6 sm:p-8 transition-all duration-300 rounded-[2.5rem] border-none">
      <div className="pb-8">
        <h2 className="text-2xl font-bold tracking-tight">配置分析任务</h2>
        <p className="text-sm text-foreground/60 mt-1.5 font-medium">设定图表目标并上传数据源，让 AI 为你洞察</p>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold ml-1">图表名称</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例如：2023年Q3销售汇总"
                      className="h-12 rounded-2xl border-border/50 bg-secondary/30 px-4 text-sm transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold ml-1">分析目标</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例如：分析各地区的销售总额及其占比情况"
                      className="min-h-[100px] resize-none rounded-2xl border-border/50 bg-secondary/30 p-4 text-sm transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5 leading-relaxed"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-foreground/40 ml-1 font-medium">
                    描述越详细，AI 生成越准确
                  </FormDescription>
                  <FormMessage className="ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chartType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold ml-1">图表类型</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-secondary/30 px-4 text-sm transition-all focus:ring-4 focus:ring-primary/5">
                        <SelectValue placeholder="智能选择类型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="glass apple-shadow border-none rounded-2xl">
                      {Object.values(ChartTypeEnum).map(type => {
                        const iconConfig = chartIconMap[type]
                        const Icon = iconConfig?.icon
                        return (
                          <SelectItem key={type} value={type} className="rounded-xl py-3 text-sm m-1 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                              {Icon && <Icon className={`h-4 w-4 ${iconConfig.color}`} />}
                              <span className="font-medium">{type}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage className="ml-1" />
                </FormItem>
              )}
            />

            {/* File Upload Area */}
            <div className="space-y-3 pt-2">
              <FormLabel className="text-sm font-bold ml-1">数据源文件</FormLabel>
              <div className="group relative overflow-hidden rounded-[2rem] border-2 border-dashed border-border/50 bg-secondary/20 p-8 text-center transition-all hover:border-primary hover:bg-primary/5">
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
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="rounded-2xl bg-primary/10 p-4 text-primary apple-shadow">
                        <FileUp className="h-6 w-6" />
                      </div>
                      <span className="max-w-full text-ellipsis overflow-hidden whitespace-nowrap px-4 text-sm font-bold">
                        {file.name}
                      </span>
                      <span className="text-xs text-foreground/40 font-medium">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="rounded-2xl bg-primary/10 p-4 text-primary transition-transform group-hover:scale-110 duration-500 apple-shadow">
                        <Upload className="h-6 w-6" />
                      </div>
                      <span className="font-bold text-sm">拖拽或点击上传</span>
                      <span className="text-xs text-foreground/40 font-medium">支持 .csv, .xlsx (最大 5MB)</span>
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
                className="h-14 w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold apple-shadow transition-all active:scale-[0.98]"
              >
                {isAnalyzing && submitMode.current === 'sync' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    开始智能生成
                  </>
                )}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-background px-3 text-foreground/40 font-bold tracking-widest">OR</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isAnalyzing}
                onClick={() => {
                  submitMode.current = 'async'
                }}
                variant="outline"
                className="h-14 w-full rounded-2xl border-border/50 bg-secondary/30 font-bold hover:bg-secondary/50 transition-all active:scale-[0.98]"
              >
                {isAnalyzing && submitMode.current === 'async' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Cpu className="mr-2 h-5 w-5 text-primary" />
                    后台异步处理
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
