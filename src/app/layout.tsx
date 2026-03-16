import './globals.css'
import { Footer } from '@/components/footer/footer'
import React from 'react'
import { RootProviders } from '@/components/providers/root-providers'
import { SiteHeader } from '@/components/header/site-header'
import { FullScreenLoader } from '@/components/common/full-screen-loader'
import { SITE_DESCRIPTION, SITE_TITLE } from '@/constants/app'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <RootProviders>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 pt-[var(--header-height)]">
              <React.Suspense fallback={<FullScreenLoader />}>{children}</React.Suspense>
            </main>
            <Footer />
          </div>
        </RootProviders>
      </body>
    </html>
  )
}
