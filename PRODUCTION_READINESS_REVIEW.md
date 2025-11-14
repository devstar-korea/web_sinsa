# 프로덕션 준비 종합 검토 보고서

**프로젝트**: web_sinsa (공유오피스 매물 플랫폼)
**검토 일자**: 2025-11-14
**Next.js 버전**: 16.0.1
**기준**: 2025년 11월 Next.js 공식 문서 베스트 프랙티스
**검토자**: Claude Code

---

## 📋 목차

1. [Executive Summary](#executive-summary)
2. [현재 상태 분석](#현재-상태-분석)
3. [발견된 문제점](#발견된-문제점)
4. [Next.js 16 마이그레이션 요구사항](#nextjs-16-마이그레이션-요구사항)
5. [프로덕션 준비 권장사항](#프로덕션-준비-권장사항)
6. [우선순위 매트릭스](#우선순위-매트릭스)
7. [코드 예시 및 패턴](#코드-예시-및-패턴)
8. [테스트 전략](#테스트-전략)
9. [배포 체크리스트](#배포-체크리스트)

---

## Executive Summary

### 🎯 전체 평가

| 항목 | 점수 | 상태 |
|------|------|------|
| 타입 안정성 | 40/100 | 🔴 **심각** |
| Next.js 16 호환성 | 75/100 | 🟡 **주의** |
| 코드 품질 | 70/100 | 🟡 **양호** |
| 프로덕션 준비도 | 50/100 | 🔴 **부족** |
| **종합 점수** | **58.75/100** | 🔴 **프로덕션 부적합** |

### ⚠️ 핵심 문제 요약

**🔴 Critical (즉시 수정 필요)**:
1. **런타임 타입 안정성 부재** - ArticleCard, ListingCard에서 런타임 에러 발생
2. **타입 정의 불일치** - TypeScript 타입이 실제 런타임 데이터와 불일치
3. **런타임 검증 미비** - 외부 데이터(Supabase) 검증 없이 직접 사용

**🟡 Important (조속히 개선 필요)**:
4. **Next.js 16 마이그레이션 미완료** - middleware.ts → proxy.ts 변경 필요
5. **에러 바운더리 부재** - 런타임 에러 발생 시 앱 전체 크래시
6. **환경 변수 검증 부재** - .env 값 검증 없이 사용

**🟢 Nice to have (장기 개선)**:
7. **로딩 상태 처리 미비** - Suspense, loading.tsx 미사용
8. **SEO 최적화 부족** - metadata 생성 함수 미사용
9. **이미지 최적화 미흡** - Next.js Image 컴포넌트 미사용

### 📊 영향도 분석

- **현재 발견된 런타임 에러**: 5건 (모두 타입 안정성 관련)
- **수정 완료**: ArticleCard.tsx (5건 중 5건)
- **수정 필요**: ListingCard.tsx (최소 2건 예상)
- **잠재적 에러**: 기타 컴포넌트 전체 검토 필요

---

## 현재 상태 분석

### 1. 프로젝트 구조

```
web_sinsa/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 홈페이지
│   ├── listings/            # 매물 페이지
│   ├── admin/               # 관리자 페이지
│   └── layout.tsx           # 루트 레이아웃
│
├── components/
│   ├── ArticleCard.tsx      # ✅ 수정 완료 (타입 안전)
│   ├── ListingCard.tsx      # ❌ 수정 필요 (런타임 에러 위험)
│   ├── admin/               # 관리자 컴포넌트
│   ├── layout/              # 레이아웃 컴포넌트
│   └── ui/                  # shadcn/ui 컴포넌트
│
├── lib/
│   ├── types.ts             # ⚠️ 타입 정의 (Required vs Optional 불일치)
│   ├── dummy-data.ts        # 더미 데이터 (모든 필드 존재)
│   └── supabase/            # Supabase 클라이언트
│
├── middleware.ts            # ⚠️ Next.js 16: proxy.ts로 변경 필요
├── next.config.ts           # Next.js 설정
└── tsconfig.json            # TypeScript 설정
```

### 2. 기술 스택

| 카테고리 | 기술 | 버전 | 상태 |
|---------|------|------|------|
| **프레임워크** | Next.js | 16.0.1 | ✅ 최신 |
| **언어** | TypeScript | latest | ✅ 최신 |
| **UI** | React | 19.2.0 | ✅ 최신 |
| **스타일링** | Tailwind CSS | latest | ✅ 최신 |
| **백엔드** | Supabase | 2.80.0 | ✅ 최신 |
| **폼 관리** | React Hook Form | latest | ✅ 최신 |
| **UI 라이브러리** | shadcn/ui | latest | ✅ 최신 |

---

## 발견된 문제점

### 🔴 Critical Issue #1: 타입 안정성 부재

**파일**: `lib/types.ts` (lines 100-148)

**문제점**:
```typescript
// ❌ 현재: Required 타입 정의 (컴파일 타임)
export interface Article {
  id: string
  title: string
  slug: string
  category: 'guide' | 'tips' | 'market'

  // 문제: 이 필드들이 Required로 정의되어 있지만
  // 실제 Supabase에서 가져온 데이터는 undefined일 수 있음
  thumbnail: {        // ← Should be thumbnail?:
    url: string
    alt: string
  }
  author: {          // ← Should be author?:
    name: string
    avatar?: string
  }
  viewCount: number  // ← Should be viewCount?:

  publishedAt: string
  createdAt: string
  updatedAt: string
}
```

**왜 발생하는가**:
1. **타입 정의는 Required**: TypeScript는 모든 필드가 존재한다고 가정
2. **실제 데이터는 Optional**: Supabase 데이터베이스에는 NULL 값이 있을 수 있음
3. **런타임 검증 없음**: 데이터 가져올 때 검증하지 않음
4. **TypeScript는 거짓 확신 제공**: 컴파일은 성공하지만 런타임에 크래시

**영향 범위**:
- ✅ **ArticleCard.tsx**: 수정 완료 (optional chaining 추가)
- ❌ **ListingCard.tsx**: 수정 필요 (동일한 패턴 존재)
- ❌ **FeaturedArticles.tsx**: 검토 필요
- ❌ **FeaturedListings.tsx**: 검토 필요
- ❌ **기타 모든 Article/Listing 사용 컴포넌트**: 검토 필요

**해결 방법** (3가지 옵션):

#### Option A: 타입 정의를 Optional로 변경 (권장 ⭐)
```typescript
// ✅ 권장: Optional 타입 정의
export interface Article {
  id: string
  title: string
  slug: string
  category: 'guide' | 'tips' | 'market'

  // Optional로 변경
  thumbnail?: {
    url: string
    alt: string
  }
  author?: {
    name: string
    avatar?: string
  }
  viewCount?: number

  publishedAt: string
  createdAt: string
  updatedAt: string
}
```

**장점**:
- TypeScript가 올바른 경고 제공
- 모든 컴포넌트에서 optional chaining 강제
- 타입 안정성 향상

**단점**:
- 모든 컴포넌트 수정 필요 (일회성)

#### Option B: Zod를 사용한 런타임 검증 (Best Practice ⭐⭐⭐)
```typescript
import { z } from 'zod'

// 1. Zod 스키마 정의
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  category: z.enum(['guide', 'tips', 'market']),

  // Optional 필드를 명시적으로 처리
  thumbnail: z.object({
    url: z.string().url(),
    alt: z.string(),
  }).optional().default({ url: '/images/placeholder.jpg', alt: '기본 이미지' }),

  author: z.object({
    name: z.string(),
    avatar: z.string().url().optional(),
  }).optional().default({ name: '작성자' }),

  viewCount: z.number().optional().default(0),

  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// 2. TypeScript 타입 자동 추론
export type Article = z.infer<typeof ArticleSchema>

// 3. Supabase 데이터 가져올 때 검증
export async function getArticles() {
  const { data } = await supabase.from('articles').select('*')

  // 런타임 검증 + 기본값 자동 적용
  return data?.map(article => ArticleSchema.parse(article)) ?? []
}
```

**장점**:
- 런타임 타입 검증 (2025년 업계 표준)
- 기본값 자동 적용
- 타입 안정성 보장
- 개발자 실수 방지

**단점**:
- Zod 라이브러리 추가 필요 (이미 프로젝트에 포함됨)
- 초기 설정 시간 필요

#### Option C: 데이터 레이어에서 보장 (차선책)
```typescript
// Supabase에서 데이터 가져올 때 기본값 적용
export async function getArticles() {
  const { data } = await supabase.from('articles').select('*')

  return data?.map(article => ({
    ...article,
    thumbnail: article.thumbnail || {
      url: '/images/placeholder.jpg',
      alt: article.title
    },
    author: article.author || { name: '작성자' },
    viewCount: article.viewCount || 0,
  })) ?? []
}
```

**장점**:
- 코드 변경 최소화
- 빠른 적용 가능

**단점**:
- 타입 안정성 보장 안 됨
- 모든 데이터 가져오는 함수마다 중복 코드

---

### 🔴 Critical Issue #2: ListingCard.tsx 런타임 에러 위험

**파일**: `components/ListingCard.tsx` (lines 29-30)

**현재 코드** (취약):
```typescript
// ❌ 문제: Optional chaining 없음
<img
  src={listing.thumbnail.url}              // ← 런타임 에러 가능
  alt={listing.thumbnail.alt}              // ← 런타임 에러 가능
  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
/>
```

**수정 필요**:
```typescript
// ✅ 권장: Optional chaining + fallback
<img
  src={listing.thumbnail?.url || "/images/placeholder.jpg"}
  alt={listing.thumbnail?.alt || listing.title}
  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
/>
```

**리스크**:
- ArticleCard와 동일한 런타임 에러 발생 가능
- 매물 목록 페이지 전체 크래시 가능성

---

### 🟡 Important Issue #3: Next.js 16 마이그레이션 미완료

**파일**: `middleware.ts`

**경고 메시지**:
```
⚠ The "middleware" file convention is deprecated.
  Please use "proxy" instead.
```

**수정 방법**:
```bash
# 1. 파일 이름 변경
mv middleware.ts proxy.ts

# 2. 코드 수정 (필요시)
# Next.js 16에서는 동일한 API 사용
```

**참조**: [Next.js 16 Breaking Changes](https://nextjs.org/docs/messages/middleware-to-proxy)

---

### 🟡 Important Issue #4: 에러 바운더리 부재

**현재 상태**:
- 에러 바운더리 없음
- 런타임 에러 발생 시 앱 전체 크래시
- 사용자에게 기술적 에러 메시지 노출

**권장 사항**:

#### 1. 루트 에러 바운더리 추가

**파일**: `app/error.tsx` (신규 생성)
```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로깅 (Sentry, LogRocket 등)
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-grey-900">
          문제가 발생했습니다
        </h2>
        <p className="mb-6 text-grey-600">
          죄송합니다. 일시적인 오류가 발생했습니다.
          잠시 후 다시 시도해주세요.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()}>
            다시 시도
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  )
}
```

#### 2. 페이지별 에러 바운더리 추가

**파일**: `app/listings/error.tsx` (신규 생성)
```typescript
'use client'

export default function ListingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">
          매물을 불러올 수 없습니다
        </h2>
        <p className="text-grey-600 mb-6">
          매물 정보를 불러오는 중 문제가 발생했습니다.
        </p>
        <Button onClick={() => reset()}>다시 시도</Button>
      </div>
    </div>
  )
}
```

---

### 🟡 Important Issue #5: 환경 변수 검증 부재

**현재 상태**: `.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL=https://kngdrmqnepyojvqeinej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=

EMAIL_FROM=biz.sharezone@gmail.com

NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**문제점**:
- 환경 변수 검증 없음
- 빈 값 허용 (SUPABASE_SERVICE_ROLE_KEY)
- 런타임에만 에러 발견

**권장 사항**: Zod로 환경 변수 검증

**파일**: `lib/env.ts` (신규 생성)
```typescript
import { z } from 'zod'

// 1. 환경 변수 스키마 정의
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(), // Optional로 허용

  // Email
  EMAIL_FROM: z.string().email(),

  // App
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

// 2. 환경 변수 검증 (앱 시작 시 한 번만 실행)
export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
})

// 3. 타입 안전하게 사용
// import { env } from '@/lib/env'
// const url = env.NEXT_PUBLIC_SUPABASE_URL // ← 타입 안전
```

**장점**:
- 앱 시작 시 환경 변수 검증
- 잘못된 설정 즉시 발견
- 타입 안전성 보장

---

### 🟢 Nice to have #6: 로딩 상태 처리 미비

**현재 상태**:
- Suspense 미사용
- loading.tsx 파일 없음
- 데이터 로딩 중 빈 화면 표시

**권장 사항**:

#### 1. 루트 로딩 상태

**파일**: `app/loading.tsx` (신규 생성)
```typescript
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-grey-200 border-t-tossBlue"></div>
        <p className="text-grey-600">로딩 중...</p>
      </div>
    </div>
  )
}
```

#### 2. 페이지별 로딩 상태

**파일**: `app/listings/loading.tsx` (신규 생성)
```typescript
export default function ListingsLoading() {
  return (
    <div className="container py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-grey-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-grey-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-grey-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### 3. Suspense 사용

**파일**: `app/page.tsx` (수정)
```typescript
import { Suspense } from 'react'
import FeaturedListings from '@/components/FeaturedListings'
import FeaturedArticles from '@/components/FeaturedArticles'

export default function Home() {
  return (
    <main>
      <Suspense fallback={<FeaturedListingsSkeleton />}>
        <FeaturedListings />
      </Suspense>

      <Suspense fallback={<FeaturedArticlesSkeleton />}>
        <FeaturedArticles />
      </Suspense>
    </main>
  )
}
```

---

### 🟢 Nice to have #7: SEO 최적화 부족

**권장 사항**:

#### 1. 정적 metadata 추가

**파일**: `app/layout.tsx`
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'SHAREZONE - 공유오피스 매물 플랫폼',
    template: '%s | SHAREZONE',
  },
  description: '공유오피스 매물 매매, 임대, 정보 제공 플랫폼. 검증된 매물 정보와 전문가 컨설팅을 제공합니다.',
  keywords: ['공유오피스', '매물', '매매', '임대', '창업', '오피스'],
  authors: [{ name: 'SHAREZONE' }],
  openGraph: {
    title: 'SHAREZONE - 공유오피스 매물 플랫폼',
    description: '공유오피스 매물 매매, 임대, 정보 제공 플랫폼',
    url: 'https://sharezone.kr',
    siteName: 'SHAREZONE',
    locale: 'ko_KR',
    type: 'website',
  },
}
```

#### 2. 동적 metadata 생성

**파일**: `app/listings/[slug]/page.tsx`
```typescript
import type { Metadata } from 'next'
import { getListingBySlug } from '@/lib/dummy-data'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = getListingBySlug(params.slug)

  if (!listing) {
    return {
      title: '매물을 찾을 수 없습니다',
    }
  }

  return {
    title: listing.title,
    description: listing.shortDescription,
    openGraph: {
      title: listing.title,
      description: listing.shortDescription,
      images: [listing.thumbnail?.url || '/images/og-default.jpg'],
    },
  }
}
```

---

### 🟢 Nice to have #8: 이미지 최적화 미흡

**현재 코드**:
```typescript
// ❌ 일반 img 태그 사용
<img src={article.thumbnail?.url} alt={article.title} />
```

**권장 코드**:
```typescript
// ✅ Next.js Image 컴포넌트 사용
import Image from 'next/image'

<Image
  src={article.thumbnail?.url || '/images/placeholder.jpg'}
  alt={article.thumbnail?.alt || article.title}
  width={800}
  height={600}
  className="w-full h-full object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

**장점**:
- 자동 이미지 최적화 (WebP, AVIF)
- Lazy loading
- Blur placeholder
- CLS (Cumulative Layout Shift) 방지

**설정**: `next.config.ts`
```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'kngdrmqnepyojvqeinej.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}
```

---

## Next.js 16 마이그레이션 요구사항

### 1. Breaking Changes 체크리스트

| 변경 사항 | 현재 상태 | 조치 필요 | 우선순위 |
|----------|---------|----------|---------|
| middleware → proxy | ⚠️ 사용 중 | ✅ 파일명 변경 | 🟡 High |
| async params | ✅ 미사용 | - | - |
| "use cache" directive | ✅ 미사용 | - | - |

### 2. middleware.ts → proxy.ts 마이그레이션

**현재 파일**: `middleware.ts`
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 현재 middleware 로직
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except...
     */
  ],
}
```

**마이그레이션 단계**:
```bash
# 1. 파일명 변경
git mv middleware.ts proxy.ts

# 2. 코드는 동일하게 유지 (Next.js 16에서 자동 호환)

# 3. 테스트
npm run dev
# ✅ 경고 메시지 사라짐 확인
```

---

## 프로덕션 준비 권장사항

### 1. 타입 안정성 개선 (🔴 Critical)

#### Step 1: Zod 설치 (이미 설치됨)
```bash
npm install zod
# 또는
yarn add zod
```

#### Step 2: Zod 스키마 정의

**파일**: `lib/schemas.ts` (신규 생성)
```typescript
import { z } from 'zod'

// Article 스키마
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  category: z.enum(['guide', 'tips', 'market']),
  excerpt: z.string(),
  content: z.string().optional(),

  thumbnail: z.object({
    url: z.string().url(),
    alt: z.string(),
  }).optional().default({
    url: '/images/placeholder.jpg',
    alt: '기본 이미지'
  }),

  author: z.object({
    name: z.string(),
    avatar: z.string().url().optional(),
  }).optional().default({
    name: '작성자'
  }),

  viewCount: z.number().int().nonnegative().optional().default(0),
  isFeatured: z.boolean(),
  tags: z.array(z.string()).optional(),

  // 블로그 API 연동
  isImported: z.boolean(),
  blogPlatform: z.string().optional(),
  externalId: z.string().optional(),
  externalUrl: z.string().url().optional(),
  importedAt: z.string().optional(),
  lastSyncedAt: z.string().optional(),

  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Listing 스키마
export const ListingSchema = z.object({
  id: z.string(),
  listingNumber: z.string().optional(),
  title: z.string(),
  slug: z.string(),

  location: z.object({
    province: z.string(),
    locationKey: z.string().optional(),
  }),

  price: z.object({
    amount: z.number(),
    displayText: z.string(),
    isNegotiable: z.boolean(),
  }),

  premiumAmount: z.number(),
  totalInvestment: z.number(),
  monthlyProfit: z.number(),

  area: z.object({
    squareMeter: z.number(),
    pyeong: z.number(),
  }),

  totalRooms: z.number(),

  parkingInfo: z.object({
    freeSpaces: z.string(),
    monthlyMethod: z.string(),
    monthlyFee: z.string(),
  }).optional(),

  thumbnail: z.object({
    url: z.string().url(),
    alt: z.string(),
  }).optional().default({
    url: '/images/placeholder.jpg',
    alt: '매물 이미지'
  }),

  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string(),
    order: z.number(),
    isPrimary: z.boolean(),
  })).optional(),

  shortDescription: z.string(),
  description: z.string().optional(),

  status: z.enum(['active', 'pending', 'hidden', 'sold']),
  operatingStatus: z.literal('operating'),

  openedAt: z.string(),
  viewCount: z.number().int().nonnegative(),
  isPremium: z.boolean(),

  deletedAt: z.string().optional(),
  deletedBy: z.string().optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
})

