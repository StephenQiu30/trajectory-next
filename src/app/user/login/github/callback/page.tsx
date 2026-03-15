'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { setLoginUser } from '@/store/modules'
import { gitHubLoginCallback } from '@/api/user/userController'
import { GitHubAuthStatus } from '@/components/auth/github-auth-status'
import { toast } from 'sonner'

function GitHubCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = React.useState('正在连接 GitHub...')
  const [progress, setProgress] = React.useState(0)

  // 模拟进度条
  React.useEffect(() => {
    if (status === 'loading') {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90
          return prev + Math.random() * 20
        })
      }, 800)
      return () => clearInterval(timer)
    } else if (status === 'success') {
      setProgress(100)
    }
  }, [status])

  const handleLogin = React.useCallback(async () => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      setStatus('error')
      setMessage('未获取到授权码，请重试')
      return
    }

    try {
      setStatus('loading')
      setMessage('正在验证身份...')

      const res = (await gitHubLoginCallback({
        request: { code, state: state || '' },
      })) as unknown as UserAPI.BaseResponseLoginUserVO

      if (res.code === 0 && res.data) {
        // Save token if exists
        if (res.data.token && typeof window !== 'undefined') {
          localStorage.setItem('token', res.data.token)
        }
        dispatch(setLoginUser(res.data))
        setStatus('success')
        setMessage('验证成功，即将跳转')
        toast.success('登录成功')

        // 延迟跳转以展示成功动画
        setTimeout(() => router.replace('/'), 1200)
      } else {
        setStatus('error')
        setMessage(res.message || 'GitHub 登录失败')
        toast.error(res.message || '登录失败')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || '连接超时或网络异常')
      toast.error('登录异常')
    }
  }, [searchParams, dispatch, router])

  React.useEffect(() => {
    // 延迟一点执行，让用户看到初始动画
    const timer = setTimeout(handleLogin, 800)
    return () => clearTimeout(timer)
  }, [handleLogin])

  return (
    <GitHubAuthStatus
      status={status}
      message={message}
      progress={progress}
      onRetry={() => window.location.reload()}
    />
  )
}

export default function GitHubCallbackPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-background">
          <div className="text-primary h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      }
    >
      <GitHubCallbackContent />
    </React.Suspense>
  )
}
