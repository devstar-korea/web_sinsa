// ============================================
// 매물 (Listing)
// ============================================

export interface Listing {
  id: string
  listingNumber?: string  // 매물번호 (sz-xxxx), optional - 없으면 id 기반으로 자동 생성
  title: string
  slug: string

  // 위치
  location: {
    province: string
    locationKey?: string
  }

  // 가격 정보
  price: {
    amount: number
    displayText: string
    isNegotiable: boolean
  }

  // 재정 정보 (공개)
  premiumAmount: number  // 권리금
  totalInvestment: number  // 총 투자비용 (권리금 + 보증금)
  monthlyProfit: number  // 월수익

  // 공간 정보
  area: {
    squareMeter: number
    pyeong: number  // 내부 계산용 (표시하지 않음)
  }
  totalRooms: number  // 룸 개수 (좌석 수 → 룸 개수로 변경)

  // 주차 정보
  parkingInfo?: {
    freeSpaces: string        // 무료주차 대수 (예: "2대")
    monthlyMethod: string     // 입주사 월주차 방식 (예: "선착순 배정")
    monthlyFee: string        // 입주사 월주차 요금 (예: "월 10만원")
  }

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
  operatingStatus: 'operating'  // 운영중인 매장만 등록 가능

  // 메타
  openedAt: string
  viewCount: number
  isPremium: boolean

  // Soft Delete
  deletedAt?: string
  deletedBy?: string  // 관리자 ID

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
  | 'premiumAmount'
  | 'totalInvestment'
  | 'monthlyProfit'
  | 'area'
  | 'thumbnail'
  | 'shortDescription'
  | 'status'
  | 'createdAt'
> & {
  listingNumber?: string
}

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

  // 블로그 API 연동
  isImported: boolean
  blogPlatform?: string  // 'tistory' | 'naver' | 'wordpress'
  externalId?: string
  externalUrl?: string
  importedAt?: string
  lastSyncedAt?: string

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
  | 'externalUrl'
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
  status: 'pending' | 'contacted' | 'qualified' | 'converted' | 'rejected'
  assignedTo?: string  // 관리자 ID
  adminNotes?: string

  deviceType?: 'mobile' | 'tablet' | 'desktop'

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
  status: 'pending' | 'contacted' | 'qualified' | 'converted' | 'rejected'
  assignedTo?: string  // 관리자 ID
  adminNotes?: string
  linkedListingId?: string

  deviceType?: 'mobile' | 'tablet' | 'desktop'

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

// ============================================
// 관리자 (Admin) - 관리자 페이지 전용
// ============================================

export interface Admin {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'staff'
  createdAt: string
  updatedAt: string
}

// ============================================
// 매물 히스토리 (ListingHistory)
// ============================================

export interface ListingHistory {
  id: string
  listingId: string
  action: 'created' | 'updated' | 'deleted' | 'status_changed' | 'image_added' | 'image_removed'
  adminId: string
  adminName: string
  changes?: Record<string, any>
  note?: string
  createdAt: string
}

// ============================================
// 이메일 설정 (EmailConfig)
// ============================================

export interface EmailConfig {
  id: string
  key: string
  value: string
  description?: string
  updatedAt: string
  updatedBy?: string
}

// ============================================
// 매물 이미지 (ListingImage)
// ============================================

export interface ListingImage {
  id: string
  listing_id: string
  image_url: string
  alt_text: string
  display_order: number
  created_at: string
}

// ============================================
// Admin API용 Raw 타입 (Supabase 데이터베이스 구조)
// ============================================

/**
 * Supabase에서 직접 반환하는 raw 데이터 구조
 * Admin 페이지에서 사용 (snake_case + flat 구조)
 */
export interface ListingRaw {
  id: string
  listing_number?: string
  title: string
  slug: string
  
  // Flat 구조 (nested 아님)
  province: string
  location_key?: string
  
  // Flat 구조
  price_amount: number
  price_display_text?: string
  is_negotiable?: boolean
  
  premium_amount?: number
  total_investment?: number
  monthly_profit?: number
  
  area_square_meter: number
  area_pyeong: number
  total_rooms: number
  
  parking_free_spaces?: string
  parking_monthly_method?: string
  parking_monthly_fee?: string
  
  thumbnail_url?: string
  thumbnail_alt?: string
  
  short_description?: string
  description?: string
  
  status: 'active' | 'pending' | 'hidden' | 'sold'
  operating_status?: string
  
  opened_at?: string
  view_count?: number
  is_premium?: boolean
  
  deleted_at?: string
  deleted_by?: string
  
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  
  listing_images?: any[]
}

export interface ArticleRaw {
  id: string
  title: string
  slug: string
  category: 'guide' | 'tips' | 'market'
  
  excerpt: string
  content?: string
  
  // Flat 구조 (nested 아님)
  thumbnail_url?: string
  thumbnail_alt?: string
  
  author_name?: string
  author_avatar?: string
  
  view_count?: number
  is_featured?: boolean
  tags?: string[]
  
  is_imported?: boolean
  blog_platform?: string
  external_id?: string
  external_url?: string
  imported_at?: string
  last_synced_at?: string
  
  published_at: string
  created_at: string
  updated_at: string
  created_by?: string
}
