# 다음 세션 가이드 - SHAREZONE 관리자 페이지 개발

## 📅 세션 정보
- **작성일**: 2025-11-08
- **다음 작업**: Supabase 데이터베이스 구축 및 관리자 페이지 개발
- **진행 상태**: 기획 완료, 데이터베이스 스키마 설계 완료

---

## 🎯 현재까지 완료된 작업

### 1. 사용자 페이지 (완료)
- ✅ 홈페이지 구현 (Hero, Featured Listings, Articles, CTA)
- ✅ 매물 목록 페이지 (지역 필터, 정렬)
- ✅ 매물 상세 페이지
- ✅ 인수/매각 상담 모달
- ✅ shadcn/ui 컴포넌트 마이그레이션 완료 (Button, Input, Textarea, Dialog, Card, Badge)
- ✅ Lucide React 아이콘 적용

### 2. 관리자 페이지 기획 (완료)
- ✅ IA 구조 설계
- ✅ 기능 명세 정의
- ✅ UI/UX 설계
- ✅ 데이터베이스 스키마 설계 (PostgreSQL)

---

## 🚀 다음 세션에서 할 작업

### **Phase 1: Supabase 데이터베이스 구축**

#### Step 1: Supabase 프로젝트 생성
```bash
# 1. Supabase 가입 및 프로젝트 생성
https://supabase.com

# 2. 패키지 설치
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# 3. 환경 변수 설정 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Step 2: 데이터베이스 스키마 생성
**위치**: Supabase Dashboard > SQL Editor

**실행할 SQL 파일**: 아래 스키마를 순서대로 실행

```sql
-- ============================================
-- 1. 관리자 테이블 (admins)
-- ============================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'admin', 'staff')),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. 매물 테이블 (listings)
-- ============================================
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_number VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- 위치 정보
  province VARCHAR(50) NOT NULL,
  location_key VARCHAR(100),

  -- 기본 정보 (룸 개수로 변경됨)
  total_rooms INTEGER NOT NULL,
  area_square_meter DECIMAL(10, 2) NOT NULL,
  area_pyeong DECIMAL(10, 2) NOT NULL,

  -- 재정 정보
  price_amount BIGINT NOT NULL,
  price_display_text VARCHAR(100),
  price_is_negotiable BOOLEAN DEFAULT true,
  premium_amount BIGINT NOT NULL,
  total_investment BIGINT NOT NULL,
  monthly_profit BIGINT NOT NULL,

  -- 설명
  short_description TEXT,
  description TEXT,

  -- 상태
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'hidden', 'sold')),
  operating_status VARCHAR(20) NOT NULL DEFAULT 'operating',

  -- 메타 정보
  opened_at DATE,
  view_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admins(id),
  updated_by UUID REFERENCES admins(id)
);

-- ============================================
-- 3. 매물 이미지 테이블 (listing_images) - 최대 8장
-- ============================================
CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 이미지 개수 제한 (최대 8장)
CREATE OR REPLACE FUNCTION check_listing_image_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM listing_images WHERE listing_id = NEW.listing_id) >= 8 THEN
    RAISE EXCEPTION '매물당 최대 8장의 이미지만 등록 가능합니다';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listing_image_limit_trigger
BEFORE INSERT ON listing_images
FOR EACH ROW EXECUTE FUNCTION check_listing_image_limit();

-- ============================================
-- 4. 매물 히스토리 테이블 (listing_history)
-- ============================================
CREATE TABLE listing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'status_changed', 'image_added', 'image_removed')),
  admin_id UUID NOT NULL REFERENCES admins(id),
  admin_name VARCHAR(100) NOT NULL,
  changes JSONB,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. 아티클 테이블 (articles)
-- ============================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('guide', 'tips', 'market')),
  excerpt TEXT,
  content TEXT NOT NULL,

  -- 썸네일
  thumbnail_url TEXT,
  thumbnail_alt VARCHAR(255),

  -- 저자
  author_name VARCHAR(100) NOT NULL,
  author_avatar TEXT,

  -- 메타
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,

  -- 블로그 API 연동
  is_imported BOOLEAN DEFAULT false,
  blog_platform VARCHAR(50),
  external_id VARCHAR(255),
  external_url TEXT,
  imported_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE,

  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admins(id)
);

