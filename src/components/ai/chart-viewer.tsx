'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cpu, FileSearch, Sparkles, Trash2, TrendingUp } from 'lucide-react'

// Simple markdown component using tailwind prose
const MarkdownViewer = ({ content }: { content: string }) => {
  // A very basic markdown render for the AI insights.
  // We'll replace headings, bold text, and lists with simple styled HTML.
  const createMarkup = (text: string) => {
    let html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(
        /^\> (.*$)/gim,
        '<blockquote class="border-l-4 border-gray-300 pl-4 my-2 text-gray-600 italic">$1</blockquote>'
      )
      .replace(/\n/gim, '<br/>')

    return { __html: html }
  }

  return (
    <div
      className="prose prose-slate dark:prose-invert prose-p:leading-relaxed prose-a:text-blue-600 max-w-none font-medium"
      dangerouslySetInnerHTML={createMarkup(content)}
    />
  )
}

export function ChartViewer({ data }: { data: AiAPI.ChartVO | null }) {
  if (!data) {
    return (
      <Card className="group relative h-full min-h-[500px] w-full overflow-hidden rounded-[2rem] border-black/5 bg-white/60 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/50">
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl border border-black/5 bg-white shadow-xl dark:border-white/10 dark:bg-black/40"
            >
              <FileSearch className="h-10 w-10 text-[#0071e3]" />
            </motion.div>

            {/* Minimal static decorations instead of animations */}
            <div className="absolute -top-4 -right-6 flex h-10 w-10 rotate-[15deg] items-center justify-center rounded-2xl border border-black/5 bg-white/80 shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-black/60">
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="absolute -bottom-4 -left-6 flex h-12 w-12 -rotate-[10deg] items-center justify-center rounded-2xl border border-black/5 bg-white/80 shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-black/60">
              <Cpu className="h-6 w-6 text-gray-400" />
            </div>
          </div>

          <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-gray-100">
            等待数据注入
          </h3>
          <p className="max-w-md text-lg leading-relaxed font-medium text-gray-500/90 dark:text-gray-400">
            左侧配置分析目标并上传数据。AI 引擎将自动构建清晰、专业的图表信息。
          </p>
        </div>
      </Card>
    )
  }

  let chartOption: any = {}
  try {
    if (data.genChart) {
      try {
        chartOption = JSON.parse(data.genChart)
      } catch (e) {
        chartOption = new Function('return ' + data.genChart)()
      }

      // Enhance chart style to match Apple aesthetic deeply
      const appleStyle = {
        backgroundColor: 'transparent',
        textStyle: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        tooltip: {
          ...chartOption.tooltip,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderColor: 'rgba(0,0,0,0.05)',
          textStyle: { color: '#1a1a1e', fontWeight: 500 },
          borderRadius: 12,
          padding: [12, 16],
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(20px)',
          extraCssText: 'backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);',
        },
        grid: {
          ...chartOption.grid,
          top: 80,
          bottom: 50,
          left: 60,
          right: 40,
          containLabel: true,
          borderColor: 'transparent',
          show: false, // remove outer grid borders
        },
        // Auto-smooth line charts and round bar charts
        series: (chartOption.series || []).map((s: any) => {
          const newSeries = { ...s }
          if (newSeries.type === 'line') {
            newSeries.smooth = true // Apple loves smooth curves
            newSeries.symbolSize = 6
            newSeries.itemStyle = { ...newSeries.itemStyle, borderWidth: 2 }
          }
          if (newSeries.type === 'bar') {
            newSeries.itemStyle = { ...newSeries.itemStyle, borderRadius: [4, 4, 0, 0] } // Rounded top corners for bars
          }
          return newSeries
        }),
        xAxis: chartOption.xAxis
          ? (Array.isArray(chartOption.xAxis) ? chartOption.xAxis : [chartOption.xAxis]).map(
              (x: any) => ({
                ...x,
                axisLine: { show: false }, // Hide solid axis line
                axisTick: { show: false }, // Hide ticks
                splitLine: { show: false },
                axisLabel: { color: '#8e8e93', margin: 16 }, // Apple gray
              })
            )
          : undefined,
        yAxis: chartOption.yAxis
          ? (Array.isArray(chartOption.yAxis) ? chartOption.yAxis : [chartOption.yAxis]).map(
              (y: any) => ({
                ...y,
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: {
                  show: true,
                  lineStyle: { color: 'rgba(0,0,0,0.04)', type: 'dashed' }, // Very faint split lines
                },
                axisLabel: { color: '#8e8e93' },
              })
            )
          : undefined,
      }

      chartOption = { ...chartOption, ...appleStyle }
    }
  } catch (error) {
    console.error('Failed to parse chart options:', error)
  }

  return (
    <div className="grid min-h-[500px] gap-8 pb-10 md:min-h-[600px] lg:grid-cols-12">
      {/* Chart Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`chart-${data.id}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-8"
        >
          <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] border-black/5 bg-white/70 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/50">
            <CardHeader className="border-b border-black/5 bg-white/40 px-8 py-6 dark:border-white/5 dark:bg-black/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-3xl font-bold">
                    <TrendingUp className="h-8 w-8 text-[#0071e3]" />
                    {data.name || '智能分析视图'}
                  </CardTitle>
                  <p className="text-muted-foreground mt-2 text-base">
                    图表类型: <span className="text-foreground font-medium">{data.chartType}</span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-8">
              {data.status === 'failed' ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10">
                  <Trash2 className="mb-4 h-12 w-12 text-red-400 opacity-80" />
                  <p className="text-lg font-medium text-red-600 dark:text-red-400">分析失败</p>
                  <p className="text-muted-foreground mt-2 max-w-sm text-center">
                    AI 在处理这批数据时遇到了困难，请重试或检查你的数据文件和目标描述是否清晰。
                  </p>
                </div>
              ) : data.genChart ? (
                <div className="w-full flex-1 mix-blend-multiply dark:mix-blend-normal">
                  <ReactECharts
                    option={chartOption}
                    style={{ height: '100%', minHeight: '400px', width: '100%' }}
                    opts={{ renderer: 'svg' }} // Use SVG for crisper Apple-like rendering
                  />
                </div>
              ) : (
                <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Cpu className="h-5 w-5 animate-pulse" />
                    正在生成图表中...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insight Card */}
        {data.genResult && (
          <motion.div
            key={`insight-${data.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex lg:col-span-4"
          >
            <Card className="flex w-full flex-col overflow-hidden rounded-[2rem] border-[#0071e3]/10 bg-gradient-to-br from-[#0071e3]/5 to-indigo-500/5 shadow-xl backdrop-blur-xl dark:border-indigo-500/20 dark:from-indigo-950/30 dark:to-blue-900/10">
              <CardHeader className="px-8 pt-8 pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-[#0071e3] dark:text-indigo-400">
                  <Sparkles className="h-6 w-6" />
                  AI 深度洞察
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col overflow-hidden px-8 pt-0 pb-8">
                <div className="flex-1 overflow-y-auto rounded-[1.5rem] bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-md dark:bg-black/40 dark:ring-white/10">
                  <MarkdownViewer content={data.genResult} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
