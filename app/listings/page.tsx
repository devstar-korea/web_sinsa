'use client'

import { useState, useMemo, useEffect } from 'react'
import ListingCard from '@/components/ListingCard'
import { getAllListings } from '@/lib/api/listings'
import { Listing } from '@/lib/types'
import { Loader2 } from 'lucide-react'

type SortOption = 'area_large' | 'area_small'

// 한국 지역 목록 (가나다순 정렬)
const koreanLocations = [
  { value: '강원', label: '강원도 (전체)', type: 'province' },
  { value: '강원-원주', label: '강원 원주시', type: 'city' },
  { value: '강원-춘천', label: '강원 춘천시', type: 'city' },
  { value: '경기', label: '경기도 (전체)', type: 'province' },
  { value: '경기-고양', label: '경기 고양시', type: 'city' },
  { value: '경기-남양주', label: '경기 남양주시', type: 'city' },
  { value: '경기-부천', label: '경기 부천시', type: 'city' },
  { value: '경기-성남', label: '경기 성남시', type: 'city' },
  { value: '경기-수원', label: '경기 수원시', type: 'city' },
  { value: '경기-안산', label: '경기 안산시', type: 'city' },
  { value: '경기-안양', label: '경기 안양시', type: 'city' },
  { value: '경기-용인', label: '경기 용인시', type: 'city' },
  { value: '경기-평택', label: '경기 평택시', type: 'city' },
  { value: '경기-화성', label: '경기 화성시', type: 'city' },
  { value: '경남', label: '경상남도 (전체)', type: 'province' },
  { value: '경남-김해', label: '경남 김해시', type: 'city' },
  { value: '경남-창원', label: '경남 창원시', type: 'city' },
  { value: '경북', label: '경상북도 (전체)', type: 'province' },
  { value: '경북-포항', label: '경북 포항시', type: 'city' },
  { value: '광주', label: '광주광역시', type: 'metro' },
  { value: '대구', label: '대구광역시', type: 'metro' },
  { value: '대전', label: '대전광역시', type: 'metro' },
  { value: '부산', label: '부산광역시', type: 'metro' },
  { value: '서울', label: '서울특별시', type: 'metro' },
  { value: '세종', label: '세종특별자치시', type: 'metro' },
  { value: '울산', label: '울산광역시', type: 'metro' },
  { value: '인천', label: '인천광역시', type: 'metro' },
  { value: '전남', label: '전라남도 (전체)', type: 'province' },
  { value: '전북', label: '전북특별자치도 (전체)', type: 'province' },
  { value: '전북-전주', label: '전북 전주시', type: 'city' },
  { value: '제주', label: '제주특별자치도', type: 'province' },
  { value: '충남', label: '충청남도 (전체)', type: 'province' },
  { value: '충남-천안', label: '충남 천안시', type: 'city' },
  { value: '충북', label: '충청북도 (전체)', type: 'province' },
  { value: '충북-청주', label: '충북 청주시', type: 'city' },
].sort((a, b) => a.label.localeCompare(b.label, 'ko-KR'))

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('area_large')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    try {
      setIsLoading(true)
      const data = await getAllListings()
      setListings(data || [])
    } catch (err) {
      console.error('매물 목록 로딩 실패:', err)
      setListings([])
    } finally {
      setIsLoading(false)
    }
  }

  // 필터링 및 정렬된 매물 목록
  const filteredAndSortedListings = useMemo(() => {
    let filtered = listings.filter((listing) => {
      // 지역 필터
      if (selectedLocation === 'all') {
        return true
      }

      // province 필드 사용 (district 정보는 현재 스키마에서는 별도 필터링 불가)
      const province = listing.province

      // 정확히 일치하는 경우 (예: 서울, 경기 등)
      if (province === selectedLocation) {
        return true
      }

      return false
    })

    // 정렬 (면적 기준만)
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'area_large':
          return (b.area_pyeong || 0) - (a.area_pyeong || 0)
        case 'area_small':
          return (a.area_pyeong || 0) - (b.area_pyeong || 0)
        default:
          return 0
      }
    })

    return sorted
  }, [listings, selectedLocation, sortBy])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">매물 목록</h1>
          <p className="text-slate-600">
            전체 <span className="font-semibold text-primary-600">{filteredAndSortedListings.length}</span>개 매물
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">필터</h2>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  지역
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">전국</option>
                  {koreanLocations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSelectedLocation('all')
                }}
                className="w-full px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                필터 초기화
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                필터
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-sm text-slate-600">정렬:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="flex-1 sm:flex-none px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="area_large">면적 큰순</option>
                  <option value="area_small">면적 작은순</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-lg border border-slate-200 p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">필터</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      지역
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">전국</option>
                      {koreanLocations.map((location) => (
                        <option key={location.value} value={location.value}>
                          {location.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedLocation('all')
                    }}
                    className="w-full px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    필터 초기화
                  </button>
                </div>
              </div>
            )}

            {/* Listings Grid */}
            {filteredAndSortedListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-slate-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-slate-600 mb-2">
                  {listings.length === 0 ? '현재 등록된 데이터가 없습니다' : '해당하는 매물이 없습니다'}
                </p>
                <p className="text-sm text-slate-500">
                  {listings.length === 0 ? 'Supabase에 테스트 데이터를 삽입해주세요' : '필터 조건을 변경해보세요'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
