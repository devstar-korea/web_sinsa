-- ============================================================================
-- SHAREZONE 간단 스키마 (public 스키마 사용)
-- ============================================================================
-- 프로젝트: SHAREZONE - 공유오피스 M&A 플랫폼
-- Supabase 프로젝트: sharezone
-- 스키마: public (Supabase 기본)
-- 실행 위치: Supabase Dashboard > SQL Editor
-- 관리자: Supabase Auth 사용 (auth.users)
-- ============================================================================

-- ============================================================================
-- 1. 매물 테이블 (listings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.listings (
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
  operating_status VARCHAR(20) NOT NULL DEFAULT 'operating' CHECK (operating_status = 'operating'),

  -- 메타 정보
  opened_at DATE,
  view_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,

  -- Soft Delete
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES auth.users(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- 2. 매물 이미지 테이블 (listing_images) - 최대 8장
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 이미지 개수 제한 트리거
CREATE OR REPLACE FUNCTION public.check_listing_image_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.listing_images WHERE listing_id = NEW.listing_id) >= 8 THEN
    RAISE EXCEPTION '매물당 최대 8장의 이미지만 등록 가능합니다';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS listing_image_limit_trigger ON public.listing_images;
CREATE TRIGGER listing_image_limit_trigger
BEFORE INSERT ON public.listing_images
FOR EACH ROW EXECUTE FUNCTION public.check_listing_image_limit();

-- ============================================================================
-- 3. 아티클 테이블 (articles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('guide', 'tips', 'market')),
  excerpt TEXT,

  -- 썸네일
  thumbnail_url TEXT,
  thumbnail_alt VARCHAR(255),

  -- 저자
  author_name VARCHAR(100) NOT NULL,
  author_avatar TEXT,

  -- 메타
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,

  -- 블로그 연동
  is_imported BOOLEAN DEFAULT false,
  blog_platform VARCHAR(50),
  external_url TEXT,
  imported_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE,

  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- 4. 인수 상담 테이블 (purchase_inquiries)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.purchase_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id),

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
  assigned_to UUID REFERENCES auth.users(id),
  admin_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. 매각 상담 테이블 (register_inquiries)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.register_inquiries (
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
  assigned_to UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  linked_listing_id UUID REFERENCES public.listings(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 인덱스 생성
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_province ON public.listings(province);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON public.listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON public.articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_inquiries_status ON public.purchase_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_purchase_inquiries_listing_id ON public.purchase_inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_register_inquiries_status ON public.register_inquiries(status);

-- ============================================================================
-- 자동 업데이트 타임스탬프 트리거
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_listings_updated_at ON public.listings;
CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchase_inquiries_updated_at ON public.purchase_inquiries;
CREATE TRIGGER update_purchase_inquiries_updated_at
BEFORE UPDATE ON public.purchase_inquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_register_inquiries_updated_at ON public.register_inquiries;
CREATE TRIGGER update_register_inquiries_updated_at
BEFORE UPDATE ON public.register_inquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- Row Level Security (RLS) 활성화
-- ============================================================================
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.register_inquiries ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS 정책: 공개 읽기, 관리자만 쓰기
-- ============================================================================

-- Listings: 모두 읽기, 관리자만 쓰기
CREATE POLICY "Anyone can view active listings" ON public.listings
  FOR SELECT USING (status = 'active' AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can manage listings" ON public.listings
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Listing Images: listings 정책 따름
CREATE POLICY "Anyone can view listing images" ON public.listing_images
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage listing images" ON public.listing_images
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Articles: 모두 읽기, 관리자만 쓰기
CREATE POLICY "Anyone can view published articles" ON public.articles
  FOR SELECT USING (published_at <= NOW());

CREATE POLICY "Authenticated users can manage articles" ON public.articles
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Purchase Inquiries: 본인 것만 읽기, 누구나 생성, 관리자만 수정
CREATE POLICY "Users can view their own purchase inquiries" ON public.purchase_inquiries
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can create purchase inquiries" ON public.purchase_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage purchase inquiries" ON public.purchase_inquiries
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Register Inquiries: 본인 것만 읽기, 누구나 생성, 관리자만 수정
CREATE POLICY "Users can view their own register inquiries" ON public.register_inquiries
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can create register inquiries" ON public.register_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage register inquiries" ON public.register_inquiries
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- 완료!
-- ============================================================================
-- 다음 단계:
-- 1. Supabase Dashboard > SQL Editor에서 이 스크립트 실행
-- 2. 테이블 생성 확인 (Table Editor에서 확인 가능)
-- 3. 애플리케이션에서 Supabase 클라이언트로 데이터 연동
-- ============================================================================
