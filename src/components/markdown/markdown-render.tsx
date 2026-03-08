'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRender({ content, className }: MarkdownRendererProps) {
  return (
    <article
      className={cn(
        'prose prose-lg md:prose-xl prose-neutral dark:prose-invert max-w-none tracking-tight break-words',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeKatex]}
        components={{
          // 自定义标题样式
          h1: ({ id, children }) => (
            <h1
              id={id}
              className="text-foreground mt-12 mb-6 scroll-m-24 text-2xl leading-tight font-bold tracking-tight first:mt-0 md:text-3xl"
            >
              {children}
            </h1>
          ),
          h2: ({ id, children }) => (
            <h2
              id={id}
              className="text-foreground mt-12 mb-6 scroll-m-24 text-xl font-semibold tracking-tight first:mt-0 md:text-2xl"
            >
              {children}
            </h2>
          ),
          h3: ({ id, children }) => (
            <h3
              id={id}
              className="text-foreground mt-8 mb-4 scroll-m-24 text-lg font-medium tracking-tight md:text-xl"
            >
              {children}
            </h3>
          ),
          h4: ({ id, children }) => (
            <h4
              id={id}
              className="text-foreground mt-6 mb-4 scroll-m-24 text-base font-medium tracking-tight md:text-[17px]"
            >
              {children}
            </h4>
          ),

          // 段落
          p: ({ children }) => (
            <p className="!text-foreground/90 text-[15px] leading-relaxed sm:text-base [&:not(:first-child)]:mt-6">
              {children}
            </p>
          ),

          // 链接
          a: ({ href, children }) => {
            const isRef = href && href.startsWith('#')
            return (
              <a
                href={href}
                target={isRef ? undefined : '_blank'}
                rel={isRef ? undefined : 'noopener noreferrer'}
                className="font-medium text-blue-600 underline decoration-blue-500/30 underline-offset-[5px] transition-all hover:decoration-blue-500 dark:text-blue-400"
              >
                {children}
              </a>
            )
          },

          // 图片
          img: ({ src, alt }) => (
            <span className="my-8 block first:mt-0 last:mb-0">
              <img
                src={src || ''}
                alt={alt || ''}
                className="bg-muted max-h-[600px] w-full rounded-lg object-contain"
                loading="lazy"
              />
              {alt && (
                <span className="text-muted-foreground mt-3 block text-center text-sm">{alt}</span>
              )}
            </span>
          ),

          // 代码块
          pre: ({ children }) => <>{children}</>,
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : 'text'
            const [copied, setCopied] = React.useState(false)

            const onCopy = () => {
              navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }

            if (!inline && match) {
              const { ref, ...rest } = props
              return (
                <div className="group relative my-6 overflow-hidden rounded-xl border border-zinc-800 bg-[#0a0a0a] first:mt-0 last:mb-0">
                  <div className="flex h-11 items-center justify-between border-b border-zinc-800 bg-[#0a0a0a] px-4">
                    <span className="font-mono text-[13px] font-medium tracking-tight text-zinc-400">
                      {language}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                      onClick={onCopy}
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800 relative overflow-x-auto [&_code]:!bg-transparent [&_code::after]:!content-none [&_code::before]:!content-none [&_pre]:!bg-transparent">
                    <SyntaxHighlighter
                      {...rest}
                      style={oneDark as any}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: '1.25rem 1rem',
                        background: 'transparent',
                        fontSize: '13.5px',
                        lineHeight: '1.5',
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )
            }
            return (
              <code
                className="rounded-md border border-zinc-200 bg-zinc-100 px-[0.35rem] py-[0.15rem] font-mono text-[13px] font-medium text-zinc-900 dark:border-transparent dark:bg-zinc-800/60 dark:text-zinc-200 [&::after]:!content-none [&::before]:!content-none"
                {...props}
              >
                {children}
              </code>
            )
          },

          // 引用块
          blockquote: ({ children }) => (
            <blockquote className="!border-border !text-muted-foreground my-6 border-l-[3px] pl-5 text-[15px] italic">
              {children}
            </blockquote>
          ),

          // 列表
          ul: ({ children }) => (
            <ul className="marker:text-muted-foreground my-6 ml-6 list-disc space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="marker:text-muted-foreground my-6 ml-6 list-decimal space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => {
            return (
              <li className="!text-foreground/90 pl-1 text-[15px] leading-relaxed sm:text-base">
                {children}
              </li>
            )
          },

          strong: ({ children }) => (
            <strong className="!text-foreground font-semibold">{children}</strong>
          ),

          // 表格
          table: ({ children }) => (
            <div className="my-8 w-full overflow-y-auto">
              <table className="w-full min-w-[600px] border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-border bg-muted/50 border-b">{children}</thead>
          ),
          tbody: ({ children }) => <tbody className="divide-border divide-y">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-muted/50 transition-colors">{children}</tr>,
          th: ({ children }) => (
            <th className="!text-foreground px-4 py-3 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="!text-foreground/90 px-4 py-3 align-top">{children}</td>
          ),

          // 分隔线
          hr: () => <hr className="border-border/40 my-12 border-t dark:border-white/20" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
