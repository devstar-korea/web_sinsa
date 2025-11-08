import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // /admin 경로 보호 (로그인 페이지 제외)
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // 로그인 페이지 처리
    if (req.nextUrl.pathname === '/admin/login') {
      // 이미 로그인된 경우 대시보드로 리디렉션
      if (session) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      return res
    }

    // 로그인되지 않은 경우 로그인 페이지로 리디렉션
    if (!session) {
      const redirectUrl = new URL('/admin/login', req.url)
      // 로그인 후 돌아갈 URL 저장
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
