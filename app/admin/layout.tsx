// ============================================
// Admin Layout with Server-Side Authentication  
// ============================================
// Purpose: Protect all admin pages with server-side session validation
// Security: Replaces vulnerable middleware (CVE-2025-29927)

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import Sidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata: Metadata = {
  title: 'SHAREZONE 관리자',
  description: '쉐어존 관리자 페이지',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side authentication check
  // Next.js 16: cookies() returns a Promise and must be awaited
  const cookieStore = await cookies()
  
  // createServerComponentClient expects a function that returns the cookie store
  const supabase = createServerComponentClient({
    cookies: async () => cookieStore
  })

  // Get current user (more secure than getSession)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen bg-grey-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <AdminHeader />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
