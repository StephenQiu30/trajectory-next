'use client'

import { Button } from '@/components/ui/button'
import { Github, Mail } from 'lucide-react'

interface MethodSelectorProps {
  onGitHubLogin: () => void
  onEmailClick: () => void
}

export function MethodSelector({
  onGitHubLogin,
  onEmailClick,
}: MethodSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      <Button
        variant="outline"
        onClick={onGitHubLogin}
        className="group relative flex w-32 h-32 flex-col items-center justify-center gap-3 rounded-[2rem] border-border/50 bg-secondary/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/[0.03] apple-shadow"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background apple-shadow transition-transform duration-300 group-hover:scale-110">
          <Github className="h-6 w-6 text-foreground/80 group-hover:text-primary transition-colors" />
        </div>
        <div className="flex flex-col gap-0.5 text-center">
          <span className="text-sm font-bold tracking-tight">GitHub</span>
          <span className="text-[11px] font-medium text-foreground/40 text-center">快捷授权</span>
        </div>
      </Button>

      <Button
        variant="outline"
        onClick={onEmailClick}
        className="group relative flex w-32 h-32 flex-col items-center justify-center gap-3 rounded-[2rem] border-border/50 bg-secondary/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/[0.03] apple-shadow"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background apple-shadow transition-transform duration-300 group-hover:scale-110">
          <Mail className="h-6 w-6 text-foreground/80 group-hover:text-primary transition-colors" />
        </div>
        <div className="flex flex-col gap-0.5 text-center">
          <span className="text-sm font-bold tracking-tight">邮箱验证</span>
          <span className="text-[11px] font-medium text-foreground/40 text-center">点击登录</span>
        </div>
      </Button>
    </div>
  )
}
