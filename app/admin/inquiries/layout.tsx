'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function InquiriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const tabs = [
    { value: 'purchase', label: '인수 상담', href: '/admin/inquiries/purchase' },
    { value: 'register', label: '매각 상담', href: '/admin/inquiries/register' },
  ]

  const currentTab = pathname?.includes('/purchase') ? 'purchase' : 'register'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-main-xl font-bold text-grey-900">상담 관리</h1>
        <p className="text-body-sm text-grey-600 mt-2">
          인수 및 매각 상담 신청을 관리합니다
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={currentTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          {tabs.map((tab) => (
            <Link key={tab.value} href={tab.href}>
              <TabsTrigger
                value={tab.value}
                className="w-full"
              >
                {tab.label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      {children}
    </div>
  )
}
