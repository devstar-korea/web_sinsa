// ============================================
// Zod Runtime Validation Schemas
// ============================================
// Purpose: Runtime type safety for data from Supabase
// Prevents TypeError when database returns null/undefined

import { z } from 'zod'

// ============================================
// Article Schema
// ============================================

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  category: z.enum(['guide', 'tips', 'market']),

  // Content
  excerpt: z.string(),
  content: z.string().optional(),

  // Optional with defaults (runtime safety)
  thumbnail: z
    .object({
      url: z.string().url(),
      alt: z.string(),
    })
    .optional()
    .default({
      url: '/images/placeholder.jpg',
      alt: '기본 이미지',
    }),

  // Meta
  author: z
    .object({
      name: z.string(),
      avatar: z.string().url().optional(),
    })
    .optional()
    .default({
      name: '작성자',
    }),

  viewCount: z.number().int().nonnegative().optional().default(0),
  isFeatured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional(),

  // Blog API integration
  isImported: z.boolean().optional().default(false),
  blogPlatform: z.string().optional(),
  externalId: z.string().optional(),
  externalUrl: z.string().url().optional(),
  importedAt: z.string().datetime().optional(),
  lastSyncedAt: z.string().datetime().optional(),

  // Timestamps
  publishedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Article = z.infer<typeof ArticleSchema>

// Article Card Schema (for list views)
export const ArticleCardSchema = ArticleSchema.pick({
  id: true,
  title: true,
  slug: true,
  category: true,
  excerpt: true,
  thumbnail: true,
  author: true,
  viewCount: true,
  publishedAt: true,
})

export type ArticleCard = z.infer<typeof ArticleCardSchema>

// ============================================
// Listing Schema
// ============================================

export const ListingSchema = z.object({
  id: z.string(),
  listingNumber: z.string().optional(),
  title: z.string(),
  slug: z.string(),

  // Location
  location: z.object({
    province: z.string(),
    locationKey: z.string().optional(),
  }),

  // Price info
  price: z.object({
    amount: z.number().nonnegative(),
    displayText: z.string(),
    isNegotiable: z.boolean(),
  }),

  // Financial info (public)
  premiumAmount: z.number().nonnegative(),
  totalInvestment: z.number().nonnegative(),
  monthlyProfit: z.number().nonnegative(),

  // Space info
  area: z.object({
    squareMeter: z.number().positive(),
    pyeong: z.number().positive(),
  }),
  totalRooms: z.number().int().nonnegative(),

  // Parking info (optional)
  parkingInfo: z
    .object({
      freeSpaces: z.string(),
      monthlyMethod: z.string(),
      monthlyFee: z.string(),
    })
    .optional(),

  // Images (with runtime safety)
  thumbnail: z
    .object({
      url: z.string().url(),
      alt: z.string(),
    })
    .optional()
    .default({
      url: '/images/placeholder.jpg',
      alt: '매물 이미지',
    }),

  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string(),
        order: z.number().int().nonnegative(),
        isPrimary: z.boolean(),
      })
    )
    .optional(),

  // Description
  shortDescription: z.string(),
  description: z.string().optional(),

  // Status
  status: z.enum(['active', 'pending', 'hidden', 'sold']),
  operatingStatus: z.literal('operating'),

  // Meta
  openedAt: z.string().datetime(),
  viewCount: z.number().int().nonnegative().optional().default(0),
  isPremium: z.boolean().optional().default(false),

  // Soft delete
  deletedAt: z.string().datetime().optional(),
  deletedBy: z.string().optional(),

  // Timestamps
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Listing = z.infer<typeof ListingSchema>

// Listing Card Schema (for list views)
export const ListingCardSchema = ListingSchema.pick({
  id: true,
  title: true,
  slug: true,
  location: true,
  price: true,
  premiumAmount: true,
  totalInvestment: true,
  monthlyProfit: true,
  area: true,
  thumbnail: true,
  shortDescription: true,
  status: true,
  createdAt: true,
}).extend({
  listingNumber: z.string().optional(),
})

export type ListingCard = z.infer<typeof ListingCardSchema>

// ============================================
// Inquiry Schemas
// ============================================

export const PurchaseInquirySchema = z.object({
  id: z.string(),
  listingId: z.string(),

  // Applicant info
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z
    .string()
    .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '올바른 전화번호를 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요'),

  // Consultation details
  purpose: z.array(z.string()).min(1, '상담 목적을 선택해주세요'),
  message: z.string().min(10, '최소 10자 이상 입력해주세요'),
  budget: z.string().optional(),
  preferredTime: z.string().optional(),
  hasExperience: z.boolean().optional(),

  // Status
  status: z.enum(['pending', 'contacted', 'qualified', 'converted', 'rejected']),
  assignedTo: z.string().optional(),
  adminNotes: z.string().optional(),

  deviceType: z.enum(['mobile', 'tablet', 'desktop']).optional(),

  // Timestamps
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type PurchaseInquiry = z.infer<typeof PurchaseInquirySchema>

export const RegisterInquirySchema = z.object({
  id: z.string(),

  // Applicant info
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z
    .string()
    .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '올바른 전화번호를 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요'),

  // Business location
  location: z.object({
    province: z.string().min(1, '지역을 선택해주세요'),
    city: z.string().min(1, '시/군/구를 입력해주세요'),
  }),
  areaRange: z.string().min(1, '면적 범위를 선택해주세요'),
  priceRange: z.string().min(1, '가격 범위를 선택해주세요'),

  // Sale info
  message: z.string().min(10, '최소 10자 이상 입력해주세요'),
  desiredTimeline: z.string().optional(),
  operatingStatus: z.string().optional(),

  // Status
  status: z.enum(['pending', 'contacted', 'qualified', 'converted', 'rejected']),
  assignedTo: z.string().optional(),
  adminNotes: z.string().optional(),
  linkedListingId: z.string().optional(),

  deviceType: z.enum(['mobile', 'tablet', 'desktop']).optional(),

  // Timestamps
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type RegisterInquiry = z.infer<typeof RegisterInquirySchema>

// ============================================
// Validation Helper Functions
// ============================================

/**
 * Validate and parse Article data from Supabase
 * @param data Raw data from database
 * @returns Validated Article or throws ZodError
 */
export function validateArticle(data: unknown): Article {
  return ArticleSchema.parse(data)
}

/**
 * Safely validate Article data (returns null on error)
 * @param data Raw data from database
 * @returns Validated Article or null
 */
export function safeValidateArticle(data: unknown): Article | null {
  const result = ArticleSchema.safeParse(data)
  return result.success ? result.data : null
}

/**
 * Validate and parse Listing data from Supabase
 * @param data Raw data from database
 * @returns Validated Listing or throws ZodError
 */
export function validateListing(data: unknown): Listing {
  return ListingSchema.parse(data)
}

/**
 * Safely validate Listing data (returns null on error)
 * @param data Raw data from database
 * @returns Validated Listing or null
 */
export function safeValidateListing(data: unknown): Listing | null {
  const result = ListingSchema.safeParse(data)
  return result.success ? result.data : null
}

/**
 * Validate array of Articles
 * @param data Raw array from database
 * @returns Validated array (filters out invalid items)
 */
export function validateArticleArray(data: unknown[]): Article[] {
  return data
    .map((item) => safeValidateArticle(item))
    .filter((item): item is Article => item !== null)
}

/**
 * Validate array of Listings
 * @param data Raw array from database
 * @returns Validated array (filters out invalid items)
 */
export function validateListingArray(data: unknown[]): Listing[] {
  return data
    .map((item) => safeValidateListing(item))
    .filter((item): item is Listing => item !== null)
}