// TypeScript 타입 자동 추론
export type Article = z.infer<typeof ArticleSchema>
export type Listing = z.infer<typeof ListingSchema>

// ArticleCard, ListingCard 타입
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
```

#### Step 3: 데이터 검증 함수

**파일**: `lib/data.ts` (신규 생성)
```typescript
import { ArticleSchema, ListingSchema } from './schemas'
import type { Article, Listing } from './schemas'

// Supabase에서 Article 가져오기 (검증 포함)
export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('publishedAt', { ascending: false })

  if (error) {
    console.error('Failed to fetch articles:', error)
    return []
  }

  // Zod로 검증 + 기본값 적용
  return data?.map(article => {
    try {
      return ArticleSchema.parse(article)
    } catch (validationError) {
      console.error('Article validation failed:', validationError)
      // 검증 실패한 항목 스킵
      return null
    }
  }).filter(Boolean) as Article[]
}

// Supabase에서 Listing 가져오기 (검증 포함)
export async function getListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Failed to fetch listings:', error)
    return []
  }

  // Zod로 검증 + 기본값 적용
  return data?.map(listing => {
    try {
      return ListingSchema.parse(listing)
    } catch (validationError) {
      console.error('Listing validation failed:', validationError)
      return null
    }
  }).filter(Boolean) as Listing[]
}
```

#### Step 4: types.ts 파일 업데이트

**파일**: `lib/types.ts`
```typescript
// ❌ 삭제: 기존 Article, Listing 인터페이스
// ✅ 추가: schemas.ts에서 import
export type { Article, Listing, ArticleCard, ListingCard } from './schemas'

