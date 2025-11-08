'use client'

import { useState } from 'react'
import ListingCard from './ListingCard'
import { ListingCard as ListingCardType } from '@/lib/types'

interface FeaturedListingsProps {
  initialListings: ListingCardType[]
}

export default function FeaturedListings({ initialListings }: FeaturedListingsProps) {
  const [displayCount, setDisplayCount] = useState(6)
  const [bouncing, setBouncing] = useState(false)
  const itemsPerLoad = 3 // 항상 3개씩 로드

  const handleLoadMore = () => {
    if (displayCount >= initialListings.length) {
      // 더 이상 아이템이 없을 때 바운스 애니메이션
      setBouncing(true)
      setTimeout(() => setBouncing(false), 600)
    } else {
      setDisplayCount((prev) => Math.min(prev + itemsPerLoad, initialListings.length))
    }
  }

  const hasMore = displayCount < initialListings.length

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-main-lg mb-2">최신 매물</h2>
            <p className="text-body text-grey-600">지금 거래 가능한 공유오피스를 확인하세요</p>
          </div>
        </div>

        {initialListings.length === 0 ? (
          <div className="bg-white rounded-lg border border-grey-200 p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-grey-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-grey-600 mb-2">현재 등록된 데이터가 없습니다</p>
            <p className="text-sm text-grey-500">Supabase에 테스트 데이터를 삽입해주세요</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 lg:gap-6 items-stretch">
              {initialListings.slice(0, displayCount).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                className={`inline-flex items-center px-8 py-3 bg-white border-2 border-tossBlue text-tossBlue rounded-lg font-medium hover:bg-grey-50 transition-colors text-body ${
                  bouncing ? 'animate-bounce' : ''
                }`}
              >
                더보기
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
