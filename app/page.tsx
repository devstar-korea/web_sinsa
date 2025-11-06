import Link from 'next/link'
import ListingCard from '@/components/ListingCard'
import ArticleCard from '@/components/ArticleCard'
import { getLatestListings, getFeaturedArticles } from '@/lib/dummy-data'

export default function Home() {
  const latestListings = getLatestListings(6)
  const featuredArticles = getFeaturedArticles().slice(0, 3)

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              공유오피스 거래,
              <br />
              이제 안전하고 쉽게
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              공유오피스 운영자들이 사업장을 안전하고 효율적으로
              <br className="hidden sm:block" />
              매각할 수 있는 전문 거래 플랫폼
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/listings"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
              >
                매물 둘러보기
              </Link>
              <Link
                href="/inquiry/register"
                className="px-8 py-4 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white/30"
              >
                매물 등록 상담
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">최신 매물</h2>
              <p className="text-slate-600">지금 거래 가능한 공유오피스를 확인하세요</p>
            </div>
            <Link
              href="/listings"
              className="hidden sm:flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              전체보기
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/listings"
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              전체보기
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              신사무소 거래 프로세스
            </h2>
            <p className="text-slate-600">간편하고 안전한 3단계 거래</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                매물 등록 상담
              </h3>
              <p className="text-slate-600">
                매각하려는 공유오피스 정보를 등록하고
                <br />
                전문 상담을 받으세요
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">매물 공개</h3>
              <p className="text-slate-600">
                검증된 매물 정보가 플랫폼에 공개되어
                <br />
                관심있는 구매자를 찾습니다
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">안전한 거래</h3>
              <p className="text-slate-600">
                전문가 중개로 계약서 검토부터
                <br />
                권리 이전까지 안전하게 완료
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/inquiry/register"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              매물 등록 상담 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">정보 콘텐츠</h2>
              <p className="text-slate-600">
                공유오피스 창업·운영·매각 노하우를 확인하세요
              </p>
            </div>
            <Link
              href="/articles"
              className="hidden sm:flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              전체보기
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/articles"
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              전체보기
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            공유오피스 매각을 고민 중이신가요?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            전문 상담을 통해 최적의 거래 조건을 찾아드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inquiry/register"
              className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              매물 등록 상담
            </Link>
            <Link
              href="/inquiry/purchase"
              className="px-8 py-4 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white/30"
            >
              매수 상담
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
