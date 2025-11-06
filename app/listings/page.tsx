'use client'

import { useState, useMemo } from 'react'
import ListingCard from '@/components/ListingCard'
import { dummyListings } from '@/lib/dummy-data'
import { Listing } from '@/lib/types'

type SortOption = 'latest' | 'oldest' | 'price_low' | 'price_high' | 'area_large' | 'area_small'

export default function ListingsPage() {
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [showFilters, setShowFilters] = useState(false)

  // 고유한 도시 목록 추출
  const cities = useMemo(() => {
    const citySet = new Set(dummyListings.map((listing) => listing.location.city))
    return Array.from(citySet).sort()
  }, [])

  // 필터링 및 정렬된 매물 목록
  const filteredAndSortedListings = useMemo(() => {
    let filtered = dummyListings.filter((listing) => {
      // 도시 필터
      if (selectedCity !== 'all' && listing.location.city !== selectedCity) {
        return false
      }

      // 상태 필터
      if (selectedStatus !== 'all' && listing.status !== selectedStatus) {
        return false
      }

      return true
    })

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'price_low':
          return a.price.amount - b.price.amount
        case 'price_high':
          return b.price.amount - a.price.amount
        case 'area_large':
          return b.area.pyeong - a.area.pyeong
        case 'area_small':
          return a.area.pyeong - b.area.pyeong
        default:
          return 0
      }
    })

    return sorted
  }, [selectedCity, selectedStatus, sortBy])

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

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  지역
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">전체</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  상태
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">전체</option>
                  <option value="active">판매중</option>
                  <option value="pending">검토중</option>
                  <option value="sold">거래완료</option>
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSelectedCity('all')
                  setSelectedStatus('all')
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
                  <option value="latest">최신순</option>
                  <option value="oldest">오래된순</option>
                  <option value="price_low">가격 낮은순</option>
                  <option value="price_high">가격 높은순</option>
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
                  {/* City Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      지역
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">전체</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      상태
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">전체</option>
                      <option value="active">판매중</option>
                      <option value="pending">검토중</option>
                      <option value="sold">거래완료</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCity('all')
                      setSelectedStatus('all')
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
                <p className="text-slate-600 mb-2">해당하는 매물이 없습니다</p>
                <p className="text-sm text-slate-500">필터 조건을 변경해보세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
