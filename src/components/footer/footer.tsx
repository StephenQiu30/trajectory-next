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
  author = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'StephenQiu30',
  githubUrl = process.env.NEXT_PUBLIC_AUTHOR_GITHUB || 'https://github.com/StephenQiu30',
  email = `mailto:${process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'Popcornqhd@gmail.com'}`,
  icpNumber = process.env.NEXT_PUBLIC_ICP_NUMBER || '',
}: FooterProps) {
  return (
    <footer className={cn('bg-muted/30 border-t', className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Copyright & Author */}
          <div className="flex flex-col items-center gap-1 md:items-start">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} {author}. All rights reserved.
            </p>
            {icpNumber && (
              <p className="text-muted-foreground text-xs">
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  备案号：{icpNumber}
                </a>
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
            <Link
              href={email}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
