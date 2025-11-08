-- ============================================================================
-- SHAREZONE 스키마 생성 SQL
-- ============================================================================
-- 프로젝트: SHAREZONE (쉐어존) - 공유오피스 M&A 플랫폼
-- Supabase 프로젝트: cursor-mcp-dev (기존 프로젝트 재사용)
-- 스키마: sharezone (MCP 데이터와 격리)
-- 실행 위치: Supabase Dashboard > SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. sharezone 스키마 생성
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS sharezone;

-- ============================================================================
-- 2. 관리자 테이블 (sharezone.admins)
-- ============================================================================
CREATE TABLE sharezone.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'admin', 'staff')),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. 매물 테이블 (sharezone.listings)
-- ============================================================================
CREATE TABLE sharezone.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_number VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- 위치 정보
  province VARCHAR(50) NOT NULL,
  location_key VARCHAR(100),

  -- 기본 정보 (totalSeats → totalRooms 변경)
  total_rooms INTEGER NOT NULL,
  area_square_meter DECIMAL(10, 2) NOT NULL,
  area_pyeong DECIMAL(10, 2) NOT NULL,

  -- 주차 정보
  parking_free_spaces VARCHAR(100),      -- 무료주차 대수
  parking_monthly_method VARCHAR(200),   -- 입주사 월주차 방식
  parking_monthly_fee VARCHAR(100),      -- 입주사 월주차 요금

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
  operating_status VARCHAR(20) NOT NULL DEFAULT 'operating' CHECK (operating_status = 'operating'),  -- 운영중만 등록 가능

  -- 메타 정보
  opened_at DATE,
  view_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,

  -- Soft Delete (30일 보관 후 완전 삭제)
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES sharezone.admins(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES sharezone.admins(id),
  updated_by UUID REFERENCES sharezone.admins(id)
);

-- ============================================================================
-- 4. 매물 이미지 테이블 (sharezone.listing_images) - 최대 8장
-- ============================================================================
CREATE TABLE sharezone.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES sharezone.listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 이미지 개수 제한 (최대 8장)
CREATE OR REPLACE FUNCTION sharezone.check_listing_image_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM sharezone.listing_images WHERE listing_id = NEW.listing_id) >= 8 THEN
    RAISE EXCEPTION '매물당 최대 8장의 이미지만 등록 가능합니다';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listing_image_limit_trigger
BEFORE INSERT ON sharezone.listing_images
FOR EACH ROW EXECUTE FUNCTION sharezone.check_listing_image_limit();

-- ============================================
-- 5. 매물 히스토리 테이블 (sharezone.listing_history)
-- ============================================
CREATE TABLE sharezone.listing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES sharezone.listings(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'status_changed', 'image_added', 'image_removed')),
  admin_id UUID NOT NULL REFERENCES sharezone.admins(id),
  admin_name VARCHAR(100) NOT NULL,
  changes JSONB,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. 아티클 테이블 (sharezone.articles)
-- ============================================
CREATE TABLE sharezone.articles (
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
  created_by UUID REFERENCES sharezone.admins(id)
);

-- ============================================
-- 7. 인수 상담 테이블 (sharezone.purchase_inquiries)
-- ============================================
CREATE TABLE sharezone.purchase_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES sharezone.listings(id),

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
  assigned_to UUID REFERENCES sharezone.admins(id),
  admin_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. 매각 상담 테이블 (sharezone.register_inquiries)
-- ============================================
CREATE TABLE sharezone.register_inquiries (
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
  assigned_to UUID REFERENCES sharezone.admins(id),
  admin_notes TEXT,
  linked_listing_id UUID REFERENCES sharezone.listings(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. 이메일 설정 테이블 (sharezone.email_config)
-- ============================================
CREATE TABLE sharezone.email_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(50) UNIQUE NOT NULL,
  value VARCHAR(255) NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES sharezone.admins(id)
);

-- 기본 이메일 설정 데이터
INSERT INTO sharezone.email_config (key, value, description) VALUES
  ('inquiry_notification_email', 'biz.sharezone@gmail.com', '상담 신청 알림 수신 이메일'),
  ('system_email', 'biz.sharezone@gmail.com', '시스템 알림 수신 이메일');

-- ============================================
-- 인덱스 생성
-- ============================================
CREATE INDEX idx_sharezone_listings_status ON sharezone.listings(status);
CREATE INDEX idx_sharezone_listings_province ON sharezone.listings(province);
CREATE INDEX idx_sharezone_listings_created_at ON sharezone.listings(created_at DESC);
CREATE INDEX idx_sharezone_listing_images_listing_id ON sharezone.listing_images(listing_id);
CREATE INDEX idx_sharezone_listing_history_listing_id ON sharezone.listing_history(listing_id);
CREATE INDEX idx_sharezone_articles_category ON sharezone.articles(category);
CREATE INDEX idx_sharezone_articles_is_featured ON sharezone.articles(is_featured);
CREATE INDEX idx_sharezone_articles_published_at ON sharezone.articles(published_at DESC);
CREATE INDEX idx_sharezone_purchase_inquiries_status ON sharezone.purchase_inquiries(status);
CREATE INDEX idx_sharezone_purchase_inquiries_listing_id ON sharezone.purchase_inquiries(listing_id);
CREATE INDEX idx_sharezone_register_inquiries_status ON sharezone.register_inquiries(status);

-- ============================================
-- 자동 업데이트 타임스탬프 트리거
-- ============================================
CREATE OR REPLACE FUNCTION sharezone.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sharezone_listings_updated_at
BEFORE UPDATE ON sharezone.listings
FOR EACH ROW EXECUTE FUNCTION sharezone.update_updated_at_column();

CREATE TRIGGER update_sharezone_articles_updated_at
BEFORE UPDATE ON sharezone.articles
FOR EACH ROW EXECUTE FUNCTION sharezone.update_updated_at_column();

CREATE TRIGGER update_sharezone_purchase_inquiries_updated_at
BEFORE UPDATE ON sharezone.purchase_inquiries
FOR EACH ROW EXECUTE FUNCTION sharezone.update_updated_at_column();

CREATE TRIGGER update_sharezone_register_inquiries_updated_at
BEFORE UPDATE ON sharezone.register_inquiries
FOR EACH ROW EXECUTE FUNCTION sharezone.update_updated_at_column();

-- ============================================
-- 완료!
-- ============================================
-- sharezone 스키마 생성 완료
-- 다음 단계: Supabase 프로젝트를 재개한 후 이 SQL을 실행하세요
-- ============================================
