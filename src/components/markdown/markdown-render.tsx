'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeKatex from 'rehype-katex'
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MarkdownRendererProps {
  content: string
  className?: string
}

const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [copied, setCopied] = React.useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export function MarkdownRender({ content, className }: MarkdownRendererProps) {
  return (
    <article
      className={cn(
        'prose prose-neutral dark:prose-invert max-w-none tracking-tight break-words',
        'prose-p:leading-relaxed prose-li:leading-relaxed',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-foreground mt-5 mb-3 text-lg font-bold tracking-tight first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-foreground mt-5 mb-2 text-base font-bold tracking-tight first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-foreground mt-4 mb-2 text-[14px] font-bold tracking-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-foreground mt-3 mb-2 text-[13px] font-bold tracking-tight">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="text-foreground/70 dark:text-foreground/80 text-[13px] leading-[1.6] [&:not(:first-child)]:mt-2.5">
              {children}
            </p>
          ),

          a: ({ href, children }) => {
            const isRef = href && href.startsWith('#')
            return (
              <a
                href={href}
                target={isRef ? undefined : '_blank'}
                rel={isRef ? undefined : 'noopener noreferrer'}
                className="font-bold text-primary underline decoration-primary/20 underline-offset-[2px] transition-all hover:decoration-primary"
              >
                {children}
              </a>
            )
          },

          img: ({ src, alt }) => (
            <span className="my-5 block first:mt-0 last:mb-0">
              <img
                src={src || ''}
                alt={alt || ''}
                className="bg-secondary/10 max-h-[400px] w-full rounded-xl object-contain shadow-sm ring-1 ring-white/5"
                loading="lazy"
              />
              {alt && (
                <span className="text-muted-foreground/40 mt-2 block text-center text-[9px] font-bold tracking-widest uppercase italic">
                  {alt}
                </span>
              )}
            </span>
          ),

          pre: ({ children }) => <>{children}</>,
          code: ({
            inline,
            className,
            children,
            ...props
          }: {
            inline?: boolean
            className?: string
            children?: React.ReactNode
          }) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : 'text'

            if (!inline && match) {
              return <CodeBlock language={language} value={String(children).replace(/\n$/, '')} />
            }
            return (
              <code
                className={cn(
                  'rounded-md border border-primary/5 bg-primary/5 px-1 py-0.5 font-mono text-[10px] font-bold text-primary dark:bg-primary/10 dark:text-primary-foreground/80 [&::after]:!content-none [&::before]:!content-none',
                  className
                )}
                {...props}
              >
                {children}
              </code>
            )
          },

          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-primary/20 bg-primary/[0.005] py-2 pr-3 pl-4 rounded-r-lg italic shadow-sm">
              <div className="text-muted-foreground/70 text-[12px] leading-relaxed">
                {children}
              </div>
            </blockquote>
          ),

          ul: ({ children }) => (
            <ul className="marker:text-primary/30 my-4 ml-4 list-disc space-y-1.5">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="marker:text-primary/30 my-4 ml-4 list-decimal space-y-1.5 font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/70 dark:text-foreground/80 pl-1 text-[13px] leading-[1.6]">
              {children}
            </li>
          ),

          strong: ({ children }) => (
            <strong className="text-foreground font-bold tracking-tight">{children}</strong>
          ),

          table: ({ children }) => (
            <div className="glass apple-shadow my-6 w-full overflow-hidden rounded-lg border border-white/5 bg-white/30 dark:bg-white/[0.01]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px] border-collapse text-left text-[11px]">
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary/10 text-muted-foreground/50 border-b border-border/20 text-[8px] font-bold uppercase tracking-widest">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody className="divide-y divide-border/10">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-primary/[0.005] transition-colors">{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-2">{children}</th>
          ),
          td: ({ children }) => (
            <td className="text-foreground/70 px-4 py-2 align-top">{children}</td>
          ),

          hr: () => <hr className="my-6 border-t border-border/20 dark:border-white/5" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
