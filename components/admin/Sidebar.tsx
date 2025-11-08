'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  FileText,
  Settings
} from 'lucide-react'

const menuItems = [
  {
    icon: LayoutDashboard,
    label: '대시보드',
    href: '/admin/dashboard',
  },
  {
    icon: Building2,
    label: '매물 관리',
    href: '/admin/listings',
  },
  {
    icon: MessageSquare,
    label: '상담 관리',
    href: '/admin/inquiries',
  },
  {
    icon: FileText,
    label: '콘텐츠',
    href: '/admin/articles',
  },
  {
    icon: Settings,
    label: '설정',
    href: '/admin/settings',
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside className="w-64 bg-white border-r border-grey-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-grey-200">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="font-bold text-grey-900">SHAREZONE</h1>
            <p className="text-xs text-grey-500">관리자</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    active
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-grey-700 hover:bg-grey-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-grey-200">
        <div className="text-xs text-grey-500 text-center">
          © 2025 SHAREZONE
        </div>
      </div>
    </aside>
  )
}
