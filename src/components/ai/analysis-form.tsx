'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Upload, FileUp, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

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
        <Card className="rounded-[2rem] border-black/5 bg-white/60 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/50">
            <CardHeader className="border-b border-black/5 bg-white/40 pb-6 dark:border-white/5 dark:bg-black/40">
                <CardTitle className="text-2xl font-bold">分析配置</CardTitle>
                <CardDescription className="text-base">告诉 AI 你的需求，并上传数据</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 font-medium dark:text-gray-300">图表名称</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="例如：2023年Q3销售汇总"
                                            className="h-12 rounded-xl border-black/10 bg-white/70 shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20 dark:border-white/10 dark:bg-black/20 dark:focus:bg-black/40"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="goal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 font-medium dark:text-gray-300">分析目标</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="例如：分析各地区的销售总额及其占比情况，找出核心增长点。"
                                            className="min-h-[120px] resize-none rounded-xl border-black/10 bg-white/70 p-4 shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#0071e3]/20 dark:border-white/10 dark:bg-black/20 dark:focus:bg-black/40"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="pt-1">描述越详细，AI 的分析就越准确。</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="chartType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 font-medium dark:text-gray-300">图表类型</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 rounded-xl border-black/10 bg-white/70 shadow-sm transition-all hover:bg-white focus:ring-2 focus:ring-[#0071e3]/20 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30">
                                                <SelectValue placeholder="选择 AI 生成的图表类型" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl shadow-lg">
                                            {Object.values(ChartTypeEnum).map(type => {
                                                const iconConfig = chartIconMap[type];
                                                const Icon = iconConfig?.icon;
                                                return (
                                                    <SelectItem key={type} value={type} className="rounded-lg py-2.5">
                                                        <div className="flex items-center gap-2">
                                                            {Icon && <Icon className={`h-4 w-4 ${iconConfig.color}`} />}
                                                            <span>{type}</span>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* File Upload Area */}
                        <div className="space-y-3 pt-2">
                            <FormLabel className="text-gray-700 font-medium dark:text-gray-300">数据文件</FormLabel>
                            <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-black/15 bg-white/50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#0071e3]/50 hover:bg-[#0071e3]/5 hover:shadow-lg dark:border-white/10 dark:bg-black/20 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10">
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
                                            className="flex flex-col items-center gap-2"
                                        >
                                            <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                                <FileUp className="h-6 w-6" />
                                            </div>
                                            <span className="max-w-full truncate px-4 font-medium text-gray-900 dark:text-gray-100">
                                                {file.name}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="upload"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex flex-col items-center gap-2"
                                        >
                                            <div className="rounded-full bg-blue-100 p-3 text-[#0071e3] transition-transform group-hover:scale-110 group-hover:bg-[#0071e3]/20 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                <Upload className="h-6 w-6" />
                                            </div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                点击或拖拽上传数据
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                支持 Excel 或 CSV 文件
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={isAnalyzing}
                                onClick={() => { submitMode.current = 'sync' }}
                                className="h-12 flex-1 rounded-xl bg-black text-lg text-white shadow-lg transition-all hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                            >
                                {isAnalyzing && submitMode.current === 'sync' ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        分析中...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        同步分析
                                    </>
                                )}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isAnalyzing}
                                onClick={() => { submitMode.current = 'async' }}
                                variant="outline"
                                className="h-12 flex-1 rounded-xl border-2 bg-white/50 text-lg shadow-sm transition-all hover:bg-white/80 dark:bg-black/40 dark:hover:bg-black/60"
                            >
                                {isAnalyzing && submitMode.current === 'async' ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        提交中...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        异步分析
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