// 나머지 타입들은 유지
export interface PurchaseInquiry {
  // ...기존 코드
}

export interface RegisterInquiry {
  // ...기존 코드
}

// ...나머지 타입들
```

---

### 2. ListingCard.tsx 수정 (🔴 Critical)

**파일**: `components/ListingCard.tsx`

```typescript
import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { ListingCard as ListingCardType } from '@/lib/schemas' // ← schemas.ts에서 import
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ListingCardProps {
  listing: ListingCardType
}

export default function ListingCard({ listing }: ListingCardProps) {
  // id에서 숫자를 추출하여 매물번호 생성
  const listingNumber = (
    listing.listingNumber ||
    `sz-${listing.id.replace(/\D/g, '').padStart(4, '0')}`
  ).toUpperCase()

  return (
    <Link href={`/listings/${listing.slug}`} className="group block h-full">
      <Card className="overflow-hidden border-grey-200 hover:border-tossBlue transition-all hover:shadow-md flex flex-col h-full">
        {/* Listing Number */}
        <div className="px-4 pt-4 pb-2">
          <Badge variant="secondary" className="px-3 py-1.5 text-body font-medium bg-grey-100 text-grey-700 border-grey-200">
            {listingNumber}
          </Badge>
        </div>

        {/* Thumbnail - 수정: optional chaining + fallback */}
        <div className="relative h-48 bg-grey-100 overflow-hidden flex-shrink-0">
          <img
            src={listing.thumbnail?.url || "/images/placeholder.jpg"}
            alt={listing.thumbnail?.alt || listing.title}
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
            <MapPin className="w-4 h-4 mr-1.5" />
            <span>{listing.location.province}</span>
          </div>

          {/* Area */}
          <div className="mb-3">
            <span className="text-body text-grey-600">{listing.area.squareMeter}㎡</span>
          </div>

          {/* 재정 정보 */}
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

          {/* 총 투자비용 */}
          <div className="pt-3 border-t border-grey-200">
            <div className="flex items-baseline justify-between">
              <span className="text-body font-medium text-grey-700">총 투자비용</span>
              <span className="text-main font-bold text-grey-900">
                {(listing.totalInvestment / 100000000).toFixed(1)}억원
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
```

---

### 3. 환경 변수 검증 추가 (🟡 Important)

**파일**: `lib/env.ts` (신규 생성)
```typescript
import { z } from 'zod'

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Email
  EMAIL_FROM: z.string().email(),

  // App
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
})
```

**사용법**:
```typescript
// ❌ 기존: 직접 process.env 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

