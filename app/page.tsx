'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import FeaturedListings from '@/components/FeaturedListings'
import FeaturedArticles from '@/components/FeaturedArticles'
import SellInquiryModal from '@/components/SellInquiryModal'
import BuyInquiryModal from '@/components/BuyInquiryModal'
import { getAllListings } from '@/lib/api/listings'
import { getFeaturedArticles } from '@/lib/api/articles'
import { Loader2 } from 'lucide-react'
import type { Listing, Article } from '@/lib/types'

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [listingsData, articlesData] = await Promise.all([
        getAllListings(),
        getFeaturedArticles(),
      ])
      setListings(listingsData || [])
      setArticles(articlesData || [])
    } catch (err) {
      console.error('데이터 로딩 실패:', err)
      setListings([])
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-grey-50">
      {/* Hero Section */}
      <section className="bg-tossBlue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-main-xl text-white mb-8">
              <span className="block mb-3">운영 리스크 없이 만실!</span>
              수익 검증된 공유오피스에 투자하세요
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsBuyModalOpen(true)}
                className="px-8 py-4 bg-white text-tossBlue rounded-lg font-medium hover:bg-grey-50 transition-colors shadow-md text-body"
              >
                매물 인수 상담
              </button>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="px-8 py-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors border-2 border-white/30 text-body"
              >
                매각 상담
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sub text-grey-900 leading-relaxed">
              <span className="block mb-2">입주 대기 고객 리스트까지 노하우 전수!</span>
              초보자도 바로 고수익 오너가 되는 안정적인 운영 시스템을 인수하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <FeaturedListings initialListings={listings} />

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-main-lg mb-2">
              쉐어존 거래 프로세스
            </h2>
            <p className="text-body text-grey-600">전문 디렉터와 함께하는 3단계 거래</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-6 bg-grey-50 rounded-lg">
              <div className="w-14 h-14 bg-tossBlue/10 text-tossBlue rounded-full flex items-center justify-center text-main font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-sub font-semibold text-grey-900 mb-2">
                매각 상담
              </h3>
              <p className="text-body text-grey-600">
                전문 디렉터 배정 및
                <br />
                매물 안내 자료(IM) 작성
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6 bg-grey-50 rounded-lg">
              <div className="w-14 h-14 bg-tossBlue/10 text-tossBlue rounded-full flex items-center justify-center text-main font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-sub font-semibold text-grey-900 mb-2">인수자 매칭</h3>
              <p className="text-body text-grey-600">
                예비 인수자 브리핑 및
                <br />
                현장 답사·평가 진행
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 bg-grey-50 rounded-lg">
              <div className="w-14 h-14 bg-tossBlue/10 text-tossBlue rounded-full flex items-center justify-center text-main font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-sub font-semibold text-grey-900 mb-2">계약 체결</h3>
              <p className="text-body text-grey-600">
                계약 체결까지 디렉팅 제공
                <br />
                모든 과정 전문가와 함께
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-tossBlue text-white rounded-lg font-medium hover:bg-primary-600 transition-colors text-body"
            >
              매각 상담 시작하기
            </button>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <FeaturedArticles initialArticles={articles} />

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-tossBlue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-main-lg text-white mb-4">
            공유오피스 매각이나 창업을 고민 중이신가요?
          </h2>
          <p className="text-body text-white/90 mb-8">
            전문 상담을 통해 최적의 거래 조건을 찾아드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="px-8 py-4 bg-white text-tossBlue rounded-lg font-medium hover:bg-grey-50 transition-colors text-body"
            >
              매각 상담
            </button>
            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="px-8 py-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors border-2 border-white/30 text-body"
            >
              매물 인수 상담
            </button>
          </div>
        </div>
      </section>

      {/* Inquiry Modals */}
      <SellInquiryModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
      />
      <BuyInquiryModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </div>
  )
}
