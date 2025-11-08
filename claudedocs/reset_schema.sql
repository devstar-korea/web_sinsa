-- ============================================================================
-- SHAREZONE 스키마 초기화 및 재생성
-- ============================================================================
-- 경고: 이 스크립트는 모든 기존 데이터를 삭제합니다!
-- ============================================================================

-- 1. 기존 테이블 삭제 (순서 중요 - 외래키 참조 순서)
DROP TABLE IF EXISTS public.listing_images CASCADE;
DROP TABLE IF EXISTS public.purchase_inquiries CASCADE;
DROP TABLE IF EXISTS public.register_inquiries CASCADE;
DROP TABLE IF EXISTS public.listings CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;

-- sharezone 스키마도 삭제 (이전 버전)
DROP SCHEMA IF EXISTS sharezone CASCADE;

-- ============================================================================
-- 2. 관리자 테이블
-- ============================================================================
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'admin', 'staff')),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. 매물 테이블
-- ============================================================================
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_number VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- 위치 정보
  province VARCHAR(50) NOT NULL,
  location_key VARCHAR(100),

  -- 기본 정보
  total_rooms INTEGER NOT NULL,
  area_square_meter DECIMAL(10, 2) NOT NULL,
  area_pyeong DECIMAL(10, 2) NOT NULL,

  -- 주차 정보
  parking_free_spaces VARCHAR(100),
  parking_monthly_method VARCHAR(200),
  parking_monthly_fee VARCHAR(100),

  -- 월매출 정보
  monthly_revenue_amount DECIMAL(15, 2),
  monthly_revenue_currency VARCHAR(10) DEFAULT 'KRW',

  -- 가격 정보
  price_amount DECIMAL(15, 2) NOT NULL,
  price_currency VARCHAR(10) DEFAULT 'KRW',

  -- 임대차 정보
  rental_deposit DECIMAL(15, 2),
  monthly_rent DECIMAL(15, 2),
  lease_period_years INTEGER,

  -- 관리비
  management_fee_method VARCHAR(200),

  -- 상세 정보
  description TEXT,
  highlights TEXT[],

  -- 메타데이터
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'pending', 'sold', 'inactive')),
  view_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.admins(id),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_province ON public.listings(province);
CREATE INDEX idx_listings_created_at ON public.listings(created_at DESC);

-- ============================================================================
-- 4. 매물 이미지 테이블
-- ============================================================================
CREATE TABLE public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_listing_images_listing_id ON public.listing_images(listing_id);
CREATE INDEX idx_listing_images_order ON public.listing_images(listing_id, display_order);

-- ============================================================================
-- 5. 아티클 테이블
-- ============================================================================
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  thumbnail_url TEXT,

  -- 분류
  category VARCHAR(50) NOT NULL,
  tags TEXT[],

  -- 메타데이터
  is_featured BOOLEAN DEFAULT FALSE,
  is_imported BOOLEAN DEFAULT FALSE,
  external_url TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,

  -- 작성자 및 일시
  created_by UUID REFERENCES public.admins(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_articles_published ON public.articles(published_at DESC);
CREATE INDEX idx_articles_featured ON public.articles(is_featured) WHERE is_featured = TRUE;

-- ============================================================================
-- 6. 인수 상담 테이블
-- ============================================================================
CREATE TABLE public.purchase_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,

  -- 신청자 정보
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,

  -- 상담 내용
  purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('investment', 'startup', 'expansion', 'other')),
  message TEXT,

  -- 관리 정보
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'qualified', 'converted', 'rejected')),
  assigned_to UUID REFERENCES public.admins(id),
  admin_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_purchase_status ON public.purchase_inquiries(status);
CREATE INDEX idx_purchase_created ON public.purchase_inquiries(created_at DESC);

-- ============================================================================
-- 7. 매각 상담 테이블
-- ============================================================================
CREATE TABLE public.register_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 신청자 정보
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,

  -- 사업장 정보
  location VARCHAR(255) NOT NULL,
  area_range VARCHAR(50),
  price_range VARCHAR(50),
  message TEXT,

  -- 관리 정보
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'qualified', 'converted', 'rejected')),
  assigned_to UUID REFERENCES public.admins(id),
  admin_notes TEXT,
  linked_listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_register_status ON public.register_inquiries(status);
CREATE INDEX idx_register_created ON public.register_inquiries(created_at DESC);

-- ============================================================================
-- 8. Row Level Security (RLS) 활성화
-- ============================================================================

-- RLS 활성화
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.register_inquiries ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. RLS 정책 (공개 읽기, 인증된 사용자만 쓰기)
-- ============================================================================

-- Listings: 공개 읽기 (active만)
CREATE POLICY "listings_public_read" ON public.listings
  FOR SELECT USING (status = 'active' AND deleted_at IS NULL);

-- Listings: 관리자만 전체 접근
CREATE POLICY "listings_admin_all" ON public.listings
  FOR ALL USING (auth.role() = 'authenticated');

-- Listing Images: 공개 읽기
CREATE POLICY "listing_images_public_read" ON public.listing_images
  FOR SELECT USING (true);

CREATE POLICY "listing_images_admin_all" ON public.listing_images
  FOR ALL USING (auth.role() = 'authenticated');

-- Articles: 공개 읽기 (published만)
CREATE POLICY "articles_public_read" ON public.articles
  FOR SELECT USING (published_at <= NOW());

CREATE POLICY "articles_admin_all" ON public.articles
  FOR ALL USING (auth.role() = 'authenticated');

-- Inquiries: 누구나 생성 가능
CREATE POLICY "purchase_inquiries_public_insert" ON public.purchase_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "purchase_inquiries_admin_all" ON public.purchase_inquiries
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "register_inquiries_public_insert" ON public.register_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "register_inquiries_admin_all" ON public.register_inquiries
  FOR ALL USING (auth.role() = 'authenticated');

-- Admins: 관리자만 접근
CREATE POLICY "admins_admin_only" ON public.admins
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- 완료 메시지
-- ============================================================================
SELECT 'Schema reset and recreated successfully!' as message;
