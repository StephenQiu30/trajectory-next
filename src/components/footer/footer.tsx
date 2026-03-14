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
    <footer className={cn('bg-background text-foreground/60 py-16', className)}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <p className="text-sm font-medium">
              &copy; {new Date().getFullYear()} {author}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-[13px]">
              <Link href="#" className="hover:text-foreground transition-colors">
                隐私政策
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                服务条款
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                联系我们
              </Link>
              {icpNumber && (
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {icpNumber}
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href={email} className="hover:text-foreground transition-colors">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