-- ============================================
-- 6. 인수 상담 테이블 (purchase_inquiries)
-- ============================================
CREATE TABLE purchase_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),

  -- 신청자 정보
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,

  -- 문의 내용
  purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('investment', 'startup', 'expansion', 'other')),
  message TEXT,

  -- 상태 관리
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'qualified', 'converted', 'rejected')),

  -- 관리자 관리
  assigned_to UUID REFERENCES admins(id),
  admin_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. 매각 상담 테이블 (register_inquiries)
-- ============================================
CREATE TABLE register_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 신청자 정보
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,

  -- 희망 조건
  location VARCHAR(100) NOT NULL,
  area_range VARCHAR(50),
  price_range VARCHAR(50),
  message TEXT,

  -- 상태 관리
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'qualified', 'converted', 'rejected')),

  -- 관리자 관리
  assigned_to UUID REFERENCES admins(id),
  admin_notes TEXT,
  linked_listing_id UUID REFERENCES listings(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. 이메일 설정 테이블 (email_config)
-- ============================================
CREATE TABLE email_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(50) UNIQUE NOT NULL,
  value VARCHAR(255) NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES admins(id)
);

-- 기본 이메일 설정 데이터
INSERT INTO email_config (key, value, description) VALUES
  ('inquiry_notification_email', 'biz.sharezone@gmail.com', '상담 신청 알림 수신 이메일'),
  ('system_email', 'biz.sharezone@gmail.com', '시스템 알림 수신 이메일');

-- ============================================
-- 인덱스 생성
-- ============================================
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_province ON listings(province);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX idx_listing_history_listing_id ON listing_history(listing_id);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_is_featured ON articles(is_featured);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_purchase_inquiries_status ON purchase_inquiries(status);
CREATE INDEX idx_purchase_inquiries_listing_id ON purchase_inquiries(listing_id);
CREATE INDEX idx_register_inquiries_status ON register_inquiries(status);

-- ============================================
-- 자동 업데이트 타임스탬프 트리거
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_inquiries_updated_at BEFORE UPDATE ON purchase_inquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_register_inquiries_updated_at BEFORE UPDATE ON register_inquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Step 3: Supabase 클라이언트 설정
**파일 생성**: `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### Step 4: TypeScript 타입 업데이트
**파일 수정**: `lib/types.ts`

주요 변경사항:
```typescript
// 1. totalSeats → totalRooms 변경
export interface Listing {
  totalRooms: number  // ✅ 변경됨
  // ... 기타 필드
}

// 2. 블로그 연동 필드 추가
export interface Article {
  isImported: boolean
  blogPlatform?: string
  externalId?: string
  externalUrl?: string
  importedAt?: string
  lastSyncedAt?: string
  // ... 기타 필드
}

// 3. Admin 타입 추가
export interface Admin {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'staff'
  createdAt: string
  updatedAt: string
}

// 4. ListingHistory 타입 추가
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

// 5. EmailConfig 타입 추가
export interface EmailConfig {
  id: string
  key: string
  value: string
  description?: string
  updatedAt: string
  updatedBy?: string
}
```

---

## 📋 Phase 2: API 라우트 구축 (다음 작업)

### 생성할 API 엔드포인트

```
/app/api/
├── admin/
│   ├── auth/
│   │   ├── login/route.ts (POST)
│   │   └── logout/route.ts (POST)
│   ├── listings/
│   │   ├── route.ts (GET, POST)
│   │   ├── [id]/route.ts (GET, PUT, DELETE)
│   │   └── [id]/history/route.ts (GET)
│   ├── articles/
│   │   ├── route.ts (GET, POST)
│   │   └── [id]/route.ts (GET, PUT, DELETE)
│   └── inquiries/
│       ├── purchase/route.ts (GET, PUT)
│       └── register/route.ts (GET, PUT)
└── public/
    ├── inquiries/
    │   ├── purchase/route.ts (POST) - 인수 상담 신청
    │   └── register/route.ts (POST) - 매각 상담 신청
    └── listings/
        └── route.ts (GET) - 공개 매물 목록
