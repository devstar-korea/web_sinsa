# 쉐어존 프로젝트 통합 실행 계획

**작성일**: 2025-11-14
**목적**: 기술 부채 해결 + 웹디자인 고도화 통합 계획
**실행 방식**: PAUSE (사용자 확인) + TASK (자동 실행) 순서 정리

---

## 📋 전체 개요

### 현재 상태
- **기술 스택**: Next.js 16.0.1 + React 19.2.0 + TypeScript + Tailwind CSS
- **디자인**: Pretendard 폰트 + Toss Blue 컬러 + shadcn/ui
- **데이터**: Dummy data (Supabase 연동 준비 중)
- **생산 점수**: 62.5/100 (목표: 85/100)

### 통합 목표
1. ✅ **보안 취약점 제거** (CVE-2025-29927)
2. ✅ **런타임 타입 안전성 확보**
3. 🎨 **웹디자인 고도화**
4. ⚡ **성능 최적화**

### 총 예상 시간
- **Phase 1 (Critical)**: 4.5시간
- **Phase 2 (Design)**: 16-20시간
- **Phase 3 (Optimization)**: 17시간
- **총합**: 37.5-41.5시간 (~5-6일)

---

## 🎯 Phase 1: Critical Issues (긴급 - 보안 & 안정성)

**목표**: 프로덕션 배포 전 필수 보안 및 안정성 확보
**기간**: 1일 (4.5시간)
**병렬 가능**: Task 1.1, 1.2, 1.4, 1.5 병렬 / Task 1.3 순차

---

### TASK 1.1: Zod 런타임 검증 스키마 정의
**시간**: 2시간
**병렬**: ✅ 가능 (다른 Task와 독립적)
**자동 실행**: ✅

#### 실행 내용
1. `lib/schemas.ts` 파일 생성
2. Article, Listing 타입에 대한 Zod 스키마 작성
3. Optional 필드 + default 값 정의
4. Type inference 설정

#### 코드 예시
```typescript
// lib/schemas.ts
import { z } from 'zod'

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  category: z.enum(['guide', 'tips', 'market']),

  // Optional with defaults
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
  publishedAt: z.string().datetime(),
  // ... rest
})

export type Article = z.infer<typeof ArticleSchema>

export const ListingSchema = z.object({
  // ... similar structure
})

export type Listing = z.infer<typeof ListingSchema>
```

#### 검증 기준
- [ ] 모든 타입에 스키마 정의
- [ ] Optional 필드 명시
- [ ] Default 값 설정
- [ ] TypeScript 타입 inference 작동

---

### TASK 1.2: ListingCard.tsx 타입 안전성 수정
**시간**: 30분
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용
1. `components/ListingCard.tsx` 29-30번 줄 수정
2. Optional chaining 적용
3. Fallback 값 추가

#### Before → After
```typescript
// Before (Line 29-30)
<img
  src={listing.thumbnail.url}              // ❌ Runtime error
  alt={listing.thumbnail.alt}              // ❌ Runtime error
  className="w-full h-full object-cover"
/>

// After
<img
  src={listing.thumbnail?.url || "/images/placeholder.jpg"}
  alt={listing.thumbnail?.alt || listing.title}
  className="w-full h-full object-cover"
/>
```

#### 검증 기준
- [ ] Runtime TypeError 제거
- [ ] Placeholder 이미지 표시
- [ ] ArticleCard.tsx 패턴 동일

---

### 🔴 PAUSE 1.3: middleware → proxy 마이그레이션 계획 검토

**이유**: 치명적 보안 취약점 (CVE-2025-29927) 확인 필요

#### 사용자 확인 필요 사항
1. **현재 middleware 사용 현황**:
   - ✅ middleware.ts 파일 존재 여부
   - ✅ 인증/인가 로직 포함 여부
   - ✅ 어떤 경로를 보호하고 있는지

2. **마이그레이션 영향도**:
   - ⚠️ Edge Runtime → Node.js Runtime 변경
   - ⚠️ 인증 로직 API Routes로 이동 필요
   - ⚠️ 성능 영향 (Edge는 더 빠름, Node.js는 더 많은 기능)

3. **보안 경고**:
   > **Vercel 공식 경고**: "DO NOT use middleware or proxy for authentication or authorization. Use API Routes or Server Components instead."

#### 질문
- [ ] middleware.ts 파일이 현재 존재합니까?
- [ ] 인증/인가 로직이 포함되어 있습니까?
- [ ] 마이그레이션을 진행할까요, 아니면 이 단계를 건너뛸까요?

---