// ✅ 권장: env.ts에서 import
import { env } from '@/lib/env'
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL // ← 타입 안전 + 검증됨
```

---

## 우선순위 매트릭스

### High Priority (즉시 수정 - 1주일 내)

| 작업 | 파일 | 난이도 | 예상 시간 | 리스크 |
|-----|------|--------|----------|--------|
| 1. Zod 스키마 정의 | `lib/schemas.ts` | 중 | 2시간 | 낮음 |
| 2. ListingCard 수정 | `components/ListingCard.tsx` | 하 | 30분 | 낮음 |
| 3. 환경 변수 검증 | `lib/env.ts` | 하 | 1시간 | 낮음 |
| 4. middleware → proxy | `proxy.ts` | 하 | 10분 | 낮음 |
| 5. 에러 바운더리 추가 | `app/error.tsx` | 중 | 1시간 | 낮음 |
| **총 예상 시간** | | | **4.5시간** | |

### Medium Priority (2주일 내)

| 작업 | 파일 | 난이도 | 예상 시간 | 리스크 |
|-----|------|--------|----------|--------|
| 6. 데이터 검증 함수 | `lib/data.ts` | 중 | 3시간 | 중간 |
| 7. 로딩 상태 추가 | `app/*/loading.tsx` | 하 | 2시간 | 낮음 |
| 8. SEO metadata | `app/*/page.tsx` | 중 | 2시간 | 낮음 |
| 9. 전체 컴포넌트 검토 | `components/**` | 높음 | 4시간 | 중간 |
| **총 예상 시간** | | | **11시간** | |

### Low Priority (1개월 내)

| 작업 | 파일 | 난이도 | 예상 시간 | 리스크 |
|-----|------|--------|----------|--------|
| 10. Next.js Image 적용 | `components/**` | 중 | 4시간 | 낮음 |
| 11. next.config 최적화 | `next.config.ts` | 중 | 2시간 | 낮음 |
| 12. Suspense 경계 추가 | `app/*/page.tsx` | 중 | 3시간 | 낮음 |
| 13. 성능 최적화 | 전체 | 높음 | 8시간 | 중간 |
| **총 예상 시간** | | | **17시간** | |

**전체 예상 시간**: 32.5시간 (~4일)

---

## 코드 예시 및 패턴

### Pattern 1: 안전한 데이터 가져오기

```typescript
// ❌ 나쁜 예시: 검증 없이 직접 사용
export default async function ArticlesPage() {
  const { data } = await supabase.from('articles').select('*')

  return (
    <div>
      {data?.map(article => (
        <ArticleCard key={article.id} article={article} />
        // ← 런타임 에러 가능: article.thumbnail이 undefined일 수 있음
      ))}
    </div>
  )
}

