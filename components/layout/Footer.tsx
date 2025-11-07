'use client'

import { useState } from 'react'
import Link from 'next/link'
import SellInquiryModal from '@/components/SellInquiryModal'
import BuyInquiryModal from '@/components/BuyInquiryModal'

export default function Footer() {
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)

  return (
    <footer className="bg-grey-100 text-grey-600 border-t border-grey-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <span className="text-main font-bold text-tossBlue tracking-tight">SHARE ZONE</span>
            </div>
            <p className="text-body text-grey-500 mb-4">
              공유오피스 M&A 전문 플랫폼
              <br />
              매각부터 인수까지, 전문 디렉터와 함께
            </p>
            <div className="space-y-1.5 text-body">
              <p>
                <span className="text-grey-500">법인명:</span> <span className="text-grey-600">주식회사 데브스타</span>
              </p>
              <p>
                <span className="text-grey-500">Tel:</span> <span className="text-grey-600">02-2039-2079</span>
              </p>
              <p>
                <span className="text-grey-500">사업자등록번호:</span> <span className="text-grey-600">837-86-02326</span>
              </p>
              <p>
                <span className="text-grey-500">웹사이트:</span> <span className="text-grey-600">https://sharezone.kr</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sub font-semibold text-grey-800 mb-4">바로가기</h3>
            <ul className="space-y-2 text-body">
              <li>
                <Link
                  href="/listings"
                  className="text-grey-600 hover:text-tossBlue transition-colors"
                >
                  매물 보기
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-grey-600 hover:text-tossBlue transition-colors"
                >
                  비즈니스 인사이트
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsSellModalOpen(true)}
                  className="text-grey-600 hover:text-tossBlue transition-colors"
                >
                  매각 상담
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsBuyModalOpen(true)}
                  className="text-grey-600 hover:text-tossBlue transition-colors"
                >
                  매물 인수 상담
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sub font-semibold text-grey-800 mb-4">법적고지</h3>
            <ul className="space-y-2 text-body">
              <li>
                <Link
                  href="/terms"
                  className="text-grey-600 hover:text-tossBlue transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-grey-600 hover:text-tossBlue transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-grey-600 hover:text-tossBlue transition-colors"
                >
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-grey-300 text-body text-grey-500 text-center">
          <p>&copy; 2021 쉐어존 (SHAREZONE) | 주식회사 데브스타. All rights reserved.</p>
        </div>
      </div>

      {/* Inquiry Modals */}
      <SellInquiryModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
      />
      <BuyInquiryModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </footer>
  )
}
