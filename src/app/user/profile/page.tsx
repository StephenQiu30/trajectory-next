'use client'

import * as React from 'react'
import { useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserAvatar } from '@/components/header/user-avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
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
      className="container mx-auto max-w-6xl space-y-8 py-8 md:py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 顶部标题栏 */}
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div className="space-y-1">
          <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            个人档案
          </h1>
          <p className="text-muted-foreground text-lg">
            你好，{user?.userName || '探索者'}。这是你的个人中心。
          </p>
        </div>
        <Link href="/user/settings">
          <Button
            size="lg"
            className="gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Edit className="h-4 w-4" />
            编辑资料
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* 左侧 - 用户名片 (4cols) */}
        <motion.div className="lg:col-span-4 lg:sticky lg:top-24 self-start" variants={itemVariants}>
          <Card className="border-border/50 bg-background shadow-sm rounded-3xl overflow-hidden flex flex-col relative w-full">
            {/* Minimal Apple-Style Themed Header */}
            <div className="h-32 relative bg-primary/5 dark:bg-primary/10 border-b border-border/50 transition-colors">
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-[2px] px-3 py-1 rounded-full border border-border shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Active</span>
              </div>
            </div>

            <CardContent className="relative px-8 pt-0 pb-8">
              {/* 头像 */}
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

              {/* 基本信息 */}
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {user?.userName || '未设置用户名'}
                  </h2>
                  <p className="text-muted-foreground flex items-center justify-center gap-1 text-sm font-medium">
                    <AtSign className="h-3 w-3" />
                    {user?.userEmail?.split('@')[0] || 'unknown'}
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="bg-secondary/50 cursor-help font-medium"
                        >
                          <RoleIcon className="mr-1.5 h-3.5 w-3.5 opacity-70" />
                          {roleInfo.label}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>当前用户角色: {roleInfo.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="border-primary/20 text-primary cursor-help font-medium"
                        >
                          <Award className="mr-1.5 h-3.5 w-3.5" />
                          Lv.1 成员
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>当前等级: Lv.1 (初级探索者)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="px-2 pt-2">
                  <p className="text-muted-foreground/80 leading-relaxed text-sm">
                    "{user?.userProfile || '这个人很懒，什么都没留下...'}"
                  </p>
                </div>

                {/* 核心数据 - Apple Themed Metrics */}
                <div className="grid grid-cols-1 gap-3 mt-8">
                  <div className="bg-primary/5 dark:bg-primary/10 rounded-[20px] p-4 flex flex-col items-center justify-center border border-primary/10 hover:bg-primary/10 hover:scale-[1.02] transition-all cursor-default">
                    <StatItem label="已加入天数" value={accountAge} icon={<Zap className="w-4 h-4 text-emerald-500 mb-1" />} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧 - 动态与详情模块 (8cols) */}
        <motion.div className="space-y-6 lg:col-span-8" variants={itemVariants}>
          <Tabs defaultValue="about" className="w-full space-y-6">
            <TabsList className="bg-primary/5 dark:bg-primary/10 h-14 w-full justify-start rounded-2xl p-1.5 border border-primary/10 backdrop-blur-md">
              <TabsTrigger value="about" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border-primary/20 rounded-xl px-6 py-2.5 text-sm font-medium transition-all border border-transparent">
                <UserIcon className="mr-2 h-4 w-4" />
                关于我
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6 outline-none">
              <Card className="border-border/50 bg-background shadow-sm rounded-3xl">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserIcon className="text-primary h-5 w-5" />
                    基本信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                    <InfoItem
                      label="用户昵称"
                      value={user?.userName || '未设置'}
                      description="在社区展示的名字"
                    />
                    <InfoItem
                      label="电子邮箱"
                      value={user?.userEmail || '未绑定'}
                      description="用于接收重要通知"
                    />
                    <InfoItem
                      label="手机号码"
                      value={user?.userPhone || '未绑定'}
                      description="账号安全验证"
                    />
                    <InfoItem
                      label="用户 ID"
                      value={user?.id ? `#${user.id}` : '未知'}
                      description="系统唯一识别码"
                    />
                    {user?.githubLogin && (
                      <InfoItem
                        label="GitHub"
                        value={
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            {user?.githubUrl ? (
                              <a
                                href={user.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {user.githubLogin}
                              </a>
                            ) : (
                              user?.githubLogin
                            )}
                          </div>
                        }
                        description="已绑定的 GitHub 账号"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 账户历程 */}
              <Card className="border-border/50 bg-background shadow-sm rounded-3xl">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="text-primary h-5 w-5" />
                    账户历程
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                    <InfoItem
                      label="注册日期"
                      value={
                        user?.createTime
                          ? new Date(user.createTime).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          : '未知'
                      }
                    />
                    <InfoItem label="常用活跃地" value="已开启地理屏蔽" />
                  </div>
                  <div className="bg-secondary/20 mt-8 flex items-center gap-4 rounded-xl p-4">
                    <div className="bg-background flex h-10 w-10 items-center justify-center rounded-xl shadow-sm">
                      <Shield className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">账户状态良好</h4>
                      <p className="text-muted-foreground text-xs">通过所有安全验证</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 账户安全 & 隐私 Actions */}
              <div className="flex gap-4">
                <Link href="/user/settings" className="flex-1">
                  <Button
                    variant="outline"
                    className="border-black/5 dark:border-white/5 bg-background shadow-sm hover:bg-secondary/50 h-14 w-full justify-between rounded-xl px-6 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Edit className="h-4 w-4 text-primary" />
                      <span className="font-medium">完善个人资料</span>
                    </div>
                    <div className="text-muted-foreground text-xl">→</div>
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
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
      <div className="text-foreground text-xl md:text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-muted-foreground text-[10px] md:text-xs font-medium uppercase tracking-wider">{label}</div>
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
