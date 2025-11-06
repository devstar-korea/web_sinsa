// ============================================
// 매물 (Listing)
// ============================================

export interface Listing {
  id: string
  title: string
  slug: string

  // 위치
  location: {
    province: string
    city: string
    displayLocation: string
  }

  // 가격
  price: {
    amount: number
    displayText: string
    isNegotiable: boolean
  }

  // 공간 정보
  area: {
    squareMeter: number
    pyeong: number
  }
  totalSeats: number

  // 이미지
  thumbnail: {
    url: string
    alt: string
  }
  images?: Array<{
    url: string
    alt: string
    order: number
    isPrimary: boolean
  }>

  // 설명
  shortDescription: string
  description?: string

  // 상태
  status: 'active' | 'pending' | 'hidden' | 'sold'
  operatingStatus: 'operating' | 'closed'

  // 메타
  openedAt: string
  viewCount: number
  isPremium: boolean

  createdAt: string
  updatedAt: string
}

// 매물 카드용 (목록에 표시)
export type ListingCard = Pick<
  Listing,
  | 'id'
  | 'title'
  | 'slug'
  | 'location'
  | 'price'
  | 'area'
  | 'totalSeats'
  | 'thumbnail'
  | 'shortDescription'
  | 'status'
  | 'operatingStatus'
  | 'createdAt'
>

// ============================================
// 정보 콘텐츠 (Article)
// ============================================

export interface Article {
  id: string
  title: string
  slug: string
  category: 'guide' | 'tips' | 'market'

  // 콘텐츠
  excerpt: string
  content?: string
  thumbnail: {
    url: string
    alt: string
  }

  // 메타
  author: {
    name: string
    avatar?: string
  }
  viewCount: number
  isFeatured: boolean
  tags?: string[]

  publishedAt: string
  createdAt: string
  updatedAt: string
}

// 아티클 카드용
export type ArticleCard = Pick<
  Article,
  | 'id'
  | 'title'
  | 'slug'
  | 'category'
  | 'excerpt'
  | 'thumbnail'
  | 'author'
  | 'viewCount'
  | 'publishedAt'
>

// ============================================
// 상담 신청 (Inquiry)
// ============================================

export interface PurchaseInquiry {
  id: string
  listingId: string

  // 신청자
  name: string
  phone: string
  email: string

  // 상담 내용
  purpose: string[]
  message: string
  budget?: string
  preferredTime?: string
  hasExperience?: boolean

  // 상태
  status: 'pending' | 'in_progress' | 'completed' | 'canceled'
  adminNotes?: string

  deviceType: 'mobile' | 'tablet' | 'desktop'

  createdAt: string
  updatedAt: string
}

export interface RegisterInquiry {
  id: string

  // 신청자
  name: string
  phone: string
  email: string

  // 사업장 정보
  location: {
    province: string
    city: string
  }
  areaRange: string
  priceRange: string

  // 매각 정보
  message: string
  desiredTimeline?: string
  operatingStatus?: string

  // 상태
  status: 'pending' | 'in_progress' | 'completed' | 'canceled'
  adminNotes?: string

  linkedListingId?: string

  deviceType: 'mobile' | 'tablet' | 'desktop'

  createdAt: string
  updatedAt: string
}

// ============================================
// API 응답 타입
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
    hasMore?: boolean
  }
}

// ============================================
// 필터 타입
// ============================================

export interface ListingFilter {
  location?: string[]
  areaMin?: number
  areaMax?: number
  priceMin?: number
  priceMax?: number
  status?: string
  sort?: 'latest' | 'oldest' | 'price_low' | 'price_high' | 'area_large' | 'area_small'
}

export interface ArticleFilter {
  category?: 'guide' | 'tips' | 'market'
  featured?: boolean
  sort?: 'latest' | 'oldest' | 'popular'
}
