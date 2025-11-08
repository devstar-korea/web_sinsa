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
} from 'lucide-react'
import { dummyListings as listings } from '@/lib/dummy-data'
import type { Listing } from '@/lib/types'

type SortField = 'createdAt' | 'price' | 'viewCount'
type SortOrder = 'asc' | 'desc'

export default function AdminListingsPage() {
  // TODO: 실제로는 Supabase에서 데이터 가져오기
  const [allListings] = useState<Listing[]>(listings)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 검색 및 필터
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')

  // 정렬
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // 필터링 및 정렬된 데이터
  const filteredListings = useMemo(() => {
    let result = [...allListings]

    // 검색
    if (searchQuery) {
      result = result.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.listingNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      result = result.filter((listing) => listing.status === statusFilter)
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
  }, [allListings, searchQuery, statusFilter, locationFilter, sortField, sortOrder])

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

  // 삭제
  const handleDelete = (id: string) => {
    // TODO: Supabase에서 삭제
    console.log('Delete listing:', id)
  }

  // 일괄 삭제
  const handleBulkDelete = () => {
    // TODO: Supabase에서 일괄 삭제
    console.log('Bulk delete:', selectedIds)
    setSelectedIds([])
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
            전체 {filteredListings.length}개의 매물
          </p>
        </div>
        <Link href="/admin/listings/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            매물 등록
          </Button>
        </Link>
      </div>

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
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="active">판매중</SelectItem>
              <SelectItem value="pending">대기</SelectItem>
              <SelectItem value="hidden">숨김</SelectItem>
              <SelectItem value="sold">거래완료</SelectItem>
            </SelectContent>
          </Select>

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
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center">등록일</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-grey-500">
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
                  <TableCell className="text-center">
                    {getStatusBadge(listing.status)}
                  </TableCell>
                  <TableCell className="text-center text-sm text-grey-600">
                    {new Date(listing.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
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
    </div>
  )
}
