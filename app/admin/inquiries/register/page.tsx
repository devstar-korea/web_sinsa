'use client'

import { useState, useEffect } from 'react'
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
import { Loader2 } from 'lucide-react'
import InquiryStatusBadge from '@/components/admin/InquiryStatusBadge'
import Link from 'next/link'
import {
  getAllRegisterInquiries,
  getRegisterInquiriesByStatus,
  updateRegisterInquiry,
  type RegisterInquiry,
} from '@/lib/api/inquiries'

type InquiryStatus = 'all' | 'pending' | 'contacted' | 'qualified' | 'converted'

const statusTabs = [
  { value: 'all' as InquiryStatus, label: '전체' },
  { value: 'pending' as InquiryStatus, label: '대기' },
  { value: 'contacted' as InquiryStatus, label: '연락완료' },
  { value: 'qualified' as InquiryStatus, label: '검증완료' },
  { value: 'converted' as InquiryStatus, label: '매물등록' },
]

export default function RegisterInquiriesPage() {
  const [inquiries, setInquiries] = useState<RegisterInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<RegisterInquiry | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [inquiryStatus, setInquiryStatus] = useState<'pending' | 'contacted' | 'qualified' | 'converted' | 'rejected'>('pending')

  // 데이터 로딩
  useEffect(() => {
    loadInquiries()
  }, [selectedStatus])

  const loadInquiries = async () => {
    try {
      setIsLoading(true)
      const data =
        selectedStatus === 'all'
          ? await getAllRegisterInquiries()
          : await getRegisterInquiriesByStatus(selectedStatus)
      setInquiries(data || [])
    } catch (err) {
      console.error('상담 조회 실패:', err)
      setInquiries([])
    } finally {
      setIsLoading(false)
    }
  }

  // 상태별 카운트
  const statusCounts = inquiries.reduce(
    (acc, inq) => {
      acc.all++
      if (inq.status) acc[inq.status]++
      return acc
    },
    { all: 0, pending: 0, contacted: 0, qualified: 0, converted: 0 } as Record<string, number>
  )

  const handleOpenDetail = (inquiry: RegisterInquiry) => {
    setSelectedInquiry(inquiry)
    setAdminNote(inquiry.admin_notes || '')
    setInquiryStatus(inquiry.status || 'pending')
  }

  const handleCloseDetail = () => {
    setSelectedInquiry(null)
    setAdminNote('')
  }

  const handleSave = async () => {
    if (!selectedInquiry?.id) return

    try {
      await updateRegisterInquiry(selectedInquiry.id, {
        status: inquiryStatus,
        admin_notes: adminNote,
      })
      await loadInquiries()
      handleCloseDetail()
    } catch (err) {
      console.error('상담 업데이트 실패:', err)
      alert('상담 업데이트에 실패했습니다.')
    }
  }

  const handleQuickStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateRegisterInquiry(id, { status: newStatus as any })
      await loadInquiries()
    } catch (err) {
      console.error('상태 변경 실패:', err)
      alert('상태 변경에 실패했습니다.')
    }
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
              {statusCounts[tab.value] || 0}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Inquiry List */}
      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id} className="hover:border-primary transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Header: Status + Name + Phone */}
                  <div className="flex items-center gap-3">
                    <InquiryStatusBadge status={inquiry.status || 'pending'} />
                    <span className="font-medium text-grey-900">{inquiry.name}</span>
                    <span className="text-grey-600">{inquiry.phone}</span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-grey-600">위치:</span>{' '}
                      <span className="text-grey-900">{inquiry.location}</span>
                    </div>
                    <div>
                      <span className="text-grey-600">이메일:</span>{' '}
                      <span className="text-grey-900">{inquiry.email}</span>
                    </div>
                    {inquiry.area_range && (
                      <div>
                        <span className="text-grey-600">면적:</span>{' '}
                        <span className="text-grey-900">{inquiry.area_range}</span>
                      </div>
                    )}
                    {inquiry.price_range && (
                      <div>
                        <span className="text-grey-600">가격대:</span>{' '}
                        <span className="text-grey-900">{inquiry.price_range}</span>
                      </div>
                    )}
                    {inquiry.assigned_to && (
                      <div>
                        <span className="text-grey-600">담당자:</span>{' '}
                        <span className="text-grey-900">{inquiry.assigned_to}</span>
                      </div>
                    )}
                    {inquiry.linked_listing_id && (
                      <div>
                        <span className="text-grey-600">등록 매물:</span>{' '}
                        <span className="text-primary font-medium">{inquiry.linked_listing_id}</span>
                      </div>
                    )}
                    {inquiry.admin_notes && (
                      <div className="col-span-2">
                        <span className="text-grey-600">메모:</span>{' '}
                        <span className="text-grey-900">{inquiry.admin_notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <p className="text-sm text-grey-500">
                    신청일: {new Date(inquiry.created_at || '').toLocaleDateString('ko-KR')}
                  </p>
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
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleQuickStatusChange(inquiry.id!, 'contacted')}
                    >
                      연락완료 처리
                    </Button>
                  )}
                  {inquiry.status === 'contacted' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleQuickStatusChange(inquiry.id!, 'qualified')}
                    >
                      검증 완료 처리
                    </Button>
                  )}
                  {inquiry.status === 'qualified' && !inquiry.linked_listing_id && (
                    <Button variant="default" size="sm">
                      매물 등록하기
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {inquiries.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-grey-600 mb-2">현재 등록된 데이터가 없습니다</p>
              <p className="text-sm text-grey-500">Supabase에 테스트 데이터를 삽입해주세요</p>
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

          {selectedInquiry && (
            <div className="space-y-6 py-4">
              {/* 신청자 정보 */}
              <div>
                <h3 className="text-main font-bold text-grey-900 mb-3">📋 신청자 정보</h3>
                <div className="space-y-2 text-body">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-grey-600">이름:</span>{' '}
                      <span className="text-grey-900 font-medium">{selectedInquiry.name}</span>
                    </div>
                    <div>
                      <span className="text-grey-600">전화:</span>{' '}
                      <span className="text-grey-900">{selectedInquiry.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-grey-600">이메일:</span>{' '}
                      <span className="text-grey-900">{selectedInquiry.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 사업장 정보 */}
              <div>
                <h3 className="text-main font-bold text-grey-900 mb-3">🏢 사업장 정보</h3>
                <div className="space-y-2 text-body">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-grey-600">위치:</span>{' '}
                      <span className="text-grey-900">{selectedInquiry.location}</span>
                    </div>
                    {selectedInquiry.area_range && (
                      <div>
                        <span className="text-grey-600">면적:</span>{' '}
                        <span className="text-grey-900">{selectedInquiry.area_range}</span>
                      </div>
                    )}
                    {selectedInquiry.price_range && (
                      <div>
                        <span className="text-grey-600">가격대:</span>{' '}
                        <span className="text-grey-900">{selectedInquiry.price_range}</span>
                      </div>
                    )}
                  </div>
                  {selectedInquiry.message && (
                    <div className="mt-3">
                      <span className="text-grey-600">메시지:</span>
                      <p className="text-grey-900 mt-1 p-3 bg-grey-50 rounded-lg">
                        {selectedInquiry.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* 연결 매물 (있을 경우) */}
              {selectedInquiry.linked_listing_id && (
                <>
                  <div>
                    <h3 className="text-main font-bold text-grey-900 mb-3">🏢 등록 매물</h3>
                    <div className="flex items-center justify-between p-3 bg-grey-50 rounded-lg">
                      <div>
                        <p className="font-medium text-grey-900">
                          {selectedInquiry.linked_listing_id}
                        </p>
                      </div>
                      <Link href={`/admin/listings/${selectedInquiry.linked_listing_id}`}>
                        <Button variant="outline" size="sm">
                          매물 보기
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

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
                    <SelectItem value="converted">매물등록</SelectItem>
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
