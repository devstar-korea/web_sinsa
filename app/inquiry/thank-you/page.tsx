'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function ThankYouPage() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = '/listings'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-grey-50 min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <CheckCircle className="w-24 h-24 text-success-DEFAULT" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-display-md md:text-display-lg text-grey-900 mb-6">
          상담 신청이 완료되었습니다
        </h1>

        {/* Message */}
        <div className="bg-white rounded-lg border border-grey-200 p-8 shadow-sm mb-8">
          <p className="text-sub text-grey-800 mb-4">
            감사합니다!
          </p>
          <p className="text-body text-grey-600 mb-6">
            귀하의 상담 신청이 성공적으로 접수되었습니다.<br />
            전문 디렉터가 영업일 기준 1-2일 내에 연락드릴 예정입니다.
          </p>

          <div className="bg-grey-50 rounded-lg p-6 mb-6">
            <p className="text-body-sm text-grey-700 mb-2">
              <strong>다음 단계:</strong>
            </p>
            <ul className="text-body-sm text-grey-600 text-left space-y-2">
              <li className="flex items-start">
                <span className="text-tossBlue mr-2">1.</span>
                <span>디렉터가 귀하의 연락처로 전화 또는 이메일로 연락드립니다</span>
              </li>
              <li className="flex items-start">
                <span className="text-tossBlue mr-2">2.</span>
                <span>상담 일정을 조율하고 세부 정보를 논의합니다</span>
              </li>
              <li className="flex items-start">
                <span className="text-tossBlue mr-2">3.</span>
                <span>필요시 현장 방문 일정을 잡습니다</span>
              </li>
            </ul>
          </div>

          <p className="text-caption text-grey-500">
            문의사항이 있으시면 언제든지 연락 주시기 바랍니다.
          </p>
        </div>

        {/* Auto Redirect Notice */}
        <p className="text-body text-grey-600 mb-6">
          {countdown}초 후 매물 목록으로 자동 이동합니다.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/listings"
            className="px-8 py-3 bg-tossBlue text-white text-body font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            매물 목록 보기
          </Link>
          <Link
            href="/"
            className="px-8 py-3 bg-white border border-grey-300 text-grey-700 text-body font-semibold rounded-lg hover:bg-grey-50 transition-colors"
          >
            홈으로 가기
          </Link>
        </div>
      </div>
    </div>
  )
}
