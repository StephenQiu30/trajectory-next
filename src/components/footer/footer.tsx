import Link from 'next/link'
import { Github, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
  author?: string
  githubUrl?: string
  email?: string
  icpNumber?: string
}

export function Footer({
  className,
  author = process.env.NEXT_PUBLIC_AUTHOR_NAME || '轨迹 Trajectory',
  githubUrl = process.env.NEXT_PUBLIC_AUTHOR_GITHUB || 'https://github.com/StephenQiu30',
  email = `mailto:${process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'Popcornqhd@gmail.com'}`,
  icpNumber = process.env.NEXT_PUBLIC_ICP_NUMBER || '',
}: FooterProps) {
  return (
    <footer className={cn('bg-background text-foreground/60 border-t border-[color:var(--footer-border)]', className)}>
      <div className="shell-container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{author}</p>
            <div className="mt-4 flex items-center gap-3">
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href={email} className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()}. All rights reserved.
            </p>
            {icpNumber && (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {icpNumber}
              </a>
            )}
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
            <div>
              <p className="text-sm font-semibold text-foreground">产品</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/ai" className="text-muted-foreground hover:text-foreground transition-colors">
                    智能分析
                  </Link>
                </li>
                <li>
                  <Link href="/user/settings" className="text-muted-foreground hover:text-foreground transition-colors">
                    设置
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">法律</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    隐私政策
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    服务条款
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
