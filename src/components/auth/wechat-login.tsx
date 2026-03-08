'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { checkWxLoginStatus, getWxLoginQrCode } from '@/api/user/userController'
import { AlertCircle, ArrowLeft, Loader2, RefreshCw } from 'lucide-react'

interface WeChatLoginProps {
  onBack: () => void
  onLoginSuccess: (user: UserAPI.LoginUserVO) => void
  error: string
  setError: (error: string) => void
}

export function WeChatLogin({ onBack, onLoginSuccess, error, setError }: WeChatLoginProps) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('')
  const [sceneId, setSceneId] = React.useState<string>('')
  const [loading, setLoading] = React.useState(true)
  const [expired, setExpired] = React.useState(false)
  const pollingRef = React.useRef<NodeJS.Timeout | null>(null)

  const fetchQrCode = React.useCallback(async () => {
    setLoading(true)
    setExpired(false)
    setError('')

    try {
      const res = (await getWxLoginQrCode()) as unknown as UserAPI.BaseResponseWxLoginResponse
      if (res.code === 0 && res.data) {
        setQrCodeUrl(res.data.qrCodeUrl || '')
        setSceneId(res.data.sceneId || '')
      } else {
        setError(res.message || '获取二维码失败')
      }
    } catch (err: any) {
      setError(err.message || '获取二维码失败')
    } finally {
      setLoading(false)
    }
  }, [setError])

  // Start polling for login status
  React.useEffect(() => {
    if (!sceneId) return

    let expireTimeout: NodeJS.Timeout

    const pollStatus = async () => {
      try {
        const res = (await checkWxLoginStatus({
          sceneId: sceneId,
        })) as unknown as UserAPI.BaseResponseLoginUserVO
        if (res.code === 0 && res.data) {
          // Login successful
          if (pollingRef.current) {
            clearInterval(pollingRef.current)
          }
          onLoginSuccess(res.data)
        }
      } catch {
        // Continue polling on error
      }
    }

    // Poll every 2 seconds
    pollingRef.current = setInterval(pollStatus, 2000)

    // QR code expires after 5 minutes
    expireTimeout = setTimeout(
      () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current)
        }
        setExpired(true)
      },
      5 * 60 * 1000
    )

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
      clearTimeout(expireTimeout)
    }
  }, [sceneId, onLoginSuccess])

  // Fetch QR code on mount
  React.useEffect(() => {
    fetchQrCode()
  }, [fetchQrCode])

  const handleRefresh = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
    }
    fetchQrCode()
  }

  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="relative">
        {loading ? (
          <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : qrCodeUrl ? (
          <div className="relative">
            <img
              src={qrCodeUrl}
              alt="微信登录二维码"
              className={`h-48 w-48 rounded-2xl border-2 border-gray-100 dark:border-gray-700 ${expired ? 'opacity-30' : ''}`}
            />
            {expired && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/80 dark:bg-gray-900/80">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  二维码已过期
                </span>
                <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  刷新
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-48 w-48 flex-col items-center justify-center gap-2 rounded-2xl bg-gray-100 dark:bg-gray-800">
            <span className="text-sm text-gray-500">加载失败</span>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              重试
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-1 text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-white">使用微信扫一扫登录</p>
        <p className="text-xs text-gray-500">请使用微信扫描二维码关注公众号完成登录</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="h-10 w-full rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回方式选择
      </Button>
    </div>
  )
}
