'use client'

import { useState, useMemo } from 'react'
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
} from 'lucide-react'
import { dummyListings as listings } from '@/lib/dummy-data'
import type { Listing } from '@/lib/types'

type SortField = 'createdAt' | 'price' | 'viewCount'
type SortOrder = 'asc' | 'desc'
type TabStatus = 'all' | 'active' | 'pending' | 'hidden' | 'sold' | 'deleted'

export default function AdminListingsPage() {
  // TODO: 실제로는 Supabase에서 데이터 가져오기
  const [allListings] = useState<Listing[]>(listings)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 탭 및 필터
  const [currentTab, setCurrentTab] = useState<TabStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState<string>('all')

  // 정렬
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // 탭별 카운트
  const tabCounts = useMemo(() => {
    return {
      all: allListings.filter(l => !l.deletedAt).length,
      active: allListings.filter(l => l.status === 'active' && !l.deletedAt).length,
      pending: allListings.filter(l => l.status === 'pending' && !l.deletedAt).length,
      hidden: allListings.filter(l => l.status === 'hidden' && !l.deletedAt).length,
      sold: allListings.filter(l => l.status === 'sold' && !l.deletedAt).length,
      deleted: allListings.filter(l => !!l.deletedAt).length,
    }
  }, [allListings])

  // 필터링 및 정렬된 데이터
  const filteredListings = useMemo(() => {
    let result = [...allListings]

    // 탭 필터 (삭제 여부)
    if (currentTab === 'deleted') {
      result = result.filter(listing => !!listing.deletedAt)
    } else {
      result = result.filter(listing => !listing.deletedAt)

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
          listing.listingNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 지역 필터
    if (locationFilter !== 'all') {
      result = result.filter(
        (listing) => listing.location.province === locationFilter
      )
    }

    // 정렬
    result.sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      if (sortField === 'price') {
        aValue = a.price.amount
        bValue = b.price.amount
      } else if (sortField === 'viewCount') {
        aValue = a.viewCount
        bValue = b.viewCount
      } else {
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
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
  const handleBulkStatusChange = (status: string) => {
    // TODO: Supabase에 일괄 업데이트
    console.log('Bulk status change:', selectedIds, status)
    setSelectedIds([])
  }

  // 삭제 (Soft Delete)
  const handleDelete = (id: string) => {
    // TODO: Supabase에서 soft delete (deletedAt 업데이트)
    console.log('Soft delete listing:', id)
  }

  // 일괄 삭제
  const handleBulkDelete = () => {
    // TODO: Supabase에서 일괄 soft delete
    console.log('Bulk soft delete:', selectedIds)
    setSelectedIds([])
  }

  // 복원
  const handleRestore = (id: string) => {
    // TODO: Supabase에서 복원 (deletedAt null로 변경)
    console.log('Restore listing:', id)
  }

  // 영구 삭제
  const handlePermanentDelete = (id: string) => {
    // TODO: Supabase에서 영구 삭제
    console.log('Permanent delete listing:', id)
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
    return Array.from(new Set(allListings.map((l) => l.location.province)))
  }, [allListings])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-main-xl font-bold text-grey-900">매물 관리</h1>
          <p className="text-body text-grey-600 mt-2">
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
                        {listing.listingNumber || listing.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/listings/${listing.id}`}
                          className="hover:text-tossBlue hover:underline"
                        >
                          {listing.title}
                        </Link>
                      </TableCell>
                      <TableCell>{listing.location.province}</TableCell>
                      <TableCell className="text-right font-medium">
                        {listing.price.displayText}
                      </TableCell>
                      <TableCell className="text-center">
                        {listing.viewCount.toLocaleString()}
                      </TableCell>
                      {currentTab !== 'deleted' && (
                        <TableCell className="text-center">
                          {getStatusBadge(listing.status)}
                        </TableCell>
                      )}
                      <TableCell className="text-center text-sm text-grey-600">
                        {currentTab === 'deleted' && listing.deletedAt
                          ? new Date(listing.deletedAt).toLocaleDateString('ko-KR')
                          : new Date(listing.createdAt).toLocaleDateString('ko-KR')}
                      </TableCell>
                      {currentTab === 'deleted' && (
                        <TableCell className="text-center text-sm">
                          {(() => {
                            const days = getDaysUntilPermanentDelete(listing.deletedAt)
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
                                    onClick={() => console.log('Hide:', listing.id)}
                                  >
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    숨김
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => console.log('Show:', listing.id)}
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
