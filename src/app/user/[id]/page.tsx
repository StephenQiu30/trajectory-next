'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UserAvatar } from '@/components/header/user-avatar'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Award,
  Calendar,
  FileWarning,
  Loader2,
  Shield,
  User as UserIcon,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { searchUserByPage } from '@/api/search/searchController'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = React.useState<UserAPI.UserVO | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!userId) return

    const fetchUser = async () => {
      setLoading(true)
      try {
        // Use ES search to find user by ID as requested
        const res = (await searchUserByPage({
          id: userId as any,
          current: 1,
          pageSize: 1,
        })) as unknown as SearchAPI.BaseResponsePage

        if (res.code === 0 && res.data?.records && (res.data.records as any).length > 0) {
          setUser((res.data.records as any)[0])
        } else {
          setError('用户不存在')
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
        setError('获取用户信息失败')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-secondary-foreground/50 h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
        <FileWarning className="text-muted-foreground/30 h-16 w-16" />
        <h2 className="text-foreground text-2xl font-semibold">{error || 'User not found'}</h2>
        <Link href="/">
          <Button variant="outline" className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back Home
          </Button>
        </Link>
      </div>
    )
  }

  // Calculate account age
  const accountAge = user.createTime
    ? Math.floor((Date.now() - new Date(user.createTime).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Role config (Read-Only)
  const roleConfig = {
    admin: {
      label: '管理员',
      color: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800',
      icon: Shield,
    },
    ban: {
      label: '已封禁',
      color: 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-800',
      icon: Shield,
    },
    user: {
      label: '普通用户',
      color: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800',
      icon: UserIcon,
    },
  }

  const roleInfo = roleConfig[user.userRole as keyof typeof roleConfig] || roleConfig.user
  const RoleIcon = roleInfo.icon

  return (
    <motion.div
      className="container mx-auto max-w-6xl space-y-8 py-8 md:py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div className="space-y-1">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </button>
          <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            用户主页
          </h1>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Side - User Card */}
        <motion.div className="lg:col-span-4" variants={itemVariants}>
          <div className="border-border/40 bg-card/50 overflow-hidden rounded-[2rem] border shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
            {/* Background */}
            <div className="h-32 bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-400/10"></div>

            <div className="relative px-8 pb-8">
              {/* Avatar */}
              <div className="-mt-16 mb-6 flex justify-center">
                <div className="relative">
                  <UserAvatar
                    user={user}
                    size="xl"
                    className="border-background h-32 w-32 border-[6px] shadow-xl"
                  />
                  <div className="border-background absolute right-2 bottom-2 h-5 w-5 rounded-full border-4 bg-green-500 shadow-sm" />
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {user.userName || '未设置用户名'}
                  </h2>
                </div>

                <div className="flex justify-center gap-2">
                  <Badge variant="secondary" className="bg-secondary/50 font-medium">
                    <RoleIcon className="mr-1.5 h-3.5 w-3.5 opacity-70" />
                    {roleInfo.label}
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 text-primary font-medium">
                    <Award className="mr-1.5 h-3.5 w-3.5" />
                    Lv.1 成员
                  </Badge>
                </div>

                <div className="bg-secondary/30 rounded-2xl p-6 text-sm">
                  <p className="text-muted-foreground leading-relaxed">
                    "{(user as any).userProfile || '这个人很懒，什么都没留下...'}"
                  </p>
                </div>

                {/* Stats */}
                <div className="border-border/40 mt-8 grid grid-cols-3 gap-4 border-t pt-8">
                  <StatItem label="天数" value={accountAge} icon={<Zap />} />
                  <StatItem label="动态" value={0} />
                  <StatItem label="获赞" value={0} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Details */}
        <motion.div className="space-y-6 lg:col-span-8" variants={itemVariants}>
          <div className="border-border/40 bg-card/50 rounded-[2rem] border shadow-sm backdrop-blur-xl">
            <div className="border-border/40 border-b px-8 py-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <UserIcon className="text-primary h-5 w-5" />
                基本信息
              </h3>
            </div>
            <div className="p-8">
              <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                <InfoItem
                  label="用户昵称"
                  value={user.userName || '未设置'}
                  description="在社区展示的名字"
                />
                <InfoItem
                  label="用户 ID"
                  value={user.id ? `#${user.id}` : '未知'}
                  description="系统唯一识别码"
                />
              </div>
            </div>
          </div>

          <div className="border-border/40 bg-card/50 rounded-[2rem] border shadow-sm backdrop-blur-xl">
            <div className="border-border/40 border-b px-8 py-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="text-primary h-5 w-5" />
                账户历程
              </h3>
            </div>
            <div className="p-8">
              <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                <InfoItem
                  label="注册日期"
                  value={
                    user.createTime
                      ? new Date(user.createTime).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '未知'
                  }
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function StatItem({
  label,
  value,
  icon,
}: {
  label: string
  value: number | string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="text-foreground text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-muted-foreground text-xs font-medium">{label}</div>
    </div>
  )
}

function InfoItem({
  label,
  value,
  description,
}: {
  label: string
  value: React.ReactNode
  description?: string
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground/60 text-xs font-medium tracking-wider uppercase">
        {label}
      </p>
      <div className="text-foreground text-base font-semibold">{value}</div>
      {description && <p className="text-muted-foreground text-xs">{description}</p>}
    </div>
  )
}
