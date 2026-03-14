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

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ViewType = 'choice' | 'email'

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

  const getTitle = () => {
    switch (view) {
      case 'email':
        return '邮箱登录'
      default:
        return '欢迎回来'
    }
  }

  const getDescription = () => {
    switch (view) {
      case 'email':
        return '输入您的邮箱地址以继续'
      default:
        return '选择一种方式登录您的账户'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass apple-shadow overflow-hidden rounded-[2.5rem] border-none p-0 sm:max-w-[440px]">
        <DialogHeader className="px-10 pt-12">
          <div className="flex flex-col items-center justify-center gap-6">
            <Avatar className="apple-shadow h-20 w-20">
              <AvatarImage src={user?.userAvatar} alt={user?.userName || '用户头像'} />
              <AvatarFallback className="bg-secondary">
                <UserIcon className="text-foreground/40 h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5 text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight">{getTitle()}</DialogTitle>
              <DialogDescription className="text-foreground/60 font-medium">
                {getDescription()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-10 pt-8 pb-12">
          <div className="min-h-[120px]">
            {view === 'choice' && (
              <MethodSelector
                onGitHubLogin={handleGitHubLogin}
                onEmailClick={() => setView('email')}
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
          </div>
        </div>

        <div className="bg-secondary/50 border-border/50 border-t px-10 py-6 text-center backdrop-blur-md">
          <p className="text-foreground/40 text-xs font-medium">
            登录即代表您同意我们的
            <a
              href="#"
              className="hover:text-primary text-foreground mx-1 font-bold transition-colors"
            >
              服务条款
            </a>
            和
            <a
              href="#"
              className="hover:text-primary text-foreground mx-1 font-bold transition-colors"
            >
              隐私政策
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
