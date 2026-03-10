import type { Metadata } from 'next'
import { SITE_NAME } from '@/constants/app'
import React from 'react'

export const metadata: Metadata = {
    title: `智能分析 - ${SITE_NAME}`,
    description: '只需输入一段文字和上传数据文件，AI 即可根据您的业务需求，自动生成精准、专业的图表和深度洞察。',
}

export default function AiAnalyticsLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <>{children}</>
}