```

---

## 🎨 Phase 3: 관리자 페이지 UI 구축 (이후 작업)

### 필요한 shadcn/ui 컴포넌트 추가
```bash
npx shadcn@latest add table
npx shadcn@latest add select
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add tabs
npx shadcn@latest add switch
npx shadcn@latest add alert-dialog
npx shadcn@latest add toast
npx shadcn@latest add calendar
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add separator
```

### 페이지 구조
```
/app/admin/
├── layout.tsx (관리자 레이아웃)
├── page.tsx (대시보드)
├── listings/
│   ├── page.tsx (매물 목록)
│   ├── new/page.tsx (신규 등록)
│   └── [id]/
│       ├── page.tsx (수정)
│       └── history/page.tsx (히스토리)
├── articles/
│   ├── page.tsx (아티클 목록)
│   ├── new/page.tsx (작성)
│   ├── import/page.tsx (블로그 연동)
│   └── [id]/page.tsx (수정)
├── inquiries/
│   ├── purchase/page.tsx (인수 상담)
│   └── register/page.tsx (매각 상담)
└── settings/
    ├── page.tsx (설정)
    └── notifications/page.tsx (이메일 설정)
```

---

## ⚠️ 중요 요구사항 체크리스트

### 데이터 관련
- [ ] Listing: totalSeats → totalRooms 변경
- [ ] 이미지: 최대 8장 제한 (트리거로 강제)
- [ ] 매물 히스토리: 모든 변경사항 자동 기록

### 기능 관련
- [ ] 블로그 API 연동 (티스토리, 네이버, 워드프레스)
- [ ] 상담 신청 시 이메일 알림 (biz.sharezone@gmail.com)
- [ ] 상담 → 매물 연결 기능 (linkedListingId)

### 보안 관련
- [ ] Row Level Security (RLS) 설정
- [ ] 관리자 인증/권한 시스템
- [ ] API 라우트 미들웨어 보호

---

## 🔧 개발 환경 설정

### 환경 변수 (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# 이메일 (추후 설정)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=biz.sharezone@gmail.com
```

### 설치할 추가 패키지
```bash
# Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# 폼 관리
npm install react-hook-form @hookform/resolvers zod

# 이미지 업로드
npm install react-dropzone

# 마크다운 에디터
npm install @uiw/react-md-editor react-markdown remark-gfm rehype-raw

# 날짜 처리
npm install date-fns

# 이메일 발송 (추후)
npm install nodemailer @types/nodemailer
```

---

## 📝 다음 세션 시작 방법

```bash
# 1. 프로젝트 디렉토리 이동
cd C:\Users\jy121\.cursor\cursor.project\web_sinsa

# 2. 개발 서버 실행
npm run dev

# 3. 이 가이드 확인
cat claudedocs/NEXT_SESSION_GUIDE.md

# 4. Supabase 프로젝트 생성부터 시작
https://supabase.com
```

---

## 📌 참고 문서

- **관리자 페이지 기획서**: 이전 세션 대화 내역 참고
- **데이터베이스 스키마**: 위 SQL 섹션
- **현재 프로젝트 상태**:
  - shadcn/ui 마이그레이션 완료
  - 사용자 페이지 완성
  - Toss Design System 적용 (Blue #0064FF)

---

## 🎯 최종 목표

**Phase 1 MVP 완성 시점**:
- ✅ Supabase 데이터베이스 구축
- ✅ 관리자 로그인 시스템
- ✅ 매물 관리 (CRUD)
- ✅ 상담 관리 (목록, 상세, 상태 변경)
- ✅ 기본 대시보드
- ✅ 상담 신청 시 이메일 알림

**예상 소요 시간**: 2-3 세션 (각 2-3시간)

---

## 💡 팁

1. **Supabase Dashboard 활용**
   - Table Editor: 데이터 직접 확인/수정
   - SQL Editor: 쿼리 테스트
   - Authentication: 인증 설정
   - Storage: 이미지 업로드용

2. **개발 순서**
   - DB 스키마 먼저 완성
   - API 라우트 구축
   - UI 컴포넌트 개발
   - 통합 테스트

3. **더미 데이터 마이그레이션**
   - 현재 lib/dummy-data.ts의 데이터를 Supabase로 이전
   - 개발/테스트 용도로 유지

---

**다음 세션에서 만나요!** 🚀
