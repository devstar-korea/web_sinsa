'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import InquiryStatusBadge from '@/components/admin/InquiryStatusBadge'

// TODO: 실제 데이터로 교체 (Supabase API 연동)
const dummyInquiries = [
  {
    id: 1,
    status: 'pending' as const,
    name: '김철수',
    phone: '010-1234-5678',
    email: 'kim@example.com',
    purpose: '투자',
    budget: '3억 내외',
    experience: '있음',
    location: '서울 강남구',
    createdAt: '2025-11-08 14:30',
    message: '강남 지역에 관심이 있습니다. 자세한 상담 부탁드립니다.',
  },
  {
    id: 2,
    status: 'contacted' as const,
    name: '이영희',
    phone: '010-5678-9012',
    email: 'lee@example.com',
    purpose: '운영',
    budget: '2억 이하',
    experience: '없음',
    location: '서울 서초구',
    createdAt: '2025-11-07 10:15',
    assignee: '나성호',
    note: '방문 예약 완료',
    message: '직접 운영 목적으로 알아보고 있습니다.',
  },
  {
    id: 3,
    status: 'qualified' as const,
    name: '박민수',
    phone: '010-9876-5432',
    email: 'park@example.com',
    purpose: '투자',
    budget: '5억 이상',
    experience: '있음',
    location: '서울 강남구',
    createdAt: '2025-11-06 16:45',
    assignee: '김지수',
    note: '재무 검증 완료, 계약 준비 중',
    message: '투자 포트폴리오 확장 목적입니다.',
  },
]

type InquiryStatus = 'all' | 'pending' | 'contacted' | 'qualified' | 'converted'

const statusTabs = [
  { value: 'all' as InquiryStatus, label: '전체', count: 24 },
  { value: 'pending' as InquiryStatus, label: '대기', count: 12 },
  { value: 'contacted' as InquiryStatus, label: '연락완료', count: 8 },
  { value: 'qualified' as InquiryStatus, label: '검증완료', count: 3 },
  { value: 'converted' as InquiryStatus, label: '전환', count: 1 },
]

