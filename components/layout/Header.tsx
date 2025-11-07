'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SellInquiryModal from '@/components/SellInquiryModal'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-grey-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-main font-bold text-tossBlue tracking-tight">SHARE ZONE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/listings"
              className="text-body text-grey-700 hover:text-tossBlue font-bold transition-colors"
            >
              매물 보기
            </Link>
            <Link
              href="/articles"
              className="text-body text-grey-700 hover:text-tossBlue font-bold transition-colors"
            >
              비즈니스 인사이트
            </Link>
            <Button
              onClick={() => setIsSellModalOpen(true)}
              size="lg"
              className="text-body font-medium"
            >
              매각 상담
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-grey-700 hover:text-tossBlue"
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-grey-200">
            <nav className="flex flex-col gap-2">
              <Link
                href="/listings"
                className="px-3 py-2 text-body text-grey-700 hover:text-tossBlue hover:bg-grey-50 rounded-lg font-bold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                매물 보기
              </Link>
              <Link
                href="/articles"
                className="px-3 py-2 text-body text-grey-700 hover:text-tossBlue hover:bg-grey-50 rounded-lg font-bold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                비즈니스 인사이트
              </Link>
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsSellModalOpen(true)
                }}
                className="text-body font-medium w-full"
              >
                매각 상담
              </Button>
            </nav>
          </div>
        )}
      </div>

      {/* Sell Inquiry Modal */}
      <SellInquiryModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
      />
    </header>
  )
}