### TASK 1.3: middleware → proxy 마이그레이션 (PAUSE 승인 후)
**시간**: 1시간
**병렬**: ❌ 순차 필수 (PAUSE 1.3 승인 후)
**자동 실행**: ⚠️ 조건부 (사용자 승인 시)

#### 실행 내용 (승인 시)
1. Codemod 자동 변환
   ```bash
   npx @next/codemod@latest middleware-to-proxy
   ```

2. 인증 로직 제거 및 API Routes로 이동
   ```typescript
   // Before: middleware.ts
   export function middleware(request: NextRequest) {
     const token = request.cookies.get('auth-token')
     if (!token) {
       return NextResponse.redirect('/login')  // ❌ Security risk
     }
   }

   // After: app/api/auth/verify/route.ts
   export async function GET(request: Request) {
     const token = cookies().get('auth-token')
     if (!token) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }
   }
   ```

3. 설정 파일 업데이트
   ```typescript
   // next.config.ts
   export default {
     experimental: {
       proxyTimeout: 30000,  // 30 seconds
     }
   }
   ```

#### 검증 기준
- [ ] Codemod 실행 성공
- [ ] 인증 로직 제거 완료
- [ ] API Routes로 마이그레이션
- [ ] 보안 스캔 통과

---

### TASK 1.4: 환경 변수 검증 시스템
**시간**: 1시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용
1. `lib/env.ts` 생성
2. Zod로 환경 변수 검증
3. Server/Client 분리

#### 코드 예시
```typescript
// lib/env.ts
import { z } from 'zod'

const serverSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_KEY: z.string(),
  DATABASE_URL: z.string().url().optional(),
})

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
})

const processEnv = {
  // Server
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

  // Client
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

const server = serverSchema.safeParse(processEnv)
const client = clientSchema.safeParse(processEnv)

if (!server.success) {
  console.error('❌ Invalid server environment variables:', server.error.flatten().fieldErrors)
  throw new Error('Invalid server environment variables')
}

if (!client.success) {
  console.error('❌ Invalid client environment variables:', client.error.flatten().fieldErrors)
  throw new Error('Invalid client environment variables')
}

export const env = {
  ...server.data,
  ...client.data,
}
```

#### 검증 기준
- [ ] 모든 환경 변수 검증
- [ ] Server/Client 분리
- [ ] 빌드 타임 검증 작동

---

### TASK 1.5: Error Boundary 구현
**시간**: 1시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용
1. `app/error.tsx` 생성 (Client Component)
2. `app/global-error.tsx` 생성
3. 개별 페이지 error.tsx 추가

#### 코드 예시
```typescript
// app/error.tsx
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
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">문제가 발생했습니다</h2>
        <p className="text-grey-600 mb-6">{error.message}</p>
        <Button onClick={reset}>다시 시도</Button>
      </div>
    </div>
  )
}

// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>전역 오류 발생</h2>
        <button onClick={reset}>다시 시도</button>
      </body>
    </html>
  )
}
```

#### 검증 기준
- [ ] error.tsx Client Component
- [ ] global-error.tsx 작동
- [ ] 에러 로깅 확인
- [ ] Reset 기능 작동

---

### ✅ PHASE 1 완료 체크리스트
- [ ] Task 1.1: Zod 스키마 정의 완료
- [ ] Task 1.2: ListingCard.tsx 수정 완료
- [ ] Pause 1.3: middleware 마이그레이션 승인/건너뛰기
- [ ] Task 1.3: middleware → proxy 완료 (승인 시)
- [ ] Task 1.4: 환경 변수 검증 완료
- [ ] Task 1.5: Error Boundary 완료
- [ ] npm run build 성공
- [ ] TypeScript 에러 0개
- [ ] 런타임 에러 0개

---

## 🎨 Phase 2: 웹디자인 고도화

**목표**: 현대적이고 사용자 친화적인 UI/UX 구현
**기간**: 2-3일 (16-20시간)
**의존성**: Phase 1 완료 후 진행

---

### 🔴 PAUSE 2.1: 디자인 방향성 결정

