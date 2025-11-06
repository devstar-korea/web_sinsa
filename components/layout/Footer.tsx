import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">신</span>
              </div>
              <span className="text-xl font-bold text-white">신사무소</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              공유오피스 운영자들이 사업장을 안전하고 효율적으로
              <br />
              매각할 수 있는 전문 거래 플랫폼
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-500">대표:</span> 홍길동
              </p>
              <p>
                <span className="text-slate-500">사업자등록번호:</span> 123-45-67890
              </p>
              <p>
                <span className="text-slate-500">이메일:</span> contact@sinsamuso.com
              </p>
              <p>
                <span className="text-slate-500">전화:</span> 02-1234-5678
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/listings"
                  className="hover:text-primary-400 transition-colors"
                >
                  매물 보기
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="hover:text-primary-400 transition-colors"
                >
                  정보 콘텐츠
                </Link>
              </li>
              <li>
                <Link
                  href="/inquiry/register"
                  className="hover:text-primary-400 transition-colors"
                >
                  매물 등록 상담
                </Link>
              </li>
              <li>
                <Link
                  href="/inquiry/purchase"
                  className="hover:text-primary-400 transition-colors"
                >
                  매수 상담
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">법적고지</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary-400 transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary-400 transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary-400 transition-colors"
                >
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center">
          <p>&copy; 2025 신사무소. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