// ✅ 좋은 예시: Zod로 검증 + 기본값 적용
import { getArticles } from '@/lib/data'

export default async function ArticlesPage() {
  const articles = await getArticles() // ← Zod 검증 완료된 데이터

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
        // ← 안전: article.thumbnail은 항상 존재 (기본값 적용)
      ))}
    </div>
  )
}
```

### Pattern 2: 안전한 컴포넌트 렌더링

```typescript
// ❌ 나쁜 예시: Optional chaining 없음
export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <img src={article.thumbnail.url} alt={article.thumbnail.alt} />
    // ← 런타임 에러: Cannot read properties of undefined
  )
}

// 🟡 괜찮은 예시: Optional chaining 사용
export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <img
      src={article.thumbnail?.url || "/images/placeholder.jpg"}
      alt={article.thumbnail?.alt || article.title}
    />
    // ← 안전: fallback 값 제공
  )
}

// ✅ 최고의 예시: Zod 스키마 + Optional chaining
import { ArticleCard as ArticleCardType } from '@/lib/schemas'

export default function ArticleCard({ article }: { article: ArticleCardType }) {
  // article은 Zod 검증 완료 (thumbnail은 항상 존재)
  return (
    <img
      src={article.thumbnail.url}  // ← 안전: Zod가 기본값 보장
      alt={article.thumbnail.alt}
    />
  )
}
```

### Pattern 3: 에러 처리

```typescript
// ❌ 나쁜 예시: 에러 처리 없음
export async function getArticles() {
  const { data } = await supabase.from('articles').select('*')
  return data
}

