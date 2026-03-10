'use client'

import * as React from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store'
import { UserAvatar } from '@/components/header/user-avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Camera, CheckCircle2, Loader2, Shield, X } from 'lucide-react'
import Link from 'next/link'
import { AuthModal } from '@/components/auth/auth-modal'
import { LoginPromptCard } from '@/components/auth/login-prompt-card'
import { editUser, getLoginUser } from '@/api/user/userController'
import { addFile } from '@/api/file/fileController'
import { setLoginUser } from '@/store/modules/user/userSlice'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export default function SettingsPage() {
  const { user } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
  const [activeField, setActiveField] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  const [formData, setFormData] = React.useState({
    userAvatar: '',
    userName: '',
    userProfile: '',
    userEmail: '',
    userPhone: '',
  })

  const [changes, setChanges] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (user) {
      setFormData({
        userAvatar: user.userAvatar || '',
        userName: user.userName || '',
        userProfile: user.userProfile || '',
        userEmail: user.userEmail || '',
        userPhone: user.userPhone || '',
      })
    }
  }, [user])

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setFormData(prev => ({ ...prev, [field]: newValue }))

      // 追踪变更
      setChanges(prev => {
        const newChanges = new Set(prev)
        if (newValue !== (user as any)[field]) {
          newChanges.add(field)
        } else {
          newChanges.delete(field)
        }
        return newChanges
      })
    }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 基础校验
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '请上传图片文件' })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: '图片大小建议在 2MB 以内' })
      return
    }

    setUploading(true)
    try {
      const res = await addFile({ fileUploadRequest: { biz: 'user_avatar' } }, file)
      if (res.code === 0 && res.data?.url) {
        setFormData(prev => ({ ...prev, userAvatar: res.data!.url! }))
        setChanges(prev => new Set(prev).add('userAvatar'))
        setMessage({ type: 'success', text: '头像上传成功，保存后生效' })
      } else {
        setMessage({ type: 'error', text: res.message || '头像上传失败' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，上传失败' })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      const res = (await editUser({
        ...formData,
      } as UserAPI.UserEditRequest)) as unknown as UserAPI.BaseResponseBoolean

      if (res.code === 0 && res.data) {
        setMessage({ type: 'success', text: '个人资料保存成功！✨' })

        // 刷新用户信息
        const userRes = await getLoginUser()
        if (userRes.code === 0 && userRes.data) {
          dispatch(setLoginUser(userRes.data))
          setChanges(new Set())
        }
      } else {
        setMessage({ type: 'error', text: res.message || '更新失败，请重试' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '请求出错' })
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  if (!user) {
    return (
      <>
        <LoginPromptCard onLoginClick={() => setAuthModalOpen(true)} />
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </>
    )
  }

  const hasChanges = changes.size > 0

  return (
    <motion.div
      className="container mx-auto max-w-5xl space-y-8 py-8 md:py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 顶部导航 */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <Link href="/user/profile">
            <Button
              variant="outline"
              size="icon"
              className="border-border/40 bg-background/50 h-10 w-10 rounded-full backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-foreground text-3xl font-bold tracking-tight">个人设置</h1>
            <p className="text-muted-foreground mt-1 text-base">管理您的账号信息与偏好</p>
          </div>
        </div>
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-sm font-medium shadow-sm">
                {changes.size} 项未保存更改
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* 左侧 - 预览与头像 (4cols) */}
        <motion.div className="lg:col-span-4" variants={itemVariants}>
          <div className="border-border/40 bg-card/50 sticky top-24 overflow-hidden rounded-[2rem] border shadow-sm backdrop-blur-xl">
            <div className="bg-secondary/30 h-32"></div>

            <div className="relative -mt-16 px-6 pb-8 text-center">
              <div className="group relative mx-auto mb-6 inline-block">
                <div className="relative">
                  <UserAvatar
                    user={{ ...user, ...formData }}
                    size="xl"
                    className="border-background h-32 w-32 border-[6px] shadow-xl"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                  <Button
                    size="icon"
                    className="bg-primary text-primary-foreground absolute -right-2 -bottom-2 h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-110"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold">{formData.userName || user.userName}</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  {user.userRole === 'admin' ? '管理员' : '普通用户'}
                </p>
                <div className="bg-secondary/30 mt-4 rounded-2xl p-4">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    "{formData.userProfile || '还没写个人简介...'}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 右侧 - 编辑区域 (8cols) */}
        <motion.div className="lg:col-span-8" variants={itemVariants}>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-secondary/20 h-auto w-full justify-start rounded-full p-1">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-background rounded-full px-6 py-2.5 data-[state=active]:shadow-sm"
                >
                  档案信息
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="data-[state=active]:bg-background rounded-full px-6 py-2.5 data-[state=active]:shadow-sm"
                >
                  联系方式
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-border/40 bg-card/50 rounded-[2rem] border p-8 shadow-sm backdrop-blur-xl"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">基本资料</h3>
                    <p className="text-muted-foreground text-sm">这些信息将公开显示</p>
                  </div>

                  <div className="space-y-8">
                    <FormField
                      label="用户昵称"
                      value={formData.userName}
                      onChange={handleInputChange('userName')}
                      placeholder="请输入昵称"
                      required
                      isActive={activeField === 'userName'}
                      onFocus={() => setActiveField('userName')}
                      onBlur={() => setActiveField(null)}
                      hasChanged={changes.has('userName')}
                    />

                    <div className="space-y-3">
                      <Label className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                        个人简介
                        {changes.has('userProfile') && (
                          <span className="text-primary ml-2 text-xs">•</span>
                        )}
                      </Label>
                      <Textarea
                        value={formData.userProfile}
                        onChange={handleInputChange('userProfile')}
                        placeholder="向世界介绍你自己..."
                        className="border-border/40 bg-background/50 focus:border-primary/50 min-h-[140px] resize-none rounded-2xl p-4 text-base focus:ring-0"
                        onFocus={() => setActiveField('userProfile')}
                        onBlur={() => setActiveField(null)}
                      />
                      <div className="text-muted-foreground text-right text-xs">
                        {formData.userProfile.length}/200
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-border/40 bg-card/50 rounded-[2rem] border p-8 shadow-sm backdrop-blur-xl"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">隐私与安全</h3>
                    <p className="text-muted-foreground text-sm">管理您的联系方式</p>
                  </div>

                  <div className="space-y-8">
                    <FormField
                      label="电子邮箱"
                      type="email"
                      value={formData.userEmail}
                      onChange={handleInputChange('userEmail')}
                      placeholder="example@mail.com"
                      isActive={activeField === 'userEmail'}
                      onFocus={() => setActiveField('userEmail')}
                      onBlur={() => setActiveField(null)}
                      hasChanged={changes.has('userEmail')}
                    />
                    <FormField
                      label="手机号码"
                      type="tel"
                      value={formData.userPhone}
                      onChange={handleInputChange('userPhone')}
                      placeholder="未绑定"
                      isActive={activeField === 'userPhone'}
                      onFocus={() => setActiveField('userPhone')}
                      onBlur={() => setActiveField(null)}
                      hasChanged={changes.has('userPhone')}
                    />
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* 消息回显 */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`mt-6 rounded-2xl border p-4 text-sm font-medium ${
                    message.type === 'success'
                      ? 'border-green-500/20 bg-green-500/10 text-green-600'
                      : 'border-red-500/20 bg-red-500/10 text-red-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {message.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Shield className="h-5 w-5" />
                    )}
                    <span>{message.text}</span>
                    <button type="button" className="ml-auto" onClick={() => setMessage(null)}>
                      <X className="h-4 w-4 opacity-50" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 操作条 */}
            <div className="mt-8 flex items-center justify-end gap-4">
              <Link href="/user/profile">
                <Button variant="ghost" className="rounded-full px-6" type="button">
                  取消
                </Button>
              </Link>
              <Button
                type="submit"
                size="lg"
                disabled={loading || !hasChanges}
                className="rounded-full px-8 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中
                  </>
                ) : (
                  '保存更改'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 提取 FormField 组件以提高复用性和整洁度
function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  isActive,
  onFocus,
  onBlur,
  hasChanged,
}: {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  required?: boolean
  isActive?: boolean
  onFocus?: () => void
  onBlur?: () => void
  hasChanged?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
        {label}
        {hasChanged && <span className="bg-primary h-1.5 w-1.5 rounded-full" />}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        className="border-border/40 bg-background/50 focus:border-primary/50 focus:bg-background h-12 rounded-xl px-4 transition-all focus:ring-0"
      />
    </div>
  )
}
