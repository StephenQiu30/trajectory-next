'use client'

import * as React from 'react'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserRoleEnum } from '@/enums/UserRoleEnum'
import { UserAvatar } from '@/components/header/user-avatar'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/auth/auth-modal'
import { LoginPromptCard } from '@/components/auth/login-prompt-card'
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
      className="container mx-auto max-w-7xl px-6 py-10 md:py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Premium Background Ambiance */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/5 animate-blob absolute -top-[10%] -left-[10%] h-[40rem] w-[40rem] rounded-full blur-[120px] dark:bg-primary/10" />
        <div className="bg-primary/5 animate-blob absolute -right-[5%] bottom-[10%] h-[35rem] w-[35rem] rounded-full blur-[120px] [animation-delay:2s] dark:bg-primary/10" />
      </div>

      <motion.div
        className="mb-8 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end"
        variants={itemVariants}
      >
        <div className="space-y-2 text-center sm:text-left">
          <div className="bg-primary/5 text-primary/60 mx-auto flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-primary/10 sm:mx-0">
            <UserIcon className="h-4 w-4" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">个人中心</h1>
        </div>
        <Link href="/user/settings">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 apple-shadow h-12 gap-2 rounded-xl px-8 font-bold text-white transition-all active:scale-[0.98]"
          >
            <Edit className="h-4 w-4" />
            编辑资料
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-12">
        {/* Left Sidebar: Profile Card */}
        <motion.div
          className="self-start lg:sticky lg:top-24 lg:col-span-4"
          variants={itemVariants}
        >
          <div className="glass apple-shadow relative flex w-full flex-col overflow-hidden rounded-[2.5rem] border-none bg-white/40 p-8 dark:bg-white/[0.02]">
             {/* Technical Accent Line */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="group relative">
                <div className="bg-primary/10 group-hover:bg-primary/20 absolute inset-0 rounded-full blur-3xl transition-all duration-700" />
                <UserAvatar
                  user={user}
                  size="xl"
                  className="border-white/40 relative h-36 w-36 border-[6px] shadow-xl transition-all duration-700 group-hover:scale-105 dark:border-white/5"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {user?.userName || '未设置用户名'}
                </h2>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 backdrop-blur-md">
                  <RoleIcon className="text-primary h-3.5 w-3.5" />
                  <span className="text-primary text-[9px] font-bold tracking-widest uppercase">
                    {user.userRole === UserRoleEnum.ADMIN ? '超级管理员' : '探索者'}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/20 px-3 py-1.5 backdrop-blur-md">
                  <Award className="text-muted-foreground/50 h-3.5 w-3.5" />
                  <span className="text-muted-foreground/50 text-[9px] font-bold tracking-widest uppercase">
                    初级先锋
                  </span>
                </div>
              </div>

              <div className="glass bg-white/40 border-border/10 w-full rounded-2xl p-6 text-center dark:bg-black/20">
                 <p className="text-foreground/70 text-sm leading-[1.8] font-medium italic">
                    "{user?.userProfile || '致力于在不确定的轨迹中发现数据背后的灵感与真理。'}"
                 </p>
              </div>

              <div className="w-full pt-1">
                <div className="glass group relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-primary/5 p-6 transition-all hover:bg-primary/10">
                  <Zap className="text-primary/40 mb-2 h-6 w-6" />
                  <div className="relative z-10 text-3xl font-bold tracking-tight">{accountAge}</div>
                  <div className="text-muted-foreground/30 relative z-10 mt-0.5 text-[9px] font-bold tracking-widest uppercase">
                    加入天数
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content: Details */}
        <motion.div
          className="lg:col-span-8 space-y-8"
          variants={itemVariants}
        >
          <div className="glass apple-shadow space-y-10 rounded-[2.5rem] border-none bg-white/40 p-8 lg:p-10 dark:bg-white/[0.02]">
            {/* Account Details Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/5 h-10 w-10 items-center justify-center rounded-xl ring-1 ring-primary/10 hidden sm:flex">
                  <Shield className="text-primary/40 h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">账户档案</h3>
              </div>

              <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                <InfoItem label="用户名" value={user?.userName} />
                <InfoItem label="电子邮箱" value={user?.userEmail} />
                <InfoItem label="手机号码" value={user?.userPhone || '未绑定'} />
                <InfoItem label="系统序列" value={`#${user?.id || '0000'}`} />
                {user?.githubLogin && (
                  <div className="sm:col-span-2">
                    <InfoItem
                        label="关联服务"
                        value={
                        <a
                            href={user.githubUrl}
                            className="text-primary flex items-center gap-3 font-bold tracking-tight transition-opacity hover:opacity-70"
                        >
                            <Github className="h-5 w-5" />
                            GITHUB / {user.githubLogin}
                        </a>
                        }
                    />
                  </div>
                )}
              </div>
            </section>

            <div className="h-px w-full bg-gradient-to-r from-border/50 via-transparent to-transparent" />

            {/* Timeline & Security Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="bg-primary/5 h-10 w-10 items-center justify-center rounded-xl ring-1 ring-primary/10 hidden sm:flex">
                  <Calendar className="text-primary/40 h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">时间与安全</h3>
              </div>

              <div className="grid gap-12 sm:grid-cols-2">
                <InfoItem
                  label="注册时间"
                  value={
                    user?.createTime
                      ? new Date(user.createTime).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '数据同步中...'
                  }
                />
              </div>

              <div className="glass group relative flex flex-col gap-6 overflow-hidden rounded-[1.5rem] bg-black/5 p-5 dark:bg-white/5 sm:flex-row sm:items-center">
                <div className="bg-white apple-shadow relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 dark:bg-black/40">
                  <Shield className="h-6 w-6 text-green-500/80" />
                </div>
                <div className="relative space-y-1">
                  <h4 className="text-base font-bold tracking-tight">账户安全保护已开启</h4>
                  <p className="text-muted-foreground/60 text-xs font-medium leading-relaxed">
                    您的账户正受到实时安全保护，目前的信誉评分非常优秀。
                  </p>
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
