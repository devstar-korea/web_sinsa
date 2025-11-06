import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-4">매물을 찾을 수 없습니다</h1>
        <p className="text-lg text-slate-600 mb-8">
          요청하신 매물이 존재하지 않거나 이미 삭제되었습니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/listings"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            전체 매물 보기
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
