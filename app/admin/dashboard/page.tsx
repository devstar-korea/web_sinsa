import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, MessageSquare, Eye } from 'lucide-react'

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
        {/* 총 매물 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sub font-medium text-grey-700">
              총 매물
            </CardTitle>
            <Building2 className="w-5 h-5 text-tossBlue" />
          </CardHeader>
          <CardContent>
            <div className="text-main-xl font-bold text-grey-900">
              {stats.totalListings}개
            </div>
            <p className="text-sm text-success mt-1">
              +3 이번주
            </p>
          </CardContent>
        </Card>

        {/* 대기중 상담 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sub font-medium text-grey-700">
              대기중 상담
            </CardTitle>
            <MessageSquare className="w-5 h-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-main-xl font-bold text-grey-900">
              {stats.totalInquiries}건
            </div>
            <p className="text-sm text-warning mt-1">
              +5 신규
            </p>
          </CardContent>
        </Card>

        {/* 총 조회수 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sub font-medium text-grey-700">
              총 조회수
            </CardTitle>
            <Eye className="w-5 h-5 text-grey-500" />
          </CardHeader>
          <CardContent>
            <div className="text-main-xl font-bold text-grey-900">
              {stats.totalViews.toLocaleString()}회
            </div>
            <p className="text-sm text-success mt-1">
              +234 이번주
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-main font-bold">최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-tossBlue rounded-full mt-2"></div>
              <div>
                <p className="text-body font-medium text-grey-900">
                  강남 프리미엄 오피스 등록됨
                </p>
                <p className="text-sm text-grey-500">2시간 전</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
              <div>
                <p className="text-body font-medium text-grey-900">
                  인수 상담 5건 신규 접수
                </p>
                <p className="text-sm text-grey-500">오늘</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
              <div>
                <p className="text-body font-medium text-grey-900">
                  서초 스타트업 공간 거래 완료
                </p>
                <p className="text-sm text-grey-500">어제</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-main font-bold">빠른 액션</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/listings/new"
              className="p-4 border border-grey-200 rounded-lg hover:border-tossBlue hover:bg-grey-50 transition-colors text-center"
            >
              <Building2 className="w-8 h-8 mx-auto mb-2 text-tossBlue" />
              <p className="text-body font-medium text-grey-900">
                매물 등록
              </p>
            </a>
            <a
              href="/admin/inquiries"
              className="p-4 border border-grey-200 rounded-lg hover:border-warning hover:bg-grey-50 transition-colors text-center"
            >
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-warning" />
              <p className="text-body font-medium text-grey-900">
                상담 확인
              </p>
            </a>
            <a
              href="/admin/articles/new"
              className="p-4 border border-grey-200 rounded-lg hover:border-grey-500 hover:bg-grey-50 transition-colors text-center"
            >
              <Eye className="w-8 h-8 mx-auto mb-2 text-grey-500" />
              <p className="text-body font-medium text-grey-900">
                글 작성
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