// 🟡 괜찮은 예시: Try-catch
export async function getArticles() {
  try {
    const { data, error } = await supabase.from('articles').select('*')
    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return []
  }
}

// ✅ 최고의 예시: Try-catch + Zod 검증 + 로깅
export async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('publishedAt', { ascending: false })

    if (error) {
      console.error('[getArticles] Supabase error:', error)
      throw error
    }

    // Zod 검증
    return data?.map(article => {
      try {
        return ArticleSchema.parse(article)
      } catch (validationError) {
        console.error('[getArticles] Validation failed for article:', {
          articleId: article.id,
          error: validationError,
        })
        // 검증 실패한 항목 스킵
        return null
      }
    }).filter(Boolean) as Article[]

  } catch (error) {
    console.error('[getArticles] Fatal error:', error)
    // TODO: Sentry, LogRocket 등으로 에러 리포팅
    return []
  }
}
```

---

## 테스트 전략

### 1. 타입 안정성 테스트

**파일**: `__tests__/schemas.test.ts` (신규 생성)
```typescript
import { describe, it, expect } from 'vitest'
import { ArticleSchema, ListingSchema } from '@/lib/schemas'

describe('ArticleSchema', () => {
  it('should parse valid article', () => {
    const validArticle = {
      id: 'article-001',
      title: 'Test Article',
      slug: 'test-article',
      category: 'guide',
      excerpt: 'Test excerpt',
      thumbnail: {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
      },
      author: {
        name: 'Test Author',
      },
      viewCount: 100,
      isFeatured: true,
      isImported: false,
      publishedAt: '2025-11-14T00:00:00Z',
      createdAt: '2025-11-14T00:00:00Z',
      updatedAt: '2025-11-14T00:00:00Z',
    }

    const result = ArticleSchema.parse(validArticle)
    expect(result).toEqual(validArticle)
  })

  it('should apply default values for missing optional fields', () => {
    const articleWithoutOptionalFields = {
      id: 'article-001',
      title: 'Test Article',
      slug: 'test-article',
      category: 'guide',
      excerpt: 'Test excerpt',
      // thumbnail 없음
      // author 없음
      // viewCount 없음
      isFeatured: true,
      isImported: false,
      publishedAt: '2025-11-14T00:00:00Z',
      createdAt: '2025-11-14T00:00:00Z',
      updatedAt: '2025-11-14T00:00:00Z',
    }

    const result = ArticleSchema.parse(articleWithoutOptionalFields)

    // 기본값 적용 확인
    expect(result.thumbnail).toEqual({
      url: '/images/placeholder.jpg',
      alt: '기본 이미지',
    })
    expect(result.author).toEqual({
      name: '작성자',
    })
    expect(result.viewCount).toBe(0)
  })

  it('should throw error for invalid article', () => {
    const invalidArticle = {
      id: 'article-001',
      // title 없음 (Required)
      slug: 'test-article',
      category: 'invalid-category', // 잘못된 enum 값
    }

    expect(() => ArticleSchema.parse(invalidArticle)).toThrow()
  })
})
```

### 2. 컴포넌트 렌더링 테스트

**파일**: `__tests__/ArticleCard.test.tsx` (신규 생성)
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ArticleCard from '@/components/ArticleCard'
import { ArticleSchema } from '@/lib/schemas'

describe('ArticleCard', () => {
  it('should render with full data', () => {
    const article = ArticleSchema.parse({
      id: 'article-001',
      title: 'Test Article',
      slug: 'test-article',
      category: 'guide',
      excerpt: 'Test excerpt',
      thumbnail: {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
      },
      author: {
        name: 'Test Author',
        avatar: 'https://example.com/avatar.jpg',
      },
      viewCount: 100,
      isFeatured: true,
      isImported: false,
      publishedAt: '2025-11-14T00:00:00Z',
      createdAt: '2025-11-14T00:00:00Z',
      updatedAt: '2025-11-14T00:00:00Z',
    })

    render(<ArticleCard article={article} />)

    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('should render with default values when optional fields are missing', () => {
    const articleWithDefaults = ArticleSchema.parse({
      id: 'article-001',
      title: 'Test Article',
      slug: 'test-article',
      category: 'guide',
      excerpt: 'Test excerpt',
      // thumbnail, author, viewCount 없음 → 기본값 적용
      isFeatured: true,
      isImported: false,
      publishedAt: '2025-11-14T00:00:00Z',
      createdAt: '2025-11-14T00:00:00Z',
      updatedAt: '2025-11-14T00:00:00Z',
    })

    render(<ArticleCard article={articleWithDefaults} />)

    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('작성자')).toBeInTheDocument() // 기본값
    expect(screen.getByText('0')).toBeInTheDocument() // 기본값
    expect(screen.getByAltText('기본 이미지')).toBeInTheDocument() // 기본값
  })

  it('should NOT crash when data is malformed', () => {
    // Zod 스키마를 통과한 데이터는 항상 안전함
    // 하지만 만약을 대비한 테스트
    const article = ArticleSchema.parse({
      id: 'article-001',
      title: 'Test Article',
      slug: 'test-article',
      category: 'guide',
      excerpt: 'Test excerpt',
      isFeatured: true,
      isImported: false,
      publishedAt: '2025-11-14T00:00:00Z',
      createdAt: '2025-11-14T00:00:00Z',
      updatedAt: '2025-11-14T00:00:00Z',
    })

    // 렌더링이 에러 없이 완료되어야 함
    expect(() => render(<ArticleCard article={article} />)).not.toThrow()
  })
})
```

