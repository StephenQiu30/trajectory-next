'use client'

import * as React from 'react'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserRoleEnum } from '@/enums/UserRoleEnum'
import { UserAvatar } from '@/components/header/user-avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/auth/auth-modal'
import { LoginPromptCard } from '@/components/auth/login-prompt-card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AtSign, Award, Calendar, Edit, Github, Shield, User as UserIcon, Zap } from 'lucide-react'

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

export default function ProfilePage() {
  const { user } = useAppSelector((state: RootState) => state.user)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  // 选项卡状态与数据
  // Effect for initialization if needed
  React.useEffect(() => {
    if (!user) return
  }, [user])

  if (!user) {
    return (
      <>
        <LoginPromptCard
          onLoginClick={() => setAuthModalOpen(true)}
          title="需要登录"
          description="请先登录以查看个人资料"
        />
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </>
    )
  }

  // 计算账户年龄
  const accountAge = user?.createTime
    ? Math.floor((Date.now() - new Date(user.createTime).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // 用户角色配置
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
      className="container mx-auto max-w-6xl space-y-12 py-32 md:py-40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Ambient background decorative elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[20%] right-[10%] w-[25rem] h-[25rem] bg-primary/5 rounded-full blur-[100px] animate-blob [animation-delay:2s]" />
      </div>

      <motion.div className="flex flex-col sm:flex-row items-center justify-between gap-6" variants={itemVariants}>
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            个人中心
          </h1>
          <p className="text-foreground/40 text-lg font-bold uppercase tracking-widest">
            Discovery & Profile
          </p>
        </div>
        <Link href="/user/settings">
          <Button
            size="lg"
            className="rounded-2xl bg-primary hover:bg-primary/90 text-white gap-2 apple-shadow transition-all active:scale-95 h-14 px-8 font-bold"
          >
            <Edit className="h-5 w-5" />
            编辑资料
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Sidebar */}
        <motion.div
          className="self-start lg:sticky lg:top-24 lg:col-span-4"
          variants={itemVariants}
        >
          <div className="glass apple-shadow relative flex w-full flex-col overflow-hidden rounded-[2.5rem] p-8 border-none">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors animate-float" />
                <UserAvatar
                  user={user}
                  size="xl"
                  className="relative h-40 w-40 border-8 border-background/50 shadow-2xl transition-transform duration-700 group-hover:rotate-6 scale-110"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  {user?.userName || '未设置用户名'}
                </h2>
                <p className="text-foreground/40 flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-widest">
                  <AtSign className="h-4 w-4" />
                  {user?.userEmail?.split('@')[0] || 'unknown'}
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <Badge className="bg-primary/10 text-primary border-none font-bold px-4 py-1.5 rounded-full apple-shadow">
                  <RoleIcon className="mr-1.5 h-4 w-4" />
                  {user.userRole === UserRoleEnum.ADMIN ? 'Administrator' : 'Explorer'}
                </Badge>
                <Badge variant="outline" className="border-border/50 text-foreground/60 font-bold px-4 py-1.5 rounded-full bg-secondary/30">
                  <Award className="mr-1.5 h-4 w-4" />
                  Lv.1 探索者
                </Badge>
              </div>

              <div className="bg-secondary/20 rounded-3xl p-6 w-full italic font-medium text-foreground/60 leading-relaxed">
                "{user?.userProfile || '致力于发现数据背后的灵感与真理。'}"
              </div>

              <div className="w-full pt-4">
                <div className="bg-primary/5 border border-primary/10 flex flex-col items-center justify-center rounded-[2rem] p-6 apple-shadow transition-all hover:bg-primary/10">
                  <Zap className="mb-2 h-6 w-6 text-primary" />
                  <div className="text-3xl font-bold tracking-tighter">{accountAge}</div>
                  <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">已加入天数</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div className="space-y-8 lg:col-span-8" variants={itemVariants}>
          <div className="glass apple-shadow rounded-[2.5rem] p-10 space-y-10 border-none">
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 apple-shadow">
                   <UserIcon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">账户详情</h3>
              </div>
              <div className="grid gap-12 sm:grid-cols-2">
                <InfoItem label="用户昵称" value={user?.userName} />
                <InfoItem label="电子邮箱" value={user?.userEmail} />
                <InfoItem label="手机号码" value={user?.userPhone || '未绑定'} />
                <InfoItem label="系统 ID标记" value={`#${user?.id || '0000'}`} />
                {user?.githubLogin && (
                  <InfoItem
                    label="GitHub 关联"
                    value={
                      <a href={user.githubUrl} className="text-primary hover:underline font-bold flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        {user.githubLogin}
                      </a>
                    }
                  />
                )}
              </div>
            </section>

            <div className="h-px bg-border/40" />

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 apple-shadow">
                   <Calendar className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">时间轨迹</h3>
              </div>
              <div className="grid gap-12 sm:grid-cols-2">
                <InfoItem
                  label="注册日期"
                  value={user?.createTime ? new Date(user.createTime).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : '未知'}
                />
              </div>

              <div className="bg-secondary/30 flex items-center gap-6 rounded-[2rem] p-6 apple-shadow">
                <div className="bg-background/80 flex h-14 w-14 items-center justify-center rounded-2xl apple-shadow animate-shimmer">
                  <Shield className="h-7 w-7 text-green-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-0.5">账户安全盾</h4>
                  <p className="text-foreground/40 text-sm font-medium">您的账户状态非常健康，所有安全验证均已通过。</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 指标统计项
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
    <div className="flex flex-col items-center justify-center">
      {icon}
      <div className="text-foreground text-xl font-bold tracking-tight md:text-2xl">{value}</div>
      <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase md:text-xs">
        {label}
      </div>
    </div>
  )
}

// 详细信息项
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
