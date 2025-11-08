'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // 로그인 성공 시 대시보드로 이동
      router.push('/admin/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('Login error:', err)
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-grey-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="text-2xl font-bold text-grey-900">SHAREZONE</h1>
          <p className="text-grey-600 mt-2">관리자 로그인</p>
        </CardHeader>

        <CardContent className="pb-10">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sharezone.com"
                required
                className="mt-1"
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked as boolean)}
              />
              <Label htmlFor="remember" className="cursor-pointer font-normal text-sm">
                로그인 상태 유지
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => alert('관리자에게 문의하세요: admin@sharezone.com')}
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
