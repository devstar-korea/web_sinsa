import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getListingBySlug, getListingsByProvince } from '@/lib/api/listings'
import ListingCard from '@/components/ListingCard'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params

  // Supabase에서 매물 조회
  let listing
  try {
    listing = await getListingBySlug(slug)
  } catch (error) {
    notFound()
  }

  if (!listing) {
    notFound()
  }

  // 같은 지역의 다른 매물 추천 (최대 3개)
  const allProvinceListings = await getListingsByProvince(listing.location.province)
  const relatedListings = (allProvinceListings || [])
    .filter((l) => l.id !== listing.id)
    .slice(0, 3)

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-primary-600">
              홈
            </Link>
            <span>/</span>
            <Link href="/listings" className="hover:text-primary-600">
              매물 목록
            </Link>
            <span>/</span>
            <span className="text-slate-900">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-lg overflow-hidden border border-slate-200 mb-6">
              <div className="relative h-96 bg-slate-100">
                <img
                  src={listing.thumbnail.url}
                  alt={listing.thumbnail.alt}
                  className="w-full h-full object-cover"
                />
                {listing.isPremium && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-warning-DEFAULT text-white rounded-full text-sm font-semibold">
                      프리미엄
                    </span>
                  </div>
                )}
                {listing.status === 'sold' && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">거래완료</span>
                  </div>
                )}
              </div>

              {/* Image Gallery */}
              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50">
                  {listing.images.slice(1, 4).map((image) => (
                    <div key={image.order} className="relative h-24 bg-slate-100 rounded overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title and Location */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                {listing.title}
              </h1>

              <div className="flex items-center text-slate-600 mb-4">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {listing.location.province}
                </span>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200">
                <div>
                  <div className="text-sm text-slate-600 mb-1">면적</div>
                  <div className="font-semibold text-slate-900">
                    {listing.area.squareMeter}㎡
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">개업일</div>
                  <div className="font-semibold text-slate-900">
                    {new Date(listing.openedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-3">매물 설명</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description || listing.shortDescription}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">추가 정보</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-slate-600 mb-1">매물 ID</dt>
                  <dd className="font-medium text-slate-900">{listing.id}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-600 mb-1">등록일</dt>
                  <dd className="font-medium text-slate-900">
                    {new Date(listing.createdAt).toLocaleDateString('ko-KR')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-600 mb-1">수정일</dt>
                  <dd className="font-medium text-slate-900">
                    {new Date(listing.updatedAt).toLocaleDateString('ko-KR')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-600 mb-1">조회수</dt>
                  <dd className="font-medium text-slate-900">
                    {listing.viewCount.toLocaleString()}회
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-20">
              {/* 재정 정보 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">투자 정보</h3>

                {/* 권리금 */}
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-sm text-slate-600">권리금</span>
                  <span className="text-xl font-bold text-slate-900">
                    {(listing.premiumAmount / 10000).toLocaleString()}만원
                  </span>
                </div>

                {/* 월수익 */}
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-sm text-slate-600">월수익</span>
                  <span className="text-xl font-bold text-primary-600">
                    {(listing.monthlyProfit / 10000).toLocaleString()}만원
                  </span>
                </div>

                {/* 총 투자비용 - 가장 강조 */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-medium text-slate-700">총 투자비용</span>
                    <span className="text-3xl font-bold text-slate-900">
                      {(listing.totalInvestment / 100000000).toFixed(1)}억원
                    </span>
                  </div>
                  {listing.price.isNegotiable && (
                    <div className="mt-2 text-right">
                      <span className="text-sm text-primary-600 font-medium">협의가능</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                <Link
                  href="/inquiry/purchase"
                  className="block w-full px-6 py-3 bg-primary-600 text-white text-center rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  매수 상담 신청
                </Link>
                <button className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                  관심 매물 저장
                </button>
              </div>

              {/* Contact Info */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">문의하기</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-slate-600">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>02-1234-5678</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>contact@sinsamuso.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {listing.location.province} 지역 다른 매물
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedListings.map((relatedListing) => (
                <ListingCard key={relatedListing.id} listing={relatedListing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
