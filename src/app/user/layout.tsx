import type { Metadata } from 'next'
import { SITE_NAME } from '@/constants/app'

export const metadata: Metadata = {
  title: `用户中心 - ${SITE_NAME}`,
  description: '管理您的个人资料和设置。',
}

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