**현재 디자인 상태**:
- 메인 컬러: Toss Blue (#0064FF)
- 폰트: Pretendard Variable
- 컴포넌트: shadcn/ui
- 구조: Hero → Listings → Process → Articles → CTA

#### 사용자 결정 필요 사항

**1. 디자인 컨셉 선택**:
- [ ] **Option A**: Toss 스타일 유지 (미니멀, 깔끔, 신뢰감)
- [ ] **Option B**: 부동산 플랫폼 스타일 (직방, 다방 느낌)
- [ ] **Option C**: 프리미엄 스타일 (고급스러운, 차별화)
- [ ] **Option D**: 커스텀 (사용자 지정)

**2. 개선 우선순위** (1-5 선택):
- [ ] 1순위: ______________________
- [ ] 2순위: ______________________
- [ ] 3순위: ______________________
- [ ] 4순위: ______________________
- [ ] 5순위: ______________________

**개선 영역 옵션**:
- A. Hero Section (첫 화면 임팩트)
- B. 매물 카드 디자인 (썸네일, 정보 레이아웃)
- C. 상세 페이지 레이아웃
- D. 색상 시스템 (컬러 팔레트 확장)
- E. 타이포그래피 (폰트 크기, 계층)
- F. 애니메이션/인터랙션
- G. 반응형 디자인 (모바일 최적화)
- H. 접근성 (a11y)

**3. 참고 사이트** (선택사항):
- 좋아하는 디자인 예시 URL: ______________________

---

### TASK 2.2: 디자인 시스템 확장 (PAUSE 2.1 승인 후)
**시간**: 3시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용 (예시: Option A - Toss 스타일 유지)

1. **색상 시스템 확장**
```typescript
// tailwind.config.ts 업데이트
colors: {
  // 기존 tossBlue 유지
  tossBlue: '#0064FF',

  // 확장 색상
  brand: {
    50: '#E6F0FF',
    100: '#B3D7FF',
    200: '#80BFFF',
    300: '#4DA6FF',
    400: '#1A8DFF',
    500: '#0064FF',  // Main
    600: '#0050CC',
    700: '#003D99',
    800: '#002966',
    900: '#001633',
  },

  // Semantic colors
  success: {
    50: '#ECFDF5',
    500: '#10B981',
    700: '#047857',
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    700: '#B45309',
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    700: '#B91C1C',
  },
}
```

2. **타이포그래피 시스템 확장**
```typescript
fontSize: {
  // Display (Hero)
  'display-2xl': ['72px', { lineHeight: '90px', letterSpacing: '-0.04em', fontWeight: '700' }],
  'display-xl': ['60px', { lineHeight: '72px', letterSpacing: '-0.04em', fontWeight: '700' }],
  'display-lg': ['48px', { lineHeight: '60px', letterSpacing: '-0.03em', fontWeight: '700' }],

  // Heading (Section 제목)
  'heading-xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
  'heading-lg': ['30px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '700' }],
  'heading-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '700' }],

  // Body (본문)
  'body-xl': ['20px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
  'body-lg': ['18px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
  'body-md': ['16px', { lineHeight: '24px' }],
  'body-sm': ['14px', { lineHeight: '20px' }],

  // Caption
  'caption-md': ['13px', { lineHeight: '18px' }],
  'caption-sm': ['12px', { lineHeight: '16px' }],
}
```

3. **Spacing 시스템**
```typescript
spacing: {
  // 기존 Tailwind + 커스텀
  '18': '4.5rem',  // 72px
  '22': '5.5rem',  // 88px
  '26': '6.5rem',  // 104px
  '30': '7.5rem',  // 120px
}
```

4. **Shadow 시스템**
```typescript
boxShadow: {
  'card': '0 1px 3px rgba(0, 0, 0, 0.05)',
  'card-hover': '0 10px 40px rgba(0, 100, 255, 0.1)',
  'modal': '0 20px 60px rgba(0, 0, 0, 0.15)',
}
```

#### 검증 기준
- [ ] 색상 팔레트 확장 완료
- [ ] 타이포그래피 시스템 정의
- [ ] Spacing, Shadow 시스템 추가
- [ ] Storybook/예시 페이지 작동

---

### TASK 2.3: Hero Section 개선
**시간**: 2시간
**병렬**: ✅ 가능 (Task 2.2 완료 후)
**자동 실행**: ✅

#### 실행 내용

**Before (현재)**:
```typescript
<section className="bg-tossBlue text-white">
  <div className="max-w-7xl mx-auto px-4 py-20">
    <h1 className="text-main-xl text-white mb-8">
      운영 리스크 없이 만실! 수익 검증된 공유오피스에 투자하세요
    </h1>
  </div>
</section>
```

**After (개선)**:
```typescript
<section className="relative bg-gradient-to-br from-brand-500 to-brand-700 text-white overflow-hidden">
  {/* Background Pattern */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
  </div>

  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
    <div className="text-center max-w-4xl mx-auto">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-6">
        <span className="text-caption-md">✨ 매달 안정적인 월세 수익</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-display-xl md:text-display-2xl text-white mb-6">
        <span className="block mb-2">운영 리스크 없이</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
          만실 공유오피스에 투자하세요
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-body-xl text-white/90 mb-10 max-w-2xl mx-auto">
        검증된 수익 구조와 입주 대기 고객 리스트까지,
        <br className="hidden md:block" />
        초보자도 바로 시작할 수 있는 안정적인 투자 기회
      </p>

      {/* Trust Indicators */}
      <div className="flex flex-wrap justify-center gap-8 mb-10 text-body-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>평균 연 수익률 12%</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>만실 유지 운영 중</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>입주 대기 고객 보유</span>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          className="bg-white text-brand-600 hover:bg-grey-50 shadow-lg text-body-lg px-8 py-6"
          onClick={() => setIsBuyModalOpen(true)}
        >
          매물 인수 상담
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 text-body-lg px-8 py-6"
          onClick={() => setIsSellModalOpen(true)}
        >
          매각 상담
        </Button>
      </div>

      {/* Social Proof */}
      <div className="mt-12 flex items-center justify-center gap-8 text-caption-md text-white/70">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>지난달 상담 127건</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>거래 성사 23건</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### 개선 포인트
- ✅ Gradient 배경 + 패턴
- ✅ Badge 추가 (신뢰 신호)
- ✅ Heading 계층 개선
- ✅ Trust indicators 추가
- ✅ Social proof 추가
- ✅ 애니메이션 준비 (다음 단계)

#### 검증 기준
- [ ] 시각적 임팩트 향상
- [ ] 반응형 디자인 작동
- [ ] CTA 클릭률 측정 준비
- [ ] 접근성 (a11y) 검증

---

### TASK 2.4: 매물 카드 디자인 개선
**시간**: 3시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용

**Before (현재 ListingCard.tsx)**:
- 단순한 Card 레이아웃
- 썸네일 + 정보 나열
- Hover 효과 최소

**After (개선)**:
```typescript
// components/ListingCard.tsx
export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="group cursor-pointer">
      <Card className="overflow-hidden border-grey-200 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300">
        {/* Thumbnail with overlay */}
        <div className="relative h-56 bg-grey-100 overflow-hidden">
          <img
            src={listing.thumbnail?.url || "/images/placeholder.jpg"}
            alt={listing.thumbnail?.alt || listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Premium Badge */}
          {listing.isPremium && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md">
                <Star className="w-3 h-3 mr-1" />
                프리미엄
              </Badge>
            </div>
          )}

          {/* Quick Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-3 text-white text-caption-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {listing.location.province}
              </span>
              <span className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                {listing.area.squareMeter}㎡
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Location Badge */}
          <div className="mb-3">
            <Badge variant="secondary" className="bg-grey-100 text-grey-700 text-caption-sm">
              {listing.location.province}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-heading-md text-grey-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {listing.title}
          </h3>

          {/* Key Metrics - Grid Layout */}
          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-grey-200">
            <div>
              <p className="text-caption-sm text-grey-500 mb-1">권리금</p>
              <p className="text-body-md font-semibold text-grey-900">
                {listing.premiumAmount.toLocaleString()}만원
              </p>
            </div>
            <div>
              <p className="text-caption-sm text-grey-500 mb-1">월수익</p>
              <p className="text-body-md font-semibold text-success-600">
                {listing.monthlyProfit.toLocaleString()}만원
              </p>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption-sm text-grey-500">총 투자비용</p>
              <p className="text-heading-md font-bold text-brand-600">
                {listing.totalInvestment.toLocaleString()}만원
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-brand-600 hover:bg-brand-50"
            >
              자세히 보기
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
```

#### 개선 포인트
- ✅ Hover 인터랙션 강화
- ✅ 정보 계층 구조 개선
- ✅ Grid 레이아웃으로 가독성 향상
- ✅ Premium Badge 추가
- ✅ Quick Info Overlay
- ✅ Color coding (수익 = 녹색)

#### 검증 기준
- [ ] Hover 애니메이션 부드러움
- [ ] 정보 우선순위 명확
- [ ] 모바일 레이아웃 최적화
- [ ] 로딩 성능 유지

---

### TASK 2.5: Article 카드 디자인 개선
**시간**: 2시간
**병렬**: ✅ 가능 (Task 2.4와 병렬)
**자동 실행**: ✅

#### 실행 내용

**개선 포인트**:
- 카테고리별 컬러 코딩 강화
- 읽기 시간 추가
- 작성자 정보 강조
- Hover 효과 개선

```typescript
// components/ArticleCard.tsx
export default function ArticleCard({ article }: ArticleCardProps) {
  const categoryConfig = {
    guide: {
      label: '가이드',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: BookOpen,
    },
    tips: {
      label: '팁',
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: Lightbulb,
    },
    market: {
      label: '시장분석',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: TrendingUp,
    },
  }

  const config = categoryConfig[article.category]
  const Icon = config.icon

  return (
    <article className="group cursor-pointer h-full">
      <Card className="h-full flex flex-col overflow-hidden border-grey-200 hover:shadow-card-hover hover:border-brand-300 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative h-48 bg-grey-100 overflow-hidden">
          <img
            src={article.thumbnail?.url || "/images/placeholder.jpg"}
            alt={article.thumbnail?.alt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${config.color} border flex items-center gap-1`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5">
          {/* Title */}
          <h3 className="text-heading-md text-grey-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-body-md text-grey-600 mb-4 line-clamp-3 flex-1">
            {article.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t border-grey-200">
            {/* Author */}
            <div className="flex items-center gap-2">
              {article.author?.avatar && (
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <p className="text-caption-md font-medium text-grey-900">
                  {article.author?.name || "작성자"}
                </p>
                <p className="text-caption-sm text-grey-500">
                  {new Date(article.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-caption-sm text-grey-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {(article.viewCount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </article>
  )
}
```

#### 검증 기준
- [ ] 카테고리별 시각 구분 명확
- [ ] 작성자 정보 가독성 향상
- [ ] Hover 인터랙션 부드러움
- [ ] 반응형 레이아웃 작동

---

### TASK 2.6: 반응형 디자인 최적화
**시간**: 3시간
**병렬**: ❌ 순차 필수 (Task 2.3-2.5 완료 후)
**자동 실행**: ✅

#### 실행 내용

1. **모바일 네비게이션 개선**
```typescript
// components/layout/Header.tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

return (
  <header className="sticky top-0 z-50 bg-white border-b border-grey-200 backdrop-blur-lg bg-white/90">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="쉐어존" width={120} height={32} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/listings" className="text-body-md text-grey-700 hover:text-brand-600">
            매물 찾기
          </Link>
          <Link href="/articles" className="text-body-md text-grey-700 hover:text-brand-600">
            정보 센터
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <nav className="md:hidden py-4 border-t border-grey-200">
          <Link
            href="/listings"
            className="block py-3 text-body-md text-grey-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            매물 찾기
          </Link>
          <Link
            href="/articles"
            className="block py-3 text-body-md text-grey-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            정보 센터
          </Link>
        </nav>
      )}
    </div>
  </header>
)
```

2. **브레이크포인트 최적화**
```typescript
// tailwind.config.ts
screens: {
  'xs': '375px',   // iPhone SE
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

3. **터치 타겟 크기 확보**
```typescript
// 모든 버튼, 링크 최소 44x44px (iOS/Android 권장)
<Button className="min-h-[44px] min-w-[44px]">...</Button>
```

#### 검증 기준
- [ ] 모바일 (375px) 레이아웃 최적화
- [ ] 태블릿 (768px) 레이아웃 최적화
- [ ] 터치 타겟 44x44px 이상
- [ ] Chrome DevTools 모바일 시뮬레이션 통과

---

### TASK 2.7: 애니메이션 & 인터랙션 추가
**시간**: 3시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용

1. **Framer Motion 설치**
```bash
npm install framer-motion
```

2. **페이지 전환 애니메이션**
```typescript
// app/layout.tsx
import { AnimatePresence, motion } from 'framer-motion'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </body>
    </html>
  )
}
```

3. **Scroll-triggered 애니메이션**
```typescript
// components/FadeInSection.tsx
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function FadeInSection({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
```

4. **카드 Stagger 애니메이션**
```typescript
// components/FeaturedListings.tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.div
  variants={container}
  initial="hidden"
  animate="show"
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
>
  {listings.map((listing) => (
    <motion.div key={listing.id} variants={item}>
      <ListingCard listing={listing} />
    </motion.div>
  ))}
</motion.div>
```

#### 성능 고려사항
- ✅ GPU 가속 속성 사용 (transform, opacity)
- ✅ will-change 최소화
- ✅ 60fps 유지
- ⚠️ 모션 감소 설정 존중 (`prefers-reduced-motion`)

#### 검증 기준
- [ ] 페이지 전환 부드러움
- [ ] Scroll 애니메이션 작동
- [ ] 60fps 유지
- [ ] prefers-reduced-motion 지원

---

### ✅ PHASE 2 완료 체크리스트
- [ ] Pause 2.1: 디자인 방향성 승인
- [ ] Task 2.2: 디자인 시스템 확장
- [ ] Task 2.3: Hero Section 개선
- [ ] Task 2.4: 매물 카드 개선
- [ ] Task 2.5: Article 카드 개선
- [ ] Task 2.6: 반응형 최적화
- [ ] Task 2.7: 애니메이션 추가
- [ ] 모바일 테스트 통과
- [ ] 디자인 QA 통과
- [ ] 사용자 피드백 수집

---

## ⚡ Phase 3: 성능 & 최적화

**목표**: 프로덕션 수준의 성능 최적화
**기간**: 2-3일 (17시간)
**의존성**: Phase 2 완료 후 진행

---

### TASK 3.1: Next.js Image 최적화
**시간**: 4시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용

1. **모든 `<img>` → `<Image>` 변환**
```typescript
// Before
<img
  src={listing.thumbnail?.url || "/images/placeholder.jpg"}
  alt={listing.thumbnail?.alt || listing.title}
  className="w-full h-full object-cover"
/>

// After
import Image from 'next/image'

<Image
  src={listing.thumbnail?.url || "/images/placeholder.jpg"}
  alt={listing.thumbnail?.alt || listing.title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
  priority={index < 3}  // LCP optimization
/>
```

2. **Image 도메인 설정**
```typescript
// next.config.ts
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}
```

3. **Blur Placeholder**
```typescript
<Image
  src={url}
  alt={alt}
  fill
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."  // Generate with plaiceholder
/>
```

#### 성능 목표
- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ 이미지 용량 50% 감소 (WebP/AVIF)
- ✅ Lazy loading 자동 적용

#### 검증 기준
- [ ] 모든 이미지 Image 컴포넌트 사용
- [ ] Remote 도메인 등록
- [ ] Blur placeholder 적용
- [ ] Lighthouse 이미지 점수 > 90

---

### TASK 3.2: 코드 스플리팅 & Lazy Loading
**시간**: 3시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용

1. **Dynamic Import**
```typescript
// Before
import SellInquiryModal from '@/components/SellInquiryModal'

// After
import dynamic from 'next/dynamic'

const SellInquiryModal = dynamic(
  () => import('@/components/SellInquiryModal'),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,  // Client-only component
  }
)
```

2. **Route Segmentation**
```typescript
// app/listings/page.tsx
export const dynamic = 'force-dynamic'  // SSR
// or
export const dynamic = 'force-static'   // SSG
// or
export const revalidate = 60            // ISR (60s)
```

3. **Suspense Boundaries**
```typescript
import { Suspense } from 'react'

<Suspense fallback={<ListingsSkeleton />}>
  <FeaturedListings />
</Suspense>

<Suspense fallback={<ArticlesSkeleton />}>
  <FeaturedArticles />
</Suspense>
```

#### 검증 기준
- [ ] 번들 크기 < 200KB (gzip)
- [ ] 초기 로딩 < 1s
- [ ] TTI (Time to Interactive) < 3.5s

---

### TASK 3.3: 데이터 Fetching 최적화
**시간**: 3시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용

1. **Parallel Data Fetching**
```typescript
// app/page.tsx (Server Component)
async function getHomeData() {
  const [listings, articles] = await Promise.all([
    getAllListings(),
    getFeaturedArticles(),
  ])

  return { listings, articles }
}

export default async function Home() {
  const { listings, articles } = await getHomeData()

  return (
    <>
      <FeaturedListings listings={listings} />
      <FeaturedArticles articles={articles} />
    </>
  )
}
```

2. **React Query 통합** (선택사항)
```typescript
// lib/queries.ts
import { useQuery } from '@tanstack/react-query'

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: getAllListings,
    staleTime: 5 * 60 * 1000,  // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  })
}
```

3. **캐싱 전략**
```typescript
// lib/api/listings.ts
export async function getAllListings() {
  const res = await fetch('/api/listings', {
    next: {
      revalidate: 60,  // ISR 60초
      tags: ['listings'],  // Cache tag
    }
  })

  return res.json()
}

// Cache invalidation
import { revalidateTag } from 'next/cache'
revalidateTag('listings')
```

#### 검증 기준
- [ ] Parallel fetching 작동
- [ ] 캐싱 전략 적용
- [ ] Stale data 방지
- [ ] API 응답 시간 < 200ms

---

### TASK 3.4: SEO 최적화
**시간**: 2시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용

1. **Metadata API**
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: '쉐어존 - 검증된 공유오피스 매물 거래 플랫폼',
    template: '%s | 쉐어존',
  },
  description: '만실 공유오피스 매물을 안전하게 거래하세요. 운영 노하우와 입주 대기 고객까지 인수 가능합니다.',
  keywords: ['공유오피스', '매물', '창업', '투자', '임대', '부동산'],
  authors: [{ name: '쉐어존' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://sharezone.com',
    siteName: '쉐어존',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '쉐어존 - 공유오피스 매물 거래 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '쉐어존 - 검증된 공유오피스 매물',
    description: '만실 공유오피스 매물을 안전하게 거래하세요',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// app/listings/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const listing = await getListingById(params.id)

  return {
    title: listing.title,
    description: listing.shortDescription,
    openGraph: {
      images: [listing.thumbnail.url],
    },
  }
}
```

2. **Structured Data (JSON-LD)**
```typescript
// app/listings/[id]/page.tsx
export default async function ListingPage({ params }) {
  const listing = await getListingById(params.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.shortDescription,
    image: listing.thumbnail.url,
    price: listing.price.amount,
    priceCurrency: 'KRW',
    address: {
      '@type': 'PostalAddress',
      addressRegion: listing.location.province,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingDetail listing={listing} />
    </>
  )
}
```

3. **Sitemap & Robots.txt**
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getAllListings()

  const listingUrls = listings.map((listing) => ({
    url: `https://sharezone.com/listings/${listing.slug}`,
    lastModified: listing.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://sharezone.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://sharezone.com/listings',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...listingUrls,
  ]
}

// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://sharezone.com/sitemap.xml',
  }
}
```

#### 검증 기준
- [ ] Google Search Console 등록
- [ ] Structured Data 검증
- [ ] Sitemap 생성 확인
- [ ] Lighthouse SEO 점수 > 95

---

### TASK 3.5: 접근성 (a11y) 개선
**시간**: 3시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용

1. **ARIA 속성 추가**
```typescript
// components/layout/Header.tsx
<nav aria-label="주요 네비게이션">
  <Link href="/listings" aria-current={pathname === '/listings' ? 'page' : undefined}>
    매물 찾기
  </Link>
