import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Apple Style Pulse Orb */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-[#0066FF] opacity-10"></div>
          <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-tr from-[#0066FF]/40 to-purple-500/40 blur-md"></div>
          <div className="h-12 w-12 rounded-full border border-white/40 dark:border-white/10 bg-white/50 dark:bg-white/10 backdrop-blur-md shadow-sm"></div>
        </div>

        <div className="space-y-2 text-center">
          <h3 className="text-[15px] font-medium text-gray-900 dark:text-white tracking-wide">
            加载中
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            请稍候，我们正在为您准备数据...
          </p>
        </div>
      </div>
    </div>
  )
}
