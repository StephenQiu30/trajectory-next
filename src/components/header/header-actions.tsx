import * as React from 'react'
import Link from 'next/link'
import { Bell, Github, Search, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { AuthModal } from '@/components/auth/auth-modal'
import { UserDropdown } from '@/components/auth/user-dropdown'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { CommandMenu } from '@/components/search/command-menu'
import { getNotificationUnreadCount } from '@/api/notification/notificationController'

interface HeaderActionsProps {
  onAuthModalOpenChange: (open: boolean) => void
  authModalOpen: boolean
}

export function HeaderActions({ onAuthModalOpenChange, authModalOpen }: HeaderActionsProps) {
  const { user } = useAppSelector((state: RootState) => state.user)
  const [open, setOpen] = React.useState(false)
  const [unreadCount, setUnreadCount] = React.useState(0)

  const fetchUnreadCount = React.useCallback(async () => {
    if (!user) return
    try {
      const res = await getNotificationUnreadCount()
      if (res.code === 0) {
        setUnreadCount(Number(res.data) || 0)
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }, [user])

  React.useEffect(() => {
    fetchUnreadCount()

    const handleUpdate = () => {
      fetchUnreadCount()
    }

    window.addEventListener('notification-updated', handleUpdate)
    return () => window.removeEventListener('notification-updated', handleUpdate)
  }, [fetchUnreadCount])

  return (
    <>
      <div className="flex items-center gap-1.5 md:gap-2">
        <div className="hidden items-center gap-1 sm:flex">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-full transition-colors hover:bg-transparent"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">搜索</span>
          </Button>
          <Link
            href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB || 'https://github.com/StephenQiu30'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-full transition-colors hover:bg-transparent"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-full transition-colors hover:bg-transparent sm:hidden"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
        </Button>

        {user ? (
          <div className="flex items-center gap-1">
            <Link href="/user/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground relative h-9 w-9 rounded-full transition-colors hover:bg-transparent"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="ring-background absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-red-500 shadow-sm ring-1" />
                )}
                <span className="sr-only">通知</span>
              </Button>
            </Link>
            <div className="ml-0.5 flex h-9 items-center">
              <UserDropdown />
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAuthModalOpenChange(true)}
            className="text-foreground hover:text-foreground/80 h-9 rounded-full px-4 text-[13px] font-medium transition-all hover:bg-transparent"
          >
            <UserCircle className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">登录</span>
          </Button>
        )}
      </div>
      <AuthModal open={authModalOpen} onOpenChange={onAuthModalOpenChange} />
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  )
}
