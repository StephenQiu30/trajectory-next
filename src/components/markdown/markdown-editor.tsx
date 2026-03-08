'use client'

import * as React from 'react'
import {
  Bold,
  Code,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List as ListIcon,
  ListOrdered,
  Maximize2,
  Minimize2,
  Type,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MarkdownRender } from './markdown-render'

import { addFile } from '@/api/file/fileController'
import { FileUploadBizEnum } from '@/enums/FileUploadBizEnum'
import { toast } from 'sonner'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  viewMode?: 'edit' | 'preview' | 'split'
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
  viewMode = 'split',
}: MarkdownEditorProps) {
  const [view, setView] = React.useState<'edit' | 'preview' | 'split'>(viewMode)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Sync internal view state if prop changes
  React.useEffect(() => {
    if (viewMode) setView(viewMode)
  }, [viewMode])

  // 处理工具栏操作
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)

    const newValue = text.substring(0, start) + before + selected + after + text.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const handleImageUpload = async (file: File) => {
    const toastId = toast.loading('正在上传图片...')
    try {
      const res = await addFile(
        {
          fileUploadRequest: { biz: FileUploadBizEnum.POST_IMAGE_COVER },
        },
        file
      )
      if (res.code === 0 && res.data?.url) {
        insertText(`![图片](${res.data.url})`)
        toast.success('图片上传成功', { id: toastId })
      } else {
        toast.error('图片上传失败: ' + res.message, { id: toastId })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('图片上传出错', { id: toastId })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
    // Clean input
    e.target.value = ''
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = e.clipboardData.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        e.preventDefault()
        handleImageUpload(file)
      }
    }
  }

  const toolbarItems = [
    { icon: Bold, label: '粗体', action: () => insertText('**', '**') },
    { icon: Italic, label: '斜体', action: () => insertText('*', '*') },
    { icon: Type, label: '标题', action: () => insertText('### ') },
    { icon: ListIcon, label: '无序列表', action: () => insertText('- ') },
    { icon: ListOrdered, label: '有序列表', action: () => insertText('1. ') },
    { icon: Code, label: '代码块', action: () => insertText('```\n', '\n```') },
    { icon: LinkIcon, label: '链接', action: () => insertText('[', '](url)') },
    {
      icon: ImageIcon,
      label: '图片',
      action: () => fileInputRef.current?.click(),
    },
  ]

  return (
    <div
      className={cn(
        'border-border/40 bg-card/30 flex flex-1 flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300',
        isFullscreen &&
          'bg-background fixed inset-0 z-50 h-screen w-screen rounded-none border-none',
        className
      )}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* 浮动/固定工具栏 */}
      <div
        className={cn(
          'border-border/40 flex items-center justify-between border-b px-4 py-3 backdrop-blur-md',
          isFullscreen ? 'bg-background/80 sticky top-0 z-10' : 'bg-background/80 sticky top-0 z-10'
        )}
      >
        <div className="flex items-center gap-1">
          {toolbarItems.map((item, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted hover:text-foreground h-8 w-8 rounded-lg"
              onClick={item.action}
              title={item.label}
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 pl-4">
          {/* View Switcher */}
          <div className="bg-muted/30 hidden items-center rounded-lg p-1 lg:flex">
            <Button
              variant={view === 'edit' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 px-3 text-xs"
              onClick={() => setView('edit')}
            >
              编辑
            </Button>
            <Button
              variant={view === 'split' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 px-3 text-xs"
              onClick={() => setView('split')}
            >
              分栏
            </Button>
            <Button
              variant={view === 'preview' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 px-3 text-xs"
              onClick={() => setView('preview')}
            >
              预览
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-8 w-8 rounded-lg"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* 编辑与预览区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 移动端/小屏 Tab 切换 */}
        <div className="flex h-full w-full flex-col lg:hidden">
          {/* 使用简单的条件渲染代替 Tabs 组件以减少层级 */}
          {view === 'edit' ? (
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              onPaste={handlePaste}
              placeholder={placeholder || '开始写作...'}
              className="h-full w-full resize-none rounded-none border-none bg-transparent p-6 font-mono text-base leading-relaxed focus-visible:ring-0"
            />
          ) : (
            <div className="flex-1 overflow-auto p-6">
              <MarkdownRender content={value} />
            </div>
          )}
          {/* 底部简单的切换器 */}
          <div className="border-border/40 flex border-t">
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors',
                view === 'edit' ? 'text-primary bg-muted/20' : 'text-muted-foreground'
              )}
              onClick={() => setView('edit')}
            >
              编辑
            </button>
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors',
                view === 'preview' ? 'text-primary bg-muted/20' : 'text-muted-foreground'
              )}
              onClick={() => setView('preview')}
            >
              预览
            </button>
          </div>
        </div>

        {/* PC/宽屏分栏 */}
        <div className="divide-border/40 hidden h-full w-full divide-x lg:flex">
          <div
            className={cn(
              'transition-all duration-300',
              view === 'edit' && 'w-full',
              view === 'preview' && 'w-0 overflow-hidden opacity-0',
              view === 'split' && 'w-1/2'
            )}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              onPaste={handlePaste}
              placeholder={placeholder || '开始写作...'} // Localized
              className="placeholder:text-muted-foreground/40 h-full w-full resize-none border-none bg-transparent p-6 font-mono text-[15px] leading-relaxed focus:outline-none lg:p-10"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>
          <div
            className={cn(
              'bg-muted/5 overflow-auto transition-all duration-300',
              view === 'preview' && 'w-full',
              view === 'edit' && 'w-0 overflow-hidden opacity-0',
              view === 'split' && 'w-1/2'
            )}
          >
            <div className="mx-auto w-full p-6 lg:p-10">
              <MarkdownRender content={value || '*暂无内容预览*'} /> {/* Localized */}
            </div>
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      {!isFullscreen && (
        <div className="border-border/40 bg-muted/10 text-muted-foreground flex items-center justify-between border-t px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase">
          <div className="flex items-center gap-4">
            <span>字数: {value.length}</span>
          </div>
          <span>支持 Markdown · 图片拖拽/粘贴</span>
        </div>
      )}
    </div>
  )
}