export default function PurchaseInquiriesPage() {
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<number | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [inquiryStatus, setInquiryStatus] = useState<'pending' | 'contacted' | 'qualified' | 'converted' | 'rejected'>('pending')

  const filteredInquiries =
    selectedStatus === 'all'
      ? dummyInquiries
      : dummyInquiries.filter((inquiry) => inquiry.status === selectedStatus)

  const currentInquiry = dummyInquiries.find((inq) => inq.id === selectedInquiry)

  const handleOpenDetail = (inquiry: typeof dummyInquiries[0]) => {
    setSelectedInquiry(inquiry.id)
    setAdminNote(inquiry.note || '')
    setInquiryStatus(inquiry.status)
  }

  const handleCloseDetail = () => {
    setSelectedInquiry(null)
    setAdminNote('')
  }

  const handleSave = () => {
    // TODO: Supabase API 호출하여 저장
    console.log('Save:', { id: selectedInquiry, adminNote, status: inquiryStatus })
    handleCloseDetail()
  }

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statusTabs.map((tab) => (
          <Button
            key={tab.value}
            variant={selectedStatus === tab.value ? 'default' : 'outline'}
            onClick={() => setSelectedStatus(tab.value)}
            className="gap-2"
          >
            {tab.label}
            <Badge
              variant="secondary"
              className="ml-1 bg-white/20 text-inherit border-0"
            >
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Inquiry List */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => (
          <Card key={inquiry.id} className="hover:border-primary transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Header: Status + Name + Phone */}
                  <div className="flex items-center gap-3">
                    <InquiryStatusBadge status={inquiry.status} />
                    <span className="font-medium text-grey-900">{inquiry.name}</span>
                    <span className="text-grey-600">{inquiry.phone}</span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-grey-600">목적:</span>{' '}
                      <span className="text-grey-900">{inquiry.purpose}</span>
                    </div>
                    <div>
                      <span className="text-grey-600">예산:</span>{' '}
                      <span className="text-grey-900">{inquiry.budget}</span>
                    </div>
                    <div>
                      <span className="text-grey-600">희망 지역:</span>{' '}
                      <span className="text-grey-900">{inquiry.location}</span>
                    </div>
                    <div>
                      <span className="text-grey-600">경험:</span>{' '}
                      <span className="text-grey-900">{inquiry.experience}</span>
                    </div>
                    {inquiry.assignee && (
                      <div>
                        <span className="text-grey-600">담당자:</span>{' '}
                        <span className="text-grey-900">{inquiry.assignee}</span>
                      </div>
                    )}
                    {inquiry.note && (
                      <div className="col-span-2">
                        <span className="text-grey-600">메모:</span>{' '}
                        <span className="text-grey-900">{inquiry.note}</span>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <p className="text-sm text-grey-500">신청일: {inquiry.createdAt}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDetail(inquiry)}
                  >
                    상세보기
                  </Button>
                  {inquiry.status === 'pending' && (
                    <Button variant="default" size="sm">
                      연락완료 처리
                    </Button>
                  )}
                  {inquiry.status === 'contacted' && (
                    <Button variant="default" size="sm">
                      검증 완료 처리
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredInquiries.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-grey-500">
              해당 상태의 상담이 없습니다
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={selectedInquiry !== null} onOpenChange={handleCloseDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-main-lg">상담 상세</DialogTitle>
          </DialogHeader>

          {currentInquiry && (
            <div className="space-y-6 py-4">
              {/* 신청자 정보 */}
              <div>
                <h3 className="text-main font-bold text-grey-900 mb-3">📋 신청자 정보</h3>
                <div className="space-y-2 text-body">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-grey-600">이름:</span>{' '}
                      <span className="text-grey-900 font-medium">{currentInquiry.name}</span>
                    </div>
                    <div>
                      <span className="text-grey-600">전화:</span>{' '}
                      <span className="text-grey-900">{currentInquiry.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-grey-600">이메일:</span>{' '}
                      <span className="text-grey-900">{currentInquiry.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 문의 내용 */}
              <div>
                <h3 className="text-main font-bold text-grey-900 mb-3">📝 문의 내용</h3>
                <div className="space-y-2 text-body">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-grey-600">목적:</span>{' '}
                      <span className="text-grey-900">{currentInquiry.purpose}</span>
                    </div>
                    <div>
                      <span className="text-grey-600">예산:</span>{' '}
                      <span className="text-grey-900">{currentInquiry.budget}</span>
                    </div>
                    <div>
                      <span className="text-grey-600">희망 지역:</span>{' '}
                      <span className="text-grey-900">{currentInquiry.location}</span>
                    </div>
                    <div>
                      <span className="text-grey-600">경험:</span>{' '}
                      <span className="text-grey-900">{currentInquiry.experience}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-grey-600">메시지:</span>
                    <p className="text-grey-900 mt-1 p-3 bg-grey-50 rounded-lg">
                      {currentInquiry.message}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 관리자 메모 */}
              <div>
                <Label htmlFor="note" className="text-main font-bold text-grey-900">
                  📝 관리자 메모
                </Label>
                <Textarea
                  id="note"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="상담 관련 메모를 입력하세요"
                  className="mt-2 min-h-[200px]"
                />
              </div>

              {/* 상태 변경 */}
              <div>
                <Label htmlFor="status" className="text-main font-bold text-grey-900">
                  🔄 상태 변경
                </Label>
                <Select
                  value={inquiryStatus}
                  onValueChange={(value) => setInquiryStatus(value as any)}
                >
                  <SelectTrigger id="status" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">대기</SelectItem>
                    <SelectItem value="contacted">연락완료</SelectItem>
                    <SelectItem value="qualified">검증완료</SelectItem>
                    <SelectItem value="converted">전환</SelectItem>
                    <SelectItem value="rejected">거부</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  저장
                </Button>
                <Button onClick={handleCloseDetail} variant="outline" className="flex-1">
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
