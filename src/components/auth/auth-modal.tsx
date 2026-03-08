'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLoginUser } from '@/store/modules'
import {
  getGitHubAuthorizeUrl,
  sendEmailLoginCode,
  userLoginByEmail,
} from '@/api/user/userController'
import { User as UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MethodSelector } from './method-selector'
import { EmailLogin } from './email-login'
import { WeChatLogin } from './wechat-login'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ViewType = 'choice' | 'email' | 'wechat'

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.user)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [view, setView] = React.useState<ViewType>('choice')
  const [emailForm, setEmailForm] = React.useState({
    email: '',
    code: '',
  })
  const [countdown, setCountdown] = React.useState(0)

  // Reset view when modal opens
  React.useEffect(() => {
    if (open) {
      setView('choice')
      setError('')
      setSuccess('')
    }
  }, [open])

  // Countdown timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  const handleSendCode = async () => {
    if (!emailForm.email) {
      setError('请输入邮箱地址')
      return
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = (await sendEmailLoginCode({
        email: emailForm.email,
      })) as unknown as UserAPI.BaseResponseInteger
      if (res.code === 0) {
        setSuccess('验证码已发送')
        setCountdown(60)
      } else {
        setError(res.message || '发送失败')
      }
    } catch (err: any) {
      setError(err.message || '发送失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!emailForm.email || !emailForm.code) {
      setError('请输入邮箱和验证码')
      setLoading(false)
      return
    }

    try {
      const res = (await userLoginByEmail(emailForm)) as unknown as UserAPI.BaseResponseLoginUserVO
      if (res.code === 0 && res.data) {
        // Save token if exists
        if (res.data.token && typeof window !== 'undefined') {
          localStorage.setItem('token', res.data.token)
        }
        dispatch(setLoginUser(res.data))
        onOpenChange(false)
        setSuccess('登录成功')
      } else {
        setError(res.message || '登录失败')
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    try {
      const res = (await getGitHubAuthorizeUrl()) as unknown as UserAPI.BaseResponseString
      if (res.code === 0 && res.data) {
        window.location.href = res.data
      } else {
        setError(res.message || '获取 GitHub 授权链接失败')
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试')
    }
  }

  const handleWeChatLoginSuccess = (loginUser: UserAPI.LoginUserVO) => {
    // Save token if exists
    if (loginUser.token && typeof window !== 'undefined') {
      localStorage.setItem('token', loginUser.token)
    }
    dispatch(setLoginUser(loginUser))
    onOpenChange(false)
  }

  const getTitle = () => {
    switch (view) {
      case 'email':
        return '邮箱登录'
      case 'wechat':
        return '微信扫码登录'
      default:
        return '欢迎回来'
    }
  }

  const getDescription = () => {
    switch (view) {
      case 'email':
        return '输入您的邮箱地址以继续'
      case 'wechat':
        return '使用微信扫描二维码登录'
      default:
        return '选择一种方式登录您的账户'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-none bg-white p-0 shadow-2xl sm:max-w-[420px] dark:bg-[#1c1c1e]">
        <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#0071e3] via-[#42a5f5] to-[#0077ed]" />

        <DialogHeader className="space-y-6 px-8 pt-10">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#0071e3]/20 to-[#0077ed]/0 blur-sm" />
              <Avatar className="relative h-20 w-20 shadow-lg ring-4 ring-white dark:ring-[#1c1c1e]">
                <AvatarImage src={user?.userAvatar} alt={user?.userName || '用户头像'} />
                <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <UserIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2 text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {getTitle()}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base">
                {getDescription()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 pt-6 pb-10">
          <div className="min-h-[120px]">
            {view === 'choice' && (
              <MethodSelector
                onGitHubLogin={handleGitHubLogin}
                onEmailClick={() => setView('email')}
                onWeChatClick={() => setView('wechat')}
              />
            )}
            {view === 'email' && (
              <EmailLogin
                emailForm={emailForm}
                setEmailForm={setEmailForm}
                onSendCode={handleSendCode}
                onSubmit={handleEmailLogin}
                onBack={() => setView('choice')}
                loading={loading}
                countdown={countdown}
                error={error}
                success={success}
              />
            )}
            {view === 'wechat' && (
              <WeChatLogin
                onBack={() => setView('choice')}
                onLoginSuccess={handleWeChatLoginSuccess}
                error={error}
                setError={setError}
              />
            )}
          </div>
        </div>

        <div className="bg-gray-50/80 px-8 py-5 text-center backdrop-blur-sm dark:bg-gray-800/50">
          <p className="text-muted-foreground text-center text-xs leading-relaxed">
            登录即代表您同意我们的
            <a
              href="#"
              className="hover:text-primary mx-1 font-medium text-gray-700 underline underline-offset-2 transition-colors hover:text-[#0071e3] dark:text-gray-300 dark:hover:text-[#0071e3]"
            >
              服务条款
            </a>
            和
            <a
              href="#"
              className="hover:text-primary mx-1 font-medium text-gray-700 underline underline-offset-2 transition-colors hover:text-[#0071e3] dark:text-gray-300 dark:hover:text-[#0071e3]"
            >
              隐私政策
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
