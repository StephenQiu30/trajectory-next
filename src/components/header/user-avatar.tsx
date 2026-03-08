import { cn } from '@/lib/utils'
import { UserCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
  user?: UserAPI.UserVO | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  alt?: string
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-32 w-32',
}

const iconSizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
  xl: 'h-20 w-20',
}

export function UserAvatar({ user, size = 'md', className, alt }: UserAvatarProps) {
  const sizeClass = sizeMap[size]
  const iconSizeClass = iconSizeMap[size]
  const avatarUrl = user?.userAvatar
  const userName = user?.userName || alt || '用户头像'

  return (
    <Avatar className={cn(sizeClass, className)}>
      <AvatarImage src={avatarUrl} alt={userName} className="object-cover" />
      <AvatarFallback className={cn(size === 'lg' || size === 'xl' ? 'bg-primary/10' : 'bg-muted')}>
        <UserCircle
          className={cn(
            size === 'lg' || size === 'xl' ? 'text-primary' : 'text-muted-foreground',
            iconSizeClass
          )}
        />
      </AvatarFallback>
    </Avatar>
  )
}