</nav>

<button
  aria-label="모바일 메뉴 열기"
  aria-expanded={isMobileMenuOpen}
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
>
  <Menu />
</button>
```

2. **Keyboard Navigation**
```typescript
// components/ListingCard.tsx
<div
  role="article"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCardClick()
    }
  }}
  onClick={handleCardClick}
  className="group cursor-pointer"
>
  <Card>...</Card>
</div>
```

3. **Focus Styles**
```typescript
// tailwind.config.ts
theme: {
  extend: {
    ringWidth: {
      '3': '3px',
    },
    ringColor: {
      'focus': '#0064FF',
    },
  },
}

// Global CSS
// app/globals.css
*:focus-visible {
  @apply outline-none ring-3 ring-brand-500 ring-offset-2;
}
```

4. **Color Contrast**
```typescript
// 모든 텍스트 색상 WCAG AA 기준 확인
// Light background
text-grey-900  // Contrast 12.63:1 ✅
text-grey-700  // Contrast 8.59:1 ✅
text-grey-600  // Contrast 7.23:1 ✅
text-grey-500  // Contrast 4.63:1 ✅

// Dark background
text-white     // Contrast 21:1 ✅
```

#### 검증 기준
- [ ] axe DevTools 0 issues
- [ ] Lighthouse Accessibility > 95
- [ ] Keyboard navigation 작동
- [ ] Screen reader 테스트 통과

---

### TASK 3.6: 모니터링 & 분석 설정
**시간**: 2시간
**병렬**: ✅ 가능
**자동 실행**: ✅

#### 실행 내용

1. **Web Vitals 추적**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

2. **Custom Event Tracking**
```typescript
// lib/analytics.ts
import { track } from '@vercel/analytics'

