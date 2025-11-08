'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  FileText,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

  return (
    <aside className="w-64 bg-white border-r border-grey-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-grey-200">
        <Link href="/admin/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-tossBlue tracking-tight">
            SHAREZONE
          </span>
          <span className="ml-2 text-xs font-medium text-grey-500 bg-grey-100 px-2 py-0.5 rounded">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-tossBlue'
                      : 'text-grey-700 hover:bg-grey-50 hover:text-tossBlue'
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
        <p className="text-xs text-grey-500 text-center">
          SHAREZONE Admin v1.0
        </p>
      </div>
    </aside>
  )
}