### 3. E2E 테스트 (Playwright)

**파일**: `e2e/listings.spec.ts` (신규 생성)
```typescript
import { test, expect } from '@playwright/test'

test.describe('Listings Page', () => {
  test('should display listings without runtime errors', async ({ page }) => {
    // 콘솔 에러 감지
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // 페이지 이동
    await page.goto('http://localhost:3000/listings')

    // 매물 카드가 렌더링되었는지 확인
    await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible()

    // 런타임 에러가 없는지 확인
    expect(consoleErrors).toEqual([])
  })

  test('should handle missing thumbnail gracefully', async ({ page }) => {
    // Mock API로 thumbnail이 없는 데이터 반환
    await page.route('**/api/listings', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          listings: [{
            id: 'listing-001',
            title: 'Test Listing',
            slug: 'test-listing',
            // thumbnail 없음
            location: { province: '서울' },
            price: { amount: 100000000, displayText: '1억원', isNegotiable: true },
            premiumAmount: 50000000,
            totalInvestment: 100000000,
            monthlyProfit: 5000000,
            area: { squareMeter: 100, pyeong: 30 },
            shortDescription: 'Test',
            status: 'active',
            viewCount: 0,
            isPremium: false,
            createdAt: '2025-11-14T00:00:00Z',
          }]
        })
      })
    })

    await page.goto('http://localhost:3000/listings')

    // Placeholder 이미지가 표시되어야 함
    await expect(page.locator('img[src="/images/placeholder.jpg"]').first()).toBeVisible()
  })
})
```

---

## 배포 체크리스트

### Pre-Production Checklist

#### 1. 코드 품질

- [ ] **타입 안정성**
  - [ ] Zod 스키마 정의 완료
  - [ ] 모든 Supabase 데이터 가져오기 함수에 검증 추가
  - [ ] ArticleCard.tsx 수정 완료
  - [ ] ListingCard.tsx 수정 완료
  - [ ] 기타 모든 컴포넌트 검토 완료

- [ ] **Next.js 16 호환성**
  - [ ] middleware.ts → proxy.ts 변경
  - [ ] 경고 메시지 0개 확인
  - [ ] 빌드 성공 확인

- [ ] **에러 처리**
  - [ ] 루트 에러 바운더리 추가 (`app/error.tsx`)
  - [ ] 페이지별 에러 바운더리 추가
  - [ ] 환경 변수 검증 추가 (`lib/env.ts`)

#### 2. 성능 최적화

