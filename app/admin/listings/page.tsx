'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  Loader2,
} from 'lucide-react'
import {
  getAllListingsAdmin,
  updateListing,
  deleteListing,
  permanentDeleteListing,
} from '@/lib/api/listings'
import type { ListingRaw } from '@/lib/types'

type SortField = 'createdAt' | 'price' | 'viewCount'
type SortOrder = 'asc' | 'desc'
type TabStatus = 'all' | 'active' | 'pending' | 'hidden' | 'sold' | 'deleted'

export default function AdminListingsPage() {
  // 데이터 상태
  const [allListings, setAllListings] = useState<ListingRaw[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 탭 및 필터
  const [currentTab, setCurrentTab] = useState<TabStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState<string>('all')

  // 정렬
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // 데이터 로딩
  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAllListingsAdmin()
      setAllListings(data || [])
    } catch (err) {
      console.error('매물 조회 실패:', err)
      setError('매물을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 탭별 카운트
  const tabCounts = useMemo(() => {
    return {
      all: allListings.filter(l => !l.deleted_at).length,
      active: allListings.filter(l => l.status === 'active' && !l.deleted_at).length,
      pending: allListings.filter(l => l.status === 'pending' && !l.deleted_at).length,
      hidden: allListings.filter(l => l.status === 'hidden' && !l.deleted_at).length,
      sold: allListings.filter(l => l.status === 'sold' && !l.deleted_at).length,
      deleted: allListings.filter(l => !!l.deleted_at).length,
    }
  }, [allListings])

  // 필터링 및 정렬된 데이터
  const filteredListings = useMemo(() => {
    let result = [...allListings]

    // 탭 필터 (삭제 여부)
    if (currentTab === 'deleted') {
      result = result.filter(listing => !!listing.deleted_at)
    } else {
      result = result.filter(listing => !listing.deleted_at)

      // 상태 필터
      if (currentTab !== 'all') {
        result = result.filter((listing) => listing.status === currentTab)
      }
    }

    // 검색
    if (searchQuery) {
      result = result.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.listing_number?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 지역 필터
    if (locationFilter !== 'all') {
      result = result.filter((listing) => listing.province === locationFilter)
    }

    // 정렬
    result.sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      if (sortField === 'price') {
        aValue = a.price_amount || 0
        bValue = b.price_amount || 0
      } else if (sortField === 'viewCount') {
        aValue = a.view_count || 0
        bValue = b.view_count || 0
      } else {
        aValue = new Date(a.created_at || '').getTime()
        bValue = new Date(b.created_at || '').getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return result
  }, [allListings, currentTab, searchQuery, locationFilter, sortField, sortOrder])

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredListings.map((l) => l.id))
    } else {
      setSelectedIds([])
    }
  }

  // 개별 선택/해제
  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    }
  }

  // 상태 변경
  const handleBulkStatusChange = async (status: string) => {
    try {
      await Promise.all(
        selectedIds.map((id) => updateListing(id, { status: status as any }))
      )
      await loadListings()
      setSelectedIds([])
    } catch (err) {
      console.error('일괄 상태 변경 실패:', err)
      alert('상태 변경에 실패했습니다.')
    }
  }

  // 삭제 (Soft Delete)
  const handleDelete = async (id: string) => {
    if (!confirm('이 매물을 삭제하시겠습니까? (30일 후 완전 삭제)')) return

    try {
      await deleteListing(id)
      await loadListings()
    } catch (err) {
      console.error('매물 삭제 실패:', err)
      alert('매물 삭제에 실패했습니다.')
    }
  }

  // 일괄 삭제
  const handleBulkDelete = async () => {
    if (!confirm(`선택한 ${selectedIds.length}개 매물을 삭제하시겠습니까?`)) return

    try {
      await Promise.all(selectedIds.map((id) => deleteListing(id)))
      await loadListings()
      setSelectedIds([])
    } catch (err) {
      console.error('일괄 삭제 실패:', err)
      alert('일괄 삭제에 실패했습니다.')
    }
  }

  // 복원
  const handleRestore = async (id: string) => {
    try {
      await updateListing(id, { deleted_at: undefined, deleted_by: undefined })
      await loadListings()
    } catch (err) {
      console.error('복원 실패:', err)
      alert('복원에 실패했습니다.')
    }
  }

  // 영구 삭제
  const handlePermanentDelete = async (id: string) => {
    if (
      !confirm(
        '영구적으로 삭제됩니다. 복구할 수 없습니다. 계속하시겠습니까?'
      )
    )
      return

    try {
      await permanentDeleteListing(id)
      await loadListings()
    } catch (err) {
      console.error('영구 삭제 실패:', err)
      alert('영구 삭제에 실패했습니다.')
    }
  }

  // 상태 토글
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'hidden' : 'active'
    try {
      await updateListing(id, { status: newStatus })
      await loadListings()
    } catch (err) {
      console.error('상태 변경 실패:', err)
      alert('상태 변경에 실패했습니다.')
    }
  }

  // 상태 뱃지 스타일
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">판매중</Badge>
      case 'pending':
        return <Badge variant="secondary">대기</Badge>
      case 'hidden':
        return <Badge variant="outline">숨김</Badge>
      case 'sold':
        return <Badge variant="destructive">거래완료</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 삭제 남은 일수 계산
  const getDaysUntilPermanentDelete = (deletedAt?: string) => {
    if (!deletedAt) return null
    const deleted = new Date(deletedAt)
    const permanent = new Date(deleted.getTime() + 30 * 24 * 60 * 60 * 1000)
    const now = new Date()
    const days = Math.ceil((permanent.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    return days
  }

  // 고유 지역 목록
  const uniqueProvinces = useMemo(() => {
    return Array.from(new Set(allListings.map((l) => l.province)))
  }, [allListings])

  // 로딩 중이면 로딩 UI 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // 에러 발생 시 에러 메시지 표시
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-error">{error}</p>
        <Button onClick={loadListings}>다시 시도</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-main-xl font-bold text-grey-900">매물 관리</h1>
          <p className="text-body-sm text-grey-600 mt-2">
            전체 {tabCounts.all}개의 매물
          </p>
        </div>
        <Link href="/admin/listings/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            매물 등록
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as TabStatus)}>
        <TabsList>
          <TabsTrigger value="all">
            전체 <span className="ml-1.5 text-grey-500">({tabCounts.all})</span>
          </TabsTrigger>
          <TabsTrigger value="active">
            판매중 <span className="ml-1.5 text-grey-500">({tabCounts.active})</span>
          </TabsTrigger>
          <TabsTrigger value="pending">
            대기 <span className="ml-1.5 text-grey-500">({tabCounts.pending})</span>
          </TabsTrigger>
          <TabsTrigger value="hidden">
            숨김 <span className="ml-1.5 text-grey-500">({tabCounts.hidden})</span>
          </TabsTrigger>
          <TabsTrigger value="sold">
            거래완료 <span className="ml-1.5 text-grey-500">({tabCounts.sold})</span>
          </TabsTrigger>
          <TabsTrigger value="deleted">
            삭제내역 <span className="ml-1.5 text-grey-500">({tabCounts.deleted})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-6 space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border border-grey-200 space-y-4">
            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                <Input
                  placeholder="제목 또는 매물번호로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters and Sort */}
            <div className="flex gap-4">
              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 지역</SelectItem>
                  {uniqueProvinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={`${sortField}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split('-')
                  setSortField(field as SortField)
                  setSortOrder(order as SortOrder)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">최신순</SelectItem>
                  <SelectItem value="createdAt-asc">오래된순</SelectItem>
                  <SelectItem value="price-desc">가격 높은순</SelectItem>
                  <SelectItem value="price-asc">가격 낮은순</SelectItem>
                  <SelectItem value="viewCount-desc">조회수 높은순</SelectItem>
                  <SelectItem value="viewCount-asc">조회수 낮은순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-4 p-3 bg-tossBlue/10 rounded-lg">
                <span className="text-sm font-medium text-tossBlue">
                  {selectedIds.length}개 선택됨
                </span>
                <div className="flex gap-2">
                  {currentTab === 'deleted' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => selectedIds.forEach(id => handleRestore(id))}
                      >
                        복원
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => selectedIds.forEach(id => handlePermanentDelete(id))}
                        className="text-error hover:text-error"
                      >
                        영구 삭제
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkStatusChange('active')}
                      >
                        판매중으로 변경
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkStatusChange('hidden')}
                      >
                        숨김
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkDelete}
                        className="text-error hover:text-error"
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-grey-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredListings.length > 0 &&
                        selectedIds.length === filteredListings.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">매물번호</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead>지역</TableHead>
                  <TableHead className="text-right">가격</TableHead>
                  <TableHead className="text-center">조회수</TableHead>
                  {currentTab !== 'deleted' && (
                    <TableHead className="text-center">상태</TableHead>
                  )}
                  <TableHead className="text-center">
                    {currentTab === 'deleted' ? '삭제일' : '등록일'}
                  </TableHead>
                  {currentTab === 'deleted' && (
                    <TableHead className="text-center">남은 기간</TableHead>
                  )}
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-grey-500">
                      검색 결과가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredListings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(listing.id)}
                          onCheckedChange={(checked) =>
                            handleSelectOne(listing.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {listing.listing_number || listing.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/listings/${listing.id}`}
                          className="hover:text-tossBlue hover:underline"
                        >
                          {listing.title}
                        </Link>
                      </TableCell>
                      <TableCell>{listing.province}</TableCell>
                      <TableCell className="text-right font-medium">
                        {listing.price_display_text || `${(listing.price_amount || 0).toLocaleString()}원`}
                      </TableCell>
                      <TableCell className="text-center">
                        {(listing.view_count || 0).toLocaleString()}
                      </TableCell>
                      {currentTab !== 'deleted' && (
                        <TableCell className="text-center">
                          {getStatusBadge(listing.status)}
                        </TableCell>
                      )}
                      <TableCell className="text-center text-sm text-grey-600">
                        {currentTab === 'deleted' && listing.deleted_at
                          ? new Date(listing.deleted_at).toLocaleDateString('ko-KR')
                          : new Date(listing.created_at || '').toLocaleDateString('ko-KR')}
                      </TableCell>
                      {currentTab === 'deleted' && (
                        <TableCell className="text-center text-sm">
                          {(() => {
                            const days = getDaysUntilPermanentDelete(listing.deleted_at)
                            return days !== null ? (
                              <span className={days <= 7 ? 'text-error font-medium' : 'text-grey-600'}>
                                {days}일 후 완전 삭제
                              </span>
                            ) : null
                          })()}
                        </TableCell>
                      )}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>작업</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {currentTab === 'deleted' ? (
                              <>
                                <DropdownMenuItem onClick={() => handleRestore(listing.id)}>
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  복원
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handlePermanentDelete(listing.id)}
                                  className="text-error"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  영구 삭제
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/listings/${listing.id}`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    수정
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/listings/${listing.slug}`} target="_blank">
                                    <Eye className="w-4 h-4 mr-2" />
                                    미리보기
                                  </Link>
                                </DropdownMenuItem>
                                {listing.status === 'active' ? (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleToggleStatus(listing.id, listing.status)
                                    }
                                  >
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    숨김
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleToggleStatus(listing.id, listing.status)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    표시
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(listing.id)}
                                  className="text-error"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  삭제
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination - TODO: 실제 페이지네이션 구현 */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-grey-600">
              전체 {filteredListings.length}개 중 1-{Math.min(10, filteredListings.length)}개 표시
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                이전
              </Button>
              <Button variant="outline" size="sm" disabled>
                다음
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
