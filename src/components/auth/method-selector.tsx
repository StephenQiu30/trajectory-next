'use client'

import { Button } from '@/components/ui/button'
import { Github, Mail, ScanLine } from 'lucide-react'

interface MethodSelectorProps {
  onGitHubLogin: () => void
  onEmailClick: () => void
  onWeChatClick: () => void
}

export function MethodSelector({
  onGitHubLogin,
  onEmailClick,
  onWeChatClick,
}: MethodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button
        variant="outline"
        onClick={onGitHubLogin}
        className="group relative flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-gray-100 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#0071e3]/30 hover:bg-[#0071e3]/5 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-[#0071e3]/50 dark:hover:bg-[#0071e3]/10"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700">
          <Github className="h-5 w-5 text-gray-900 transition-colors group-hover:text-[#0071e3] dark:text-white" />
        </div>
        <div className="flex flex-col gap-0.5 text-center">
          <span className="text-xs font-semibold text-gray-900 dark:text-white">GitHub</span>
          <span className="text-[10px] text-gray-500">快捷登录</span>
        </div>
      </Button>

      <Button
        variant="outline"
        onClick={onEmailClick}
        className="group relative flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-gray-100 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#0071e3]/30 hover:bg-[#0071e3]/5 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-[#0071e3]/50 dark:hover:bg-[#0071e3]/10"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700">
          <Mail className="h-5 w-5 text-gray-900 transition-colors group-hover:text-[#0071e3] dark:text-white" />
        </div>
        <div className="flex flex-col gap-0.5 text-center">
          <span className="text-xs font-semibold text-gray-900 dark:text-white">邮箱</span>
          <span className="text-[10px] text-gray-500">验证码登录</span>
        </div>
      </Button>

      <Button
        variant="outline"
        onClick={onWeChatClick}
        className="group relative flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-gray-100 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#07c160]/30 hover:bg-[#07c160]/5 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-[#07c160]/50 dark:hover:bg-[#07c160]/10"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700">
          <ScanLine className="h-5 w-5 text-gray-900 transition-colors group-hover:text-[#07c160] dark:text-white" />
        </div>
        <div className="flex flex-col gap-0.5 text-center">
          <span className="text-xs font-semibold text-gray-900 dark:text-white">微信</span>
          <span className="text-[10px] text-gray-500">扫码登录</span>
        </div>
      </Button>
    </div>
  )
}
