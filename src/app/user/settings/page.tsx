'use client'

import * as React from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { UserRoleEnum } from '@/enums/UserRoleEnum'
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
import { editUser, getLoginUser, uploadAvatar } from '@/api/user/userController'
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
      const res = await uploadAvatar({}, file)
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
      className="container mx-auto max-w-6xl space-y-10 py-32 md:py-40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="bg-primary/5 animate-blob absolute top-[30%] right-[10%] h-[35rem] w-[35rem] rounded-full blur-[120px]" />
        <div className="bg-primary/5 animate-blob absolute bottom-[30%] left-[10%] h-[30rem] w-[30rem] rounded-full blur-[120px] [animation-delay:2s]" />
      </div>

      <motion.div
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-6">
          <Link href="/user/profile">
            <Button
              variant="outline"
              size="icon"
              className="glass apple-shadow h-14 w-14 rounded-full border-none transition-all hover:scale-110 active:scale-90"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">个人设置</h1>
            <p className="text-foreground/40 text-sm font-bold tracking-widest uppercase">
              Account & Preferences
            </p>
          </div>
        </div>
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge className="bg-primary apple-shadow animate-pulse rounded-full px-6 py-2 text-sm font-bold text-white">
                {changes.size} 项未保存更改
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left - Avatar & Preview */}
        <motion.div className="lg:col-span-4" variants={itemVariants}>
          <div className="glass apple-shadow sticky top-24 overflow-hidden rounded-[2.5rem] border-none p-8">
            <div className="flex flex-col items-center text-center">
              <div className="group relative mb-8">
                <div className="bg-primary/20 group-hover:bg-primary/30 absolute inset-0 rounded-full blur-2xl transition-colors" />
                <div className="relative">
                  <UserAvatar
                    user={{ ...user, ...formData }}
                    size="xl"
                    className="border-background/50 h-40 w-40 border-8 shadow-2xl"
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
                    className="bg-primary apple-shadow absolute -right-2 -bottom-2 h-12 w-12 rounded-full text-white transition-all hover:scale-110 active:scale-95"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Camera className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{formData.userName || user.userName}</h3>
                  <p className="text-foreground/40 text-[10px] font-bold tracking-[0.2em] uppercase">
                    {user.userRole === UserRoleEnum.ADMIN ? 'Administrator' : 'Explorer'}
                  </p>
                </div>
                <div className="bg-secondary/20 text-foreground/60 rounded-3xl border border-white/10 p-6 text-sm font-medium italic">
                  &quot;{formData.userProfile || '这个人很懒，什么都没写...'}&quot;
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - Form Details */}
        <motion.div className="lg:col-span-8" variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="profile" className="w-full space-y-8">
              <TabsList className="bg-secondary/30 h-16 w-full justify-start rounded-3xl border border-white/10 p-1.5 backdrop-blur-xl">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:apple-shadow flex-1 rounded-2xl px-8 py-3 text-sm font-bold transition-all"
                >
                  档案信息
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:apple-shadow flex-1 rounded-2xl px-8 py-3 text-sm font-bold transition-all"
                >
                  联系方式
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-0 space-y-8 outline-none">
                <div className="glass apple-shadow space-y-10 rounded-[2.5rem] border-none p-10">
                  <div className="space-y-8">
                    <FormField
                      label="用户昵称"
                      value={formData.userName}
                      onChange={handleInputChange('userName')}
                      placeholder="你的灵感代号"
                      required
                      isActive={activeField === 'userName'}
                      onFocus={() => setActiveField('userName')}
                      onBlur={() => setActiveField(null)}
                      hasChanged={changes.has('userName')}
                    />

                    <div className="space-y-3">
                      <Label className="text-foreground/40 ml-1 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                        个人简介
                        {changes.has('userProfile') && (
                          <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
                        )}
                      </Label>
                      <Textarea
                        value={formData.userProfile}
                        onChange={handleInputChange('userProfile')}
                        placeholder="关于你的故事..."
                        className="bg-secondary/30 focus:bg-secondary/50 focus:ring-primary/20 apple-shadow min-h-[160px] resize-none rounded-3xl border-none p-6 text-base transition-all focus:ring-2"
                        onFocus={() => setActiveField('userProfile')}
                        onBlur={() => setActiveField(null)}
                      />
                      <div className="text-foreground/20 text-right font-mono text-xs font-bold">
                        {formData.userProfile.length} / 200
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="mt-0 space-y-8 outline-none">
                <div className="glass apple-shadow space-y-10 rounded-[2.5rem] border-none p-10">
                  <div className="space-y-8">
                    <FormField
                      label="电子邮箱"
                      type="email"
                      value={formData.userEmail}
                      onChange={handleInputChange('userEmail')}
                      placeholder="discovery@example.com"
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
                      placeholder="未关联安全手机"
                      isActive={activeField === 'userPhone'}
                      onFocus={() => setActiveField('userPhone')}
                      onBlur={() => setActiveField(null)}
                      hasChanged={changes.has('userPhone')}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Response Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`apple-shadow rounded-3xl border-none p-6 text-sm font-bold ${
                    message.type === 'success'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {message.type === 'success' ? (
                      <div className="rounded-full bg-green-500/20 p-2">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="bg-destructive/20 rounded-full p-2">
                        <Shield className="h-5 w-5" />
                      </div>
                    )}
                    <span className="flex-1">{message.text}</span>
                    <button
                      type="button"
                      onClick={() => setMessage(null)}
                      className="transition-transform hover:scale-110"
                    >
                      <X className="h-5 w-5 opacity-40" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-6 pt-4">
              <Link href="/user/profile">
                <Button
                  variant="ghost"
                  className="text-foreground/40 hover:text-foreground h-14 rounded-2xl px-10 font-bold transition-all"
                  type="button"
                >
                  取消
                </Button>
              </Link>
              <Button
                type="submit"
                size="lg"
                disabled={loading || !hasChanges}
                className="bg-primary apple-shadow h-14 rounded-2xl px-12 font-bold text-white transition-all active:scale-95 disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    正在同步
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
    <div className="space-y-4">
      <Label className="text-foreground/40 ml-1 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
        {label}
        {hasChanged && <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        className="bg-secondary/30 focus:bg-secondary/50 focus:ring-primary/20 apple-shadow h-14 rounded-2xl border-none px-6 text-base transition-all focus:ring-2"
      />
    </div>
  )
}
