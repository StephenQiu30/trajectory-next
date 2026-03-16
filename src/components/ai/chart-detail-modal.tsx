'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ChartViewer } from './chart-viewer'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ChartDetailModalProps {
  data: AiAPI.ChartVO | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChartDetailModal({ data, open, onOpenChange }: ChartDetailModalProps) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass apple-shadow flex h-[90vh] w-[95vw] max-w-7xl flex-col overflow-hidden rounded-[2.5rem] border-none p-0 outline-none transition-all duration-700">
        <DialogTitle className="sr-only">分析报告详情</DialogTitle>
        <DialogDescription className="sr-only">
          展示所选 AI 分析报告的详细图表和洞察结果。
        </DialogDescription>
        <div className="relative flex-1 overflow-y-auto bg-white/10 dark:bg-black/20">
          <ChartViewer data={data} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
