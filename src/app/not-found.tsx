import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <div className="space-y-8 px-4 text-center">
        {/* 404 大号数字 */}
        <div className="relative">
          <h1 className="text-primary/20 text-[120px] leading-none font-bold md:text-[180px]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl">🔍</div>
          </div>
        </div>

        {/* 标题和描述 */}
        <div className="space-y-4">
          <h2 className="text-foreground text-2xl font-semibold md:text-3xl">页面未找到</h2>
          <p className="text-muted-foreground mx-auto max-w-md text-lg">
            抱歉，您访问的页面不存在或已被移动。
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              返回首页
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
