import Link from 'next/link'
import Image from 'next/image'
import { ListingCard as ListingCardType } from '@/lib/types'

interface ListingCardProps {
  listing: ListingCardType
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-primary-300 transition-all hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative h-48 bg-slate-100 overflow-hidden">
          <img
            src={listing.thumbnail.url}
            alt={listing.thumbnail.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {listing.status === 'sold' && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
              <span className="text-white font-bold text-xl">거래완료</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-sm text-slate-600 mb-3">
            <svg
              className="w-4 h-4 mr-1"
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
            <span>{listing.location.displayLocation}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
            <div className="flex items-center space-x-3">
              <span>{listing.area.pyeong}평</span>
              <span className="text-slate-300">|</span>
              <span>{listing.totalSeats}석</span>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                listing.operatingStatus === 'operating'
                  ? 'bg-success-light text-success-dark'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {listing.operatingStatus === 'operating' ? '운영중' : '운영종료'}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">
              {listing.price.displayText}
            </span>
            {listing.price.isNegotiable && (
              <span className="text-xs text-primary-600 font-medium">협의가능</span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
            {listing.shortDescription}
          </p>
        </div>
      </div>
    </Link>
  )
}
