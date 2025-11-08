'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, MessageSquare, Eye, FileText, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import StatCard from '@/components/admin/StatCard'
import { getAllListingsAdmin } from '@/lib/api/listings'
import { getInquiryStats, getRecentInquiries } from '@/lib/api/inquiries'

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingInquiries: 0,
    totalInquiries: 0,
    totalViews: 0,
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // 병렬로 데이터 가져오기
      const [listings, inquiryStats, recentInquiries] = await Promise.all([
        getAllListingsAdmin(),
        getInquiryStats(),
        getRecentInquiries(5),
      ])

      // 매물 통계
      const activeListings = (listings || []).filter((l) => l.status === 'active').length
      const totalViews = (listings || []).reduce((sum, l) => sum + (l.view_count || 0), 0)

      // 대기 중 상담 개수
      const pendingInquiries = (recentInquiries || []).filter(
        (i) => i.status === 'pending'
      ).length

      setStats({
        totalListings: (listings || []).length,
        activeListings,
        pendingInquiries,
        totalInquiries: inquiryStats?.total || 0,
        totalViews,
      })

      setRecentActivities(recentInquiries || [])
    } catch (err) {
      console.error('대시보드 데이터 로딩 실패:', err)
      setStats({
        totalListings: 0,
        activeListings: 0,
        pendingInquiries: 0,
        totalInquiries: 0,
        totalViews: 0,
      })
      setRecentActivities([])
    } finally {
      setIsLoading(false)
    }
  }

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const createdAt = new Date(date)
    const diffInHours = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours < 1) return '방금 전'
    if (diffInHours < 24) return `${diffInHours}시간 전`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '어제'
    if (diffInDays < 7) return `${diffInDays}일 전`
    return createdAt.toLocaleDateString('ko-KR')
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning'
      case 'contacted':
        return 'bg-primary'
      case 'qualified':
        return 'bg-info'
      case 'converted':
        return 'bg-success'
      default:
        return 'bg-grey-400'
    }
  }

  const getActivityDescription = (activity: any) => {
    const type = activity.type === 'purchase' ? '인수' : '매각'
    const status =
      activity.status === 'pending'
        ? '신규 접수'
        : activity.status === 'contacted'
        ? '연락 완료'
        : activity.status === 'qualified'
        ? '검증 완료'
        : activity.status === 'converted'
        ? '계약 완료'
        : '상담 접수'

    return `${type} 상담 - ${activity.name} (${status})`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-main-xl font-bold text-grey-900">대시보드</h1>
        <p className="text-body text-grey-600 mt-2">
          SHAREZONE 관리자 페이지에 오신 것을 환영합니다
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="총 매물"
          value={`${stats.totalListings}개`}
          change={`활성 ${stats.activeListings}개`}
          icon={Building2}
          trend="up"
        />
        <StatCard
          title="대기중 상담"
          value={`${stats.pendingInquiries}건`}
          change={`전체 ${stats.totalInquiries}건`}
          icon={MessageSquare}
          trend={stats.pendingInquiries > 0 ? 'up' : 'neutral'}
        />
        <StatCard
          title="총 조회수"
          value={`${stats.totalViews.toLocaleString()}회`}
          change={`평균 ${Math.round(stats.totalViews / Math.max(stats.totalListings, 1))}회/매물`}
          icon={Eye}
          trend="up"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-main font-bold">최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-body text-grey-500 mb-2">
                  현재 등록된 데이터가 없습니다
                </p>
                <p className="text-sm text-grey-400">
                  Supabase에 테스트 데이터를 삽입해주세요
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 ${getActivityColor(activity.status)} rounded-full mt-2`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-body font-medium text-grey-900">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-sm text-grey-500">
                        {getRelativeTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-main font-bold">빠른 액션</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/listings/new">
                <Button className="w-full justify-start gap-3" variant="outline" size="lg">
                  <Plus className="w-5 h-5" />
                  매물 등록
                </Button>
              </Link>
              <Link href="/admin/inquiries/purchase">
                <Button className="w-full justify-start gap-3" variant="outline" size="lg">
                  <MessageSquare className="w-5 h-5" />
                  상담 확인
                </Button>
              </Link>
              <Link href="/admin/articles/new">
                <Button className="w-full justify-start gap-3" variant="outline" size="lg">
                  <FileText className="w-5 h-5" />
                  글 작성
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