export function trackListingView(listingId: string) {
  track('listing_view', { listingId })
}

export function trackInquirySubmit(type: 'buy' | 'sell') {
  track('inquiry_submit', { type })
}

// components/ListingCard.tsx
const handleCardClick = () => {
  trackListingView(listing.id)
  router.push(`/listings/${listing.slug}`)
}
```

3. **Error Monitoring** (Sentry)
```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Filter out spam errors
    if (event.message?.includes('ResizeObserver')) {
      return null
    }
    return event
  },
})
```

#### 검증 기준
- [ ] Vercel Analytics 작동
- [ ] Web Vitals 수집
- [ ] Custom event tracking
- [ ] Error reporting 작동

---

### ✅ PHASE 3 완료 체크리스트
- [ ] Task 3.1: Next.js Image 최적화
- [ ] Task 3.2: 코드 스플리팅
- [ ] Task 3.3: 데이터 Fetching 최적화
- [ ] Task 3.4: SEO 최적화
- [ ] Task 3.5: 접근성 개선
- [ ] Task 3.6: 모니터링 설정
- [ ] Lighthouse 점수 > 90 (모든 항목)
- [ ] Core Web Vitals 통과
- [ ] 프로덕션 배포 준비 완료

---

## 🎯 최종 검증 & 배포

### 🔴 PAUSE FINAL: 프로덕션 배포 승인

#### 최종 체크리스트
**보안**:
- [ ] CVE-2025-29927 해결
- [ ] 환경 변수 검증 작동
- [ ] API Routes 보안 설정
- [ ] HTTPS 강제 적용

**성능**:
- [ ] Lighthouse Performance > 90
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

**품질**:
- [ ] TypeScript 에러 0개
- [ ] ESLint 경고 0개
- [ ] 모든 테스트 통과
- [ ] Cross-browser 테스트

**SEO**:
- [ ] Metadata 설정 완료
- [ ] Sitemap 생성
- [ ] Robots.txt 설정
- [ ] Structured Data 검증

**UX**:
- [ ] 모바일 반응형 완벽
- [ ] 접근성 점수 > 95
- [ ] 로딩 상태 표시
- [ ] 에러 처리 완료

#### 배포 승인 질문
1. 모든 Phase 완료되었습니까?
2. QA 테스트 통과했습니까?
3. 스테이징 환경 검증 완료했습니까?
4. 롤백 계획이 있습니까?
5. 프로덕션 배포를 승인하시겠습니까?

---

### TASK FINAL: 프로덕션 배포 (PAUSE FINAL 승인 후)
**시간**: 1시간
**자동 실행**: ⚠️ 조건부 (승인 후)

#### 실행 내용

1. **환경 변수 설정**
```bash
# Vercel 환경 변수
SUPABASE_URL=xxx
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SENTRY_DSN=xxx
```

2. **빌드 & 배포**
```bash
# 로컬 빌드 테스트
npm run build
npm start

