'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, User, Bell, Shield, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-main-xl font-bold text-grey-900">설정</h1>
        <p className="text-body-sm text-grey-600 mt-2">
          시스템 및 계정 설정을 관리합니다
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="w-4 h-4" />
            일반
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            프로필
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            알림
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            보안
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="w-4 h-4" />
            데이터베이스
          </TabsTrigger>
        </TabsList>

        {/* 일반 설정 */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>사이트 정보</CardTitle>
              <CardDescription>웹사이트 기본 정보를 설정합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">사이트 이름</Label>
                <Input id="site-name" defaultValue="SHAREZONE" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">사이트 설명</Label>
                <Input
                  id="site-description"
                  defaultValue="공유오피스 M&A 전문 플랫폼"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">문의 이메일</Label>
                <Input
                  id="contact-email"
                  type="email"
                  defaultValue="biz.sharezone@gmail.com"
                />
              </div>
              <Separator />
              <Button>저장</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>운영 시간</CardTitle>
              <CardDescription>고객 상담 가능 시간을 설정합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="open-time">시작 시간</Label>
                  <Input id="open-time" type="time" defaultValue="09:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close-time">종료 시간</Label>
                  <Input id="close-time" type="time" defaultValue="18:00" />
                </div>
              </div>
              <Separator />
              <Button>저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 프로필 설정 */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>내 정보</CardTitle>
              <CardDescription>관리자 프로필 정보를 수정합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">이름</Label>
                <Input id="admin-name" defaultValue="관리자" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">이메일</Label>
                <Input
                  id="admin-email"
                  type="email"
                  defaultValue="admin@sharezone.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-phone">연락처</Label>
                <Input id="admin-phone" type="tel" defaultValue="010-0000-0000" />
              </div>
              <Separator />
              <Button>저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>이메일 알림</CardTitle>
              <CardDescription>이메일로 받을 알림을 설정합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">새로운 상담 접수</p>
                  <p className="text-sm text-grey-500">
                    새로운 상담이 접수되면 이메일로 알림을 받습니다
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">매물 등록</p>
                  <p className="text-sm text-grey-500">
                    새로운 매물이 등록되면 이메일로 알림을 받습니다
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <Separator />
              <Button>저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보안 설정 */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>비밀번호 변경</CardTitle>
              <CardDescription>계정의 비밀번호를 변경합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">현재 비밀번호</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">새 비밀번호</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Separator />
              <Button>비밀번호 변경</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 데이터베이스 설정 */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supabase 연결 정보</CardTitle>
              <CardDescription>데이터베이스 연결 상태를 확인합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Supabase URL</Label>
                <Input
                  value={process.env.NEXT_PUBLIC_SUPABASE_URL || '설정되지 않음'}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>연결 상태</Label>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm text-grey-700">연결됨</span>
                </div>
              </div>
              <Separator />
              <div className="bg-grey-50 p-4 rounded-lg">
                <p className="text-sm text-grey-600">
                  <strong>참고:</strong> 데이터베이스 설정은 .env.local 파일에서 관리됩니다.
                </p>
              </div>
            </CardContent>
          </Card>

        </TabsContent>
      </Tabs>
    </div>
  )
}
