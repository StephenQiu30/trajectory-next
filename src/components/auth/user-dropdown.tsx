'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, User, UserCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearLoginUser } from '@/store/modules'
import { userLogout } from '@/api/user/userController'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UserDropdown() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
  const [open, setOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      await userLogout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      dispatch(clearLoginUser())
      setOpen(false)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-primary relative rounded-full">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.userAvatar} alt={user?.userName || '用户头像'} />
            <AvatarFallback>
              <UserCircle className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">用户菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.userAvatar} alt={user?.userName || '用户头像'} />
            <AvatarFallback>
              <UserCircle className="text-muted-foreground h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="block max-w-[140px] truncate font-medium">
              {user?.userName || '未知用户'}
            </span>
            <span className="text-muted-foreground text-xs">
              {user?.userRole === 'admin' ? '管理员' : '普通用户'}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Link href="/user/profile" onClick={() => setOpen(false)}>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            个人信息
          </DropdownMenuItem>
        </Link>
        <Link href="/user/settings" onClick={() => setOpen(false)}>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            账号设置
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
