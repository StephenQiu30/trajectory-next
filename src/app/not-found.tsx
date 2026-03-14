import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-12rem)] items-center justify-center overflow-hidden">
      {/* Dynamic Background Blob for 404 */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#0066FF]/20 to-purple-500/20 blur-[80px]" />

      <div className="relative flex flex-col items-center justify-center space-y-10 px-4 text-center">
        {/* 404 质感数字容器 */}
        <div className="relative flex items-center justify-center">
          <h1 className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-[140px] leading-none font-extrabold text-transparent drop-shadow-sm select-none md:text-[220px] dark:from-white dark:via-gray-300 dark:to-gray-600">
            404
          </h1>
          {/* Glass floating badge */}
          <div className="absolute -bottom-6 flex items-center justify-center rounded-2xl border border-white/40 bg-white/60 px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
            <span className="text-xl drop-shadow-md md:text-2xl">🔍</span>
          </div>
        </div>

        {/* 标题和描述 */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F] md:text-3xl dark:text-white">
            页面未找到
          </h2>
          <p className="mx-auto max-w-md text-base leading-relaxed text-[#8E8E93] dark:text-[#6E6E73]">
            抱歉，您访问的页面可能已被移动，或者该轨迹(Trajectory)不存在。
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-14 gap-2 rounded-2xl bg-[#0066FF] px-8 text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#0055D4] hover:shadow-xl hover:shadow-blue-500/30"
          >
            <Link href="/">
              <Home className="h-5 w-5" />
              <span className="text-[15px] font-semibold">返回首页</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
