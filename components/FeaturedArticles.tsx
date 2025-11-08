'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ArticleCard from './ArticleCard'
import { Article } from '@/lib/types'

interface FeaturedArticlesProps {
  initialArticles: Article[]
}

export default function FeaturedArticles({ initialArticles }: FeaturedArticlesProps) {
  const [displayCount, setDisplayCount] = useState(3)
  const [itemsPerLoad, setItemsPerLoad] = useState(3)
  const [bouncing, setBouncing] = useState(false)

  // 반응형 로딩 개수 설정
  useEffect(() => {
    const updateItemsPerLoad = () => {
      if (window.innerWidth >= 1024) {
        // PC (lg breakpoint)
        setItemsPerLoad(6)
      } else if (window.innerWidth >= 768) {
        // Tablet (md breakpoint)
        setItemsPerLoad(6)
      } else {
        // Mobile
        setItemsPerLoad(3)
      }
    }

    updateItemsPerLoad()
    window.addEventListener('resize', updateItemsPerLoad)
    return () => window.removeEventListener('resize', updateItemsPerLoad)
  }, [])

  const handleLoadMore = () => {
    if (displayCount >= initialArticles.length) {
      // 더 이상 아이템이 없을 때 바운스 애니메이션
      setBouncing(true)
      setTimeout(() => setBouncing(false), 600)
    } else {
      setDisplayCount((prev) => Math.min(prev + itemsPerLoad, initialArticles.length))
    }
  }

  const hasMore = displayCount < initialArticles.length

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-main-lg mb-2">비즈니스 인사이트</h2>
            <p className="text-body text-grey-600">
              공유오피스 창업·운영·매각 노하우를 확인하세요
            </p>
          </div>
        </div>

        {initialArticles.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-grey-600 mb-2">현재 등록된 데이터가 없습니다</p>
            <p className="text-sm text-grey-500">Supabase에 테스트 데이터를 삽입해주세요</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {initialArticles.slice(0, displayCount).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <div className="mt-8 text-center">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center px-8 py-3 bg-white border-2 border-tossBlue text-tossBlue rounded-lg font-medium hover:bg-grey-50 transition-colors text-body"
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
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={handleLoadMore}
                    className={`inline-flex items-center px-8 py-3 bg-grey-100 text-grey-500 rounded-lg font-medium cursor-default text-body ${
                      bouncing ? 'animate-bounce' : ''
                    }`}
                  >
                    모든 콘텐츠를 확인했습니다
                  </button>
                  <Link
                    href="/articles"
                    className="text-body text-tossBlue font-medium hover:text-primary-600"
                  >
                    전체 콘텐츠 보기 →
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
