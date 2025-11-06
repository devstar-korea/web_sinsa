'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">신</span>
            </div>
            <span className="text-xl font-bold text-slate-900">신사무소</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/listings"
              className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
            >
              매물 보기
            </Link>
            <Link
              href="/articles"
              className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
            >
              정보 콘텐츠
            </Link>
            <Link
              href="/inquiry/register"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              매물 등록 상담
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-primary-600"
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
          <div className="md:hidden py-4 border-t border-slate-200">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/listings"
                className="px-3 py-2 text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                매물 보기
              </Link>
              <Link
                href="/articles"
                className="px-3 py-2 text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                정보 콘텐츠
              </Link>
              <Link
                href="/inquiry/register"
                className="px-3 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                매물 등록 상담
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
