'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  code: z.string().length(6, '请输入6位验证码'),
})

type FormValues = z.infer<typeof formSchema>

interface EmailLoginProps {
  emailForm: { email: string; code: string }
  setEmailForm: React.Dispatch<React.SetStateAction<{ email: string; code: string }>>
  onSendCode: () => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
  loading: boolean
  countdown: number
  error: string
  success: string
}

export function EmailLogin({
  emailForm,
  setEmailForm,
  onSendCode,
  onSubmit, // We'll adapt this
  onBack,
  loading,
  countdown,
  error,
  success,
}: EmailLoginProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: emailForm.email,
      code: emailForm.code,
    },
    mode: 'onChange',
  })

  // Sync form values with parent state
  React.useEffect(() => {
    const subscription = form.watch(value => {
      setEmailForm({
        email: value.email || '',
        code: value.code || '',
      })
    })
    return () => subscription.unsubscribe()
  }, [form, setEmailForm])

  const handleSubmit = (data: FormValues) => {
    // Creating a synthetic event to match the original interface
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent
    onSubmit(syntheticEvent)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱地址</FormLabel>
              <div className="group relative">
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 pl-11 transition-all group-hover:bg-white focus:border-[#0071e3] focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-800"
                    {...field}
                  />
                </FormControl>
                <Mail className="absolute top-3.5 left-3.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-[#0071e3]" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>验证码</FormLabel>
              <div className="flex gap-3">
                <div className="group relative flex-1">
                  <FormControl>
                    <Input
                      placeholder="6位验证码"
                      maxLength={6}
                      className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 pl-11 transition-all group-hover:bg-white focus:border-[#0071e3] focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-800"
                      {...field}
                    />
                  </FormControl>
                  <CheckCircle2 className="absolute top-3.5 left-3.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-[#0071e3]" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSendCode}
                  disabled={loading || countdown > 0}
                  className="h-12 min-w-[120px] shrink-0 rounded-xl border-2 border-gray-100 bg-white font-medium text-gray-600 hover:border-[#0071e3]/30 hover:bg-[#0071e3]/5 hover:text-[#0071e3] disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {countdown > 0 ? `${countdown}s` : '发送验证码'}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-gradient-to-r from-[#0071e3] to-[#0077ed] text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70 dark:shadow-blue-900/30"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            登录 / 注册
          </Button>
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
      </form>
    </Form>
  )
}
