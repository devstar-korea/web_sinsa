import Link from 'next/link'
import Image from 'next/image'
import { ListingCard as ListingCardType } from '@/lib/types'

interface ListingCardProps {
  listing: ListingCardType
}

export default function ListingCard({ listing }: ListingCardProps) {
  // id에서 숫자를 추출하여 매물번호 생성 (예: listing-001 -> SZ-0001)
  const listingNumber = (listing.listingNumber || `sz-${listing.id.replace(/\D/g, '').padStart(4, '0')}`).toUpperCase()

  return (
    <Link href={`/listings/${listing.slug}`} className="group block h-full">
      <div className="bg-white rounded-lg overflow-hidden border border-grey-200 hover:border-tossBlue transition-all hover:shadow-md flex flex-col h-full">
        {/* Listing Number - Above Image */}
        <div className="px-4 pt-4 pb-2">
          <span className="inline-block px-3 py-1.5 bg-grey-100 text-grey-700 rounded-md text-body font-medium border border-grey-200">
            {listingNumber}
          </span>
        </div>

        {/* Thumbnail */}
        <div className="relative h-48 bg-grey-100 overflow-hidden flex-shrink-0">
          <img
            src={listing.thumbnail.url}
            alt={listing.thumbnail.alt}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
          />

          {listing.status === 'sold' && (
            <div className="absolute inset-0 bg-grey-900/60 flex items-center justify-center">
              <span className="text-white font-bold text-xl">거래완료</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-sub font-semibold text-grey-900 mb-3 line-clamp-2 group-hover:text-tossBlue transition-colors">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-body text-grey-600 mb-3">
            <svg
              className="w-4 h-4 mr-1.5"
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
            <span>{listing.location.province}</span>
          </div>

          {/* Area */}
          <div className="mb-3">
            <span className="text-body text-grey-600">{listing.area.squareMeter}㎡</span>
          </div>

          {/* 재정 정보 - 강조 */}
          <div className="space-y-2.5 mb-3 mt-auto">
            {/* 권리금 */}
            <div className="flex items-baseline justify-between">
              <span className="text-body text-grey-600">권리금</span>
              <span className="text-sub font-bold text-grey-900">
                {(listing.premiumAmount / 10000).toLocaleString()}만원
              </span>
            </div>

            {/* 월수익 */}
            <div className="flex items-baseline justify-between">
              <span className="text-body text-grey-600">월수익</span>
              <span className="text-sub font-bold text-tossBlue">
                {(listing.monthlyProfit / 10000).toLocaleString()}만원
              </span>
            </div>
          </div>

          {/* 총 투자비용 - 가장 강조 */}
          <div className="pt-3 border-t border-grey-200">
            <div className="flex items-baseline justify-between">
              <span className="text-body font-medium text-grey-700">총 투자비용</span>
              <span className="text-main font-bold text-grey-900">
                {(listing.totalInvestment / 100000000).toFixed(1)}억원
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