# Vercel 배포
vercel --prod
```

3. **배포 후 검증**
- [ ] 프로덕션 URL 접속 확인
- [ ] Core Web Vitals 수집 시작
- [ ] Error 모니터링 작동
- [ ] Analytics 데이터 수집

---

## 📊 전체 실행 타임라인

### Week 1: Critical Issues
- **Day 1**: Phase 1 (4.5h)
  - Morning: Task 1.1, 1.2, 1.4, 1.5 (병렬)
  - Afternoon: Pause 1.3 → Task 1.3 (순차)

### Week 2: Design
- **Day 2**: Pause 2.1 → Task 2.2, 2.3 (6h)
- **Day 3**: Task 2.4, 2.5 (병렬, 5h)
- **Day 4**: Task 2.6, 2.7 (6h)

### Week 3: Optimization
- **Day 5**: Task 3.1, 3.2, 3.3 (병렬, 10h)
- **Day 6**: Task 3.4, 3.5, 3.6 (병렬, 7h)

### Week 4: QA & Deploy
- **Day 7**: QA Testing + Pause Final → Deploy

---

## 🎓 실행 가이드라인

### PAUSE 처리 방법
1. **사용자에게 질문**: 명확한 선택지 제시
2. **컨텍스트 제공**: 왜 이 결정이 필요한지 설명
3. **대기**: 사용자 응답까지 다음 Task 진행 안 함
4. **기록**: 사용자 결정 사항 문서화

### TASK 실행 방법
1. **자동 실행**: 사용자 승인 없이 바로 실행
2. **병렬 실행**: 독립적인 Task는 동시 진행
3. **순차 실행**: 의존성 있는 Task는 순서대로
4. **검증**: 각 Task 완료 후 검증 기준 확인

### 에러 발생 시
1. **중단**: 즉시 작업 중단
2. **보고**: 사용자에게 에러 상황 설명
3. **옵션 제시**: 계속/건너뛰기/롤백 선택지
4. **대기**: 사용자 지시까지 대기

---

## 📝 진행 상황 추적

### 현재 상태
- [ ] Phase 1: Critical Issues (0/5 tasks)
- [ ] Phase 2: Design (0/7 tasks)
- [ ] Phase 3: Optimization (0/6 tasks)
- [ ] Final: Deployment (0/1 task)

### 완료율
- **전체**: 0% (0/19 tasks)
- **예상 완료일**: Week 4
- **실제 완료일**: TBD

---

**다음 단계**: PAUSE 1.3 - middleware 마이그레이션 계획 검토

사용자 확인을 기다립니다.
