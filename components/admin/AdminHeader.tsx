'use client'

import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function AdminHeader() {
  // TODO: 실제 관리자 정보로 교체 (Supabase Auth 연동)
  const adminName = '데브스타'
  const adminRole = 'super_admin'
  const adminInitials = adminName.substring(0, 2)

  const handleLogout = () => {
    // TODO: Supabase 로그아웃 구현
    console.log('Logout')
    // router.push('/admin')
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return '최고 관리자'
      case 'admin':
        return '관리자'
      case 'staff':
        return '직원'
      default:
        return '사용자'
    }
  }

  return (
    <header className="bg-white border-b border-grey-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title (동적으로 변경 가능) */}
        <div>
          <h1 className="text-main-lg font-bold text-grey-900">
            {/* 페이지별로 동적으로 변경 */}
          </h1>
        </div>

        {/* Admin User Menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 hover:bg-grey-50"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-tossBlue text-white text-sm font-medium">
                    {adminInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-grey-900">
                    {adminName}
                  </p>
                  <p className="text-xs text-grey-500">
                    {getRoleLabel(adminRole)}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                프로필 설정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-error">
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
