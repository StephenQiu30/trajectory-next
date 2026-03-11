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
  onSubmit,
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
    const syntheticEvent = {
      preventDefault: () => { },
    } as React.FormEvent
    onSubmit(syntheticEvent)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-bold ml-1">邮箱地址</FormLabel>
              <div className="group relative">
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    className="h-14 rounded-2xl border-border/50 bg-secondary/30 px-4 pl-12 text-[15px] transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5"
                    {...field}
                  />
                </FormControl>
                <Mail className="absolute top-4 left-4 h-5 w-5 text-foreground/40 transition-colors group-focus-within:text-primary" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-bold ml-1">验证码</FormLabel>
              <div className="flex gap-3">
                <div className="group relative flex-1">
                  <FormControl>
                    <Input
                      placeholder="6位验证码"
                      maxLength={6}
                      className="h-14 rounded-2xl border-border/50 bg-secondary/30 px-4 pl-12 text-[15px] transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5"
                      {...field}
                    />
                  </FormControl>
                  <CheckCircle2 className="absolute top-4 left-4 h-5 w-5 text-foreground/40 transition-colors group-focus-within:text-primary" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSendCode}
                  disabled={loading || countdown > 0}
                  className="h-14 min-w-[120px] rounded-2xl border-border/50 bg-secondary/30 font-bold hover:bg-background hover:text-primary transition-all active:scale-[0.98]"
                >
                  {countdown > 0 ? `${countdown}s` : '发送'}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-sm text-primary font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
          <Button
            type="submit"
            className="h-14 w-full rounded-2xl bg-primary hover:bg-primary/90 text-white text-[15px] font-bold apple-shadow transition-all active:scale-[0.98]"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            登录 / 注册
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="h-12 w-full rounded-2xl text-sm font-bold text-foreground/40 hover:text-foreground transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
        </div>
      </form>
    </Form>
  )
}
