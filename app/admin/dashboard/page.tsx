import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, MessageSquare, Eye, FileText, Plus } from 'lucide-react'
import Link from 'next/link'
import StatCard from '@/components/admin/StatCard'

export default function AdminDashboard() {
  // TODO: 실제 데이터로 교체 (Supabase API 연동)
  const stats = {
    totalListings: 24,
    totalInquiries: 12,
    totalViews: 1234,
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
          change="+3 이번주"
          icon={Building2}
          trend="up"
        />
        <StatCard
          title="대기중 상담"
          value={`${stats.totalInquiries}건`}
          change="+5 신규"
          icon={MessageSquare}
          trend="up"
        />
        <StatCard
          title="총 조회수"
          value={`${stats.totalViews.toLocaleString()}회`}
          change="+234 이번주"
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
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-body font-medium text-grey-900">
                    강남 프리미엄 오피스 등록됨
                  </p>
                  <p className="text-sm text-grey-500">2시간 전</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-body font-medium text-grey-900">
                    인수 상담 5건 신규 접수
                  </p>
                  <p className="text-sm text-grey-500">오늘</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-body font-medium text-grey-900">
                    서초 스타트업 공간 거래 완료
                  </p>
                  <p className="text-sm text-grey-500">어제</p>
                </div>
              </div>
            </div>
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
              <Link href="/admin/inquiries">
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
