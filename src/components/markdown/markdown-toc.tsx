'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Heading {
  id: string
  text: string
  level: number
}

interface TOCProps {
  content: string
}

export function MarkdownToc({ content }: TOCProps) {
  const [headings, setHeadings] = React.useState<Heading[]>([])
  const [activeId, setActiveId] = React.useState<string>('')
  const [isOpen, setIsOpen] = React.useState(true)

  // 提取目录
  React.useEffect(() => {
    const headingRegex = /^(#{1,4})\s+(.+)$/gm
    const extractedHeadings: Heading[] = []
    const slugCounts: Record<string, number> = {}
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]

      let id = text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]+/g, '')

      if (slugCounts[id]) {
        slugCounts[id]++
        id = `${id}-${slugCounts[id] - 1}`
      } else {
        slugCounts[id] = 1
      }

      extractedHeadings.push({ id, text, level })
    }
    setHeadings(extractedHeadings)
  }, [content])

  // 监听滚动，更新激活项
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -60% 0px' }
    )

    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="sticky top-24 max-h-[calc(100vh-120px)] w-full pr-2 transition-all duration-300">
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="text-muted-foreground flex items-center gap-2 text-[11px] font-[600] tracking-widest uppercase">
          <span>目录</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted h-6 w-6 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <EyeOff className="h-3.5 w-3.5 opacity-70" />
          ) : (
            <Eye className="h-3.5 w-3.5 opacity-70" />
          )}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-border/40 relative border-l pl-0">
              {headings.map(heading => {
                const isActive = activeId === heading.id
                return (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={e => {
                      e.preventDefault()
                      document.getElementById(heading.id)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      })
                    }}
                    className={cn(
                      'relative -ml-[1px] block border-l-2 py-1.5 pr-3 transition-colors',
                      isActive
                        ? 'border-primary text-foreground font-medium'
                        : 'text-muted-foreground hover:border-border hover:text-foreground border-transparent',
                      heading.level === 1 && 'mt-1 pl-4 font-semibold tracking-tight',
                      heading.level === 2 && 'pl-4',
                      heading.level === 3 && 'pl-7 text-[13px]',
                      heading.level === 4 && 'pl-10 text-[12px]'
                    )}
                  >
                    <span className="line-clamp-2 leading-snug">{heading.text}</span>
                  </a>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 text-center">
          <p className="text-muted-foreground/50 text-xs italic">已折叠</p>
        </motion.div>
      )}
    </div>
  )
}
