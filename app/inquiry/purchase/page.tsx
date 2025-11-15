'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// ============================================
// SearchParams Client Component
// ============================================
// useSearchParams를 사용하는 컴포넌트를 별도로 분리
// Next.js 16: Suspense boundary 필수

function SearchParamsReader({ onListingId }: { onListingId: (id: string | null) => void }) {
  const searchParams = useSearchParams()
  const listingId = searchParams.get('listingId')

  // 부모 컴포넌트에 listingId 전달
  useEffect(() => {
    onListingId(listingId)
  }, [listingId, onListingId])

  return null
}

export default function PurchaseInquiryPage() {
  const router = useRouter()
  const [listingId, setListingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    purpose: [] as string[],
    message: '',
    budget: '',
    preferredTime: '',
    hasExperience: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const purposeOptions = [
    { value: 'investment', label: '투자 목적' },
    { value: 'business', label: '사업 운영' },
    { value: 'consultation', label: '일반 상담' },
    { value: 'viewing', label: '현장 방문' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/inquiry/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          listingId: listingId || 'general',
          deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
        }),
      })

      if (!response.ok) {
        throw new Error('상담 신청에 실패했습니다.')
      }

      // 성공 시 감사 페이지로 이동
      router.push('/inquiry/thank-you')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '문제가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePurposeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      purpose: prev.purpose.includes(value)
        ? prev.purpose.filter(p => p !== value)
        : [...prev.purpose, value]
    }))
  }

  return (
    <div className="bg-grey-50 min-h-screen py-12">
      {/* Suspense boundary for useSearchParams */}
      <Suspense fallback={null}>
        <SearchParamsReader onListingId={setListingId} />
      </Suspense>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/listings" className="text-caption text-tossBlue hover:underline mb-4 inline-block">
            ← 매물 목록으로 돌아가기
          </Link>
          <h1 className="text-display-md md:text-display-lg text-grey-900 mb-4">
            매수 상담 신청
          </h1>
          <p className="text-body text-grey-600">
            공유오피스 매수에 관심있으시다면 아래 양식을 작성해 주세요.<br />
            전문 디렉터가 상세히 상담해 드립니다.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-grey-200 p-8 shadow-sm">
          {/* 이름 */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sub font-semibold text-grey-900 mb-2">
              이름 <span className="text-error-DEFAULT">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 text-body border border-grey-300 rounded-lg focus:ring-2 focus:ring-tossBlue focus:border-transparent"
              placeholder="홍길동"
            />
          </div>

          {/* 연락처 */}
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sub font-semibold text-grey-900 mb-2">
              연락처 <span className="text-error-DEFAULT">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 text-body border border-grey-300 rounded-lg focus:ring-2 focus:ring-tossBlue focus:border-transparent"
              placeholder="010-1234-5678"
            />
          </div>

          {/* 이메일 */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sub font-semibold text-grey-900 mb-2">
              이메일 <span className="text-error-DEFAULT">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 text-body border border-grey-300 rounded-lg focus:ring-2 focus:ring-tossBlue focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          {/* 상담 목적 */}
          <div className="mb-6">
            <label className="block text-sub font-semibold text-grey-900 mb-3">
              상담 목적 <span className="text-error-DEFAULT">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {purposeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-4 border border-grey-300 rounded-lg cursor-pointer hover:border-tossBlue transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.purpose.includes(option.value)}
                    onChange={() => handlePurposeChange(option.value)}
                    className="w-5 h-5 text-tossBlue border-grey-300 rounded focus:ring-tossBlue"
                  />
                  <span className="ml-3 text-body text-grey-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 예산 범위 */}
          <div className="mb-6">
            <label htmlFor="budget" className="block text-sub font-semibold text-grey-900 mb-2">
              예산 범위
            </label>
            <select
              id="budget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-3 text-body border border-grey-300 rounded-lg focus:ring-2 focus:ring-tossBlue focus:border-transparent"
            >
              <option value="">선택해주세요</option>
              <option value="under-3">3억 이하</option>
              <option value="3-5">3억 ~ 5억</option>
              <option value="5-10">5억 ~ 10억</option>
              <option value="over-10">10억 이상</option>
            </select>
          </div>

          {/* 선호 상담 시간 */}
          <div className="mb-6">
            <label htmlFor="preferredTime" className="block text-sub font-semibold text-grey-900 mb-2">
              선호 상담 시간
            </label>
            <input
              type="text"
              id="preferredTime"
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="w-full px-4 py-3 text-body border border-grey-300 rounded-lg focus:ring-2 focus:ring-tossBlue focus:border-transparent"
              placeholder="예: 평일 오후 2-5시"
            />
          </div>

          {/* 운영 경험 */}
          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasExperience}
                onChange={(e) => setFormData({ ...formData, hasExperience: e.target.checked })}
                className="w-5 h-5 text-tossBlue border-grey-300 rounded focus:ring-tossBlue"
              />
              <span className="ml-3 text-body text-grey-900">
                공유오피스 운영 경험이 있습니다
              </span>
            </label>
          </div>

          {/* 문의 내용 */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sub font-semibold text-grey-900 mb-2">
              문의 내용 <span className="text-error-DEFAULT">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 text-body border border-grey-300 rounded-lg focus:ring-2 focus:ring-tossBlue focus:border-transparent resize-none"
              placeholder="궁금하신 사항을 자유롭게 작성해 주세요."
            />
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-error-light border border-error-DEFAULT rounded-lg">
              <p className="text-body text-error-dark">{submitError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || formData.purpose.length === 0}
            className="w-full px-8 py-4 bg-tossBlue text-white text-body font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:bg-grey-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '전송 중...' : '상담 신청하기'}
          </button>

          <p className="mt-4 text-caption text-grey-600 text-center">
            개인정보는 상담 목적으로만 사용되며 안전하게 보호됩니다.
          </p>
        </form>
      </div>
    </div>
  )
}
