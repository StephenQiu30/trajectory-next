'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bell, Heart, Info, MessageSquare, Star, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export interface NotificationCardProps {
  notification: NotificationAPI.NotificationVO
  onMarkRead: (notification: NotificationAPI.NotificationVO) => void
  onDelete: (id: number, e: React.MouseEvent) => void
  onView?: (notification: NotificationAPI.NotificationVO) => void
}

export function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
  onView,
}: NotificationCardProps) {
  // Determine icon and color based on type
  const { icon, colorClass, gradientClass } = React.useMemo(() => {
    const type = notification.type || 'default'
    switch (type) {
      case 'system':
        return {
          icon: <Info className="h-4 w-4 text-white" />,
          colorClass: 'text-blue-500',
          gradientClass: 'from-blue-500 to-blue-600',
        }
      case 'reply':
      case 'comment':
        return {
          icon: <MessageSquare className="h-4 w-4 text-white" />,
          colorClass: 'text-green-500',
          gradientClass: 'from-green-500 to-green-600',
        }
      case 'like':
      case 'thumb':
        return {
          icon: <Heart className="h-4 w-4 fill-white text-white" />,
          colorClass: 'text-pink-500',
          gradientClass: 'from-pink-500 to-rose-600',
        }
      case 'star':
      case 'favourite':
        return {
          icon: <Star className="h-4 w-4 fill-white text-white" />,
          colorClass: 'text-amber-500',
          gradientClass: 'from-amber-400 to-orange-500',
        }
      default:
        return {
          icon: <Bell className="h-4 w-4 text-white" />,
          colorClass: 'text-purple-500',
          gradientClass: 'from-violet-500 to-purple-600',
        }
    }
  }, [notification.type])

  // Clean up content
  const cleanContent = React.useMemo(() => {
    const raw = notification.content || ''
    return raw
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
      .replace(/[#*`>~_]/g, '')
      .trim()
  }, [notification.content])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, height: 0, marginBottom: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="group relative"
    >
      <Card
        role="button"
        tabIndex={0}
        onClick={() => {
          onMarkRead(notification)
          onView?.(notification)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onMarkRead(notification)
            onView?.(notification)
          }
        }}
        className={cn(
          'ring-offset-background focus-visible:ring-ring relative flex cursor-pointer gap-3 p-3 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'glass rounded-[18px] border',
          // Apple Glassmorphism Style & Read/Unread distinction
          notification.isRead === 0
            ? 'border-primary/20 bg-background/5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:border-primary/30 dark:bg-primary/5 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]'
            : 'border-transparent opacity-80 grayscale-[0.2] transition-opacity hover:opacity-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]'
        )}
      >
        {/* Unread Indicator - Blue Dot */}
        {notification.isRead === 0 && (
          <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.5)] ring-2 ring-white dark:ring-zinc-900" />
        )}

        {/* Icon Container - Squircle */}
        <div className="shrink-0 pt-0.5">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br shadow-sm',
              gradientClass,
              notification.isRead !== 0 && 'opacity-80'
            )}
          >
            {icon}
          </div>
        </div>

        {/* Content Container */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center justify-between pr-4">
            <h4
              className={cn(
                'truncate text-[15px] leading-tight tracking-tight',
                notification.isRead === 0
                  ? 'text-foreground font-semibold'
                  : 'text-foreground/70 font-medium'
              )}
            >
              {notification.title || '新通知'}
            </h4>
            <span className="text-muted-foreground/50 shrink-0 text-[11px] font-medium tabular-nums">
              {dayjs(notification.createTime).fromNow(true).replace(' ', '')}前
            </span>
          </div>

          <p
            className={cn(
              'line-clamp-2 text-[13px] leading-normal text-pretty',
              notification.isRead === 0 ? 'text-foreground/90' : 'text-muted-foreground/80'
            )}
          >
            {cleanContent}
          </p>
        </div>

        {/* Hover Actions */}
        <div className="absolute right-2 bottom-2 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground/40 h-7 w-7 rounded-full hover:bg-red-500/10 hover:text-red-500"
            onClick={e => {
              e.stopPropagation()
              if (notification.id) onDelete(notification.id, e)
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