- [ ] **이미지 최적화**
  - [ ] Next.js Image 컴포넌트 사용
  - [ ] remotePatterns 설정
  - [ ] Lazy loading 확인

- [ ] **로딩 상태**
  - [ ] 루트 loading.tsx 추가
  - [ ] 페이지별 loading.tsx 추가
  - [ ] Suspense 경계 추가

- [ ] **SEO**
  - [ ] 정적 metadata 추가
  - [ ] 동적 metadata 생성 함수 추가
  - [ ] robots.txt 생성
  - [ ] sitemap.xml 생성

#### 3. 보안

- [ ] **환경 변수**
  - [ ] .env.local 검증
  - [ ] 민감한 키 서버 측에만 사용
  - [ ] NEXT_PUBLIC_ prefix 올바르게 사용

- [ ] **Supabase**
  - [ ] Row Level Security (RLS) 설정 확인
  - [ ] API 키 권한 최소화
  - [ ] CORS 설정 확인

#### 4. 테스트

- [ ] **단위 테스트**
  - [ ] Zod 스키마 테스트 작성
  - [ ] 컴포넌트 렌더링 테스트 작성
  - [ ] 테스트 커버리지 > 70%

- [ ] **E2E 테스트**
  - [ ] 주요 사용자 플로우 테스트
  - [ ] 런타임 에러 감지 테스트
  - [ ] 모바일 환경 테스트

- [ ] **수동 테스트**
  - [ ] 모든 페이지 접속 확인
  - [ ] 콘솔 에러 0개 확인
  - [ ] 네트워크 에러 0개 확인

#### 5. 프로덕션 빌드

```bash
# 1. 타입 체크
npm run type-check
# 또는
npx tsc --noEmit

# 2. 린트
npm run lint

# 3. 빌드
npm run build

# 4. 빌드 결과 확인
# - 에러 0개
# - 경고 최소화
# - 번들 크기 확인

# 5. 프로덕션 서버 로컬 테스트
npm run start

# 6. Lighthouse 검사
# - Performance > 90
# - Accessibility > 90
# - Best Practices > 90
# - SEO > 90
```

#### 6. 배포 전 최종 확인

- [ ] **Git**
  - [ ] 모든 변경사항 커밋
  - [ ] 브랜치 병합
  - [ ] 태그 생성

- [ ] **Vercel (또는 배포 플랫폼)**
  - [ ] 환경 변수 설정
  - [ ] 도메인 연결
  - [ ] Preview 배포 테스트

- [ ] **모니터링**
  - [ ] 에러 트래킹 설정 (Sentry)
  - [ ] 분석 도구 설정 (Google Analytics)
  - [ ] 로그 수집 설정

---

## 결론 및 다음 단계

### 현재 상태

**프로덕션 준비도**: 🔴 **50/100** (프로덕션 부적합)

**주요 문제점**:
1. 타입 안정성 부재 (런타임 에러 발생)
2. 데이터 검증 미비
3. 에러 처리 부족

### 권장 조치 (우선순위 순)

#### Week 1: Critical Issues (4.5시간)
1. ✅ Zod 스키마 정의 (`lib/schemas.ts`)
2. ✅ ListingCard.tsx 수정
3. ✅ 환경 변수 검증 (`lib/env.ts`)
4. ✅ middleware → proxy 변경
5. ✅ 에러 바운더리 추가

**예상 효과**: 프로덕션 준비도 50 → 75

#### Week 2: Important Issues (11시간)
6. ✅ 데이터 검증 함수 (`lib/data.ts`)
7. ✅ 로딩 상태 추가
8. ✅ SEO metadata 추가
9. ✅ 전체 컴포넌트 검토

**예상 효과**: 프로덕션 준비도 75 → 85

#### Week 3-4: Nice to Have (17시간)
10. ✅ Next.js Image 적용
11. ✅ next.config 최적화
12. ✅ Suspense 경계 추가
13. ✅ 성능 최적화

**예상 효과**: 프로덕션 준비도 85 → 95+

### 예상 타임라인

```
주차 1: Critical Issues 해결
├─ Day 1-2: Zod 스키마 + 데이터 검증
├─ Day 3: ListingCard 수정 + 컴포넌트 검토
└─ Day 4-5: 에러 처리 + 환경 변수

주차 2: Important Issues 해결
├─ Day 1-2: 로딩 상태 + SEO
├─ Day 3-4: 전체 컴포넌트 검토
└─ Day 5: 테스트 작성

주차 3-4: Nice to Have + 최적화
├─ Week 3: 이미지 최적화 + Suspense
└─ Week 4: 성능 최적화 + 최종 테스트
```

### 성공 기준

**프로덕션 배포 가능 기준**:
- [ ] 프로덕션 준비도 > 85/100
- [ ] 런타임 에러 0건
- [ ] 콘솔 에러 0건
- [ ] 타입 체크 통과
- [ ] 빌드 성공
- [ ] E2E 테스트 통과
- [ ] Lighthouse 점수 > 90

---

**보고서 작성 일자**: 2025-11-14
**다음 검토 예정일**: 2025-11-28 (2주 후)

**문의사항**: 이 보고서에 대한 질문이나 추가 검토가 필요한 부분이 있으시면 말씀해주세요.
