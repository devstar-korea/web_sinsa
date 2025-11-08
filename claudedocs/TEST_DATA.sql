-- ShareZone 테스트 데이터 삽입 스크립트
-- Supabase SQL Editor에서 실행하세요

-- ============================================
-- 1. 매물 데이터 (Listings)
-- ============================================

INSERT INTO listings (
  id,
  title,
  slug,
  province,
  district,
  address,
  total_rooms,
  area_square_meter,
  area_pyeong,
  price_amount,
  price_display_text,
  premium_amount,
  total_investment,
  monthly_profit,
  annual_yield,
  lease_type,
  remaining_lease,
  occupancy_rate,
  key_features,
  nearby_facilities,
  status,
  view_count,
  show_on_homepage,
  created_at,
  updated_at
) VALUES
-- 매물 1: 강남 공유오피스
(
  gen_random_uuid(),
  '강남역 도보 5분 프리미엄 공유오피스',
  'gangnam-premium-office',
  '서울',
  '강남구',
  '서울시 강남구 테헤란로 123',
  25,
  165.3,
  50.0,
  500000000,
  '5억',
  50000000,
  550000000,
  10000000,
  21.8,
  '임대차',
  36,
  92,
  ARRAY['강남역 도보 5분', '최신 인테리어', '24시간 운영', '주차 10대'],
  ARRAY['강남역', '코엑스', '삼성역'],
  'active',
  1245,
  true,
  NOW() - INTERVAL '15 days',
  NOW()
),

-- 매물 2: 홍대 공유오피스
(
  gen_random_uuid(),
  '홍대입구역 초역세권 공유오피스',
  'hongdae-station-office',
  '서울',
  '마포구',
  '서울시 마포구 양화로 456',
  18,
  132.2,
  40.0,
  380000000,
  '3.8억',
  38000000,
  418000000,
  7500000,
  21.5,
  '임대차',
  42,
  88,
  ARRAY['홍대입구역 1분', '젊은 분위기', '카페 거리 인접', '주차 8대'],
  ARRAY['홍대입구역', '연남동', '합정역'],
  'active',
  892,
  true,
  NOW() - INTERVAL '10 days',
  NOW()
),

-- 매물 3: 판교 공유오피스
(
  gen_random_uuid(),
  '판교 테크노밸리 스타트업 공유오피스',
  'pangyo-techno-valley',
  '경기',
  '성남시 분당구',
  '경기도 성남시 분당구 판교역로 789',
  30,
  198.4,
  60.0,
  620000000,
  '6.2억',
  62000000,
  682000000,
  12000000,
  21.1,
  '임대차',
  48,
  95,
  ARRAY['판교역 도보 3분', 'IT 기업 밀집', '미팅룸 5개', '주차 15대'],
  ARRAY['판교역', '네이버', '카카오'],
  'active',
  2103,
  true,
  NOW() - INTERVAL '5 days',
  NOW()
),

-- 매물 4: 여의도 공유오피스
(
  gen_random_uuid(),
  '여의도 금융중심가 프리미엄 오피스',
  'yeouido-finance-office',
  '서울',
  '영등포구',
  '서울시 영등포구 여의대로 321',
  22,
  148.8,
  45.0,
  480000000,
  '4.8억',
  48000000,
  528000000,
  9500000,
  21.6,
  '임대차',
  40,
  90,
  ARRAY['여의도역 도보 2분', '한강뷰', '고급 인테리어', '주차 12대'],
  ARRAY['여의도역', '국회의사당', '한강공원'],
  'active',
  1567,
  true,
  NOW() - INTERVAL '8 days',
  NOW()
),

-- 매물 5: 신촌 공유오피스 (계약 완료)
(
  gen_random_uuid(),
  '신촌역 청년 창업 공유오피스',
  'sinchon-startup-office',
  '서울',
  '서대문구',
  '서울시 서대문구 신촌역로 147',
  15,
  99.2,
  30.0,
  280000000,
  '2.8억',
  28000000,
  308000000,
  6000000,
  23.4,
  '임대차',
  24,
  85,
  ARRAY['신촌역 직결', '저렴한 임대료', '청년 특화', '주차 6대'],
  ARRAY['신촌역', '이대역', '연세대'],
  'sold',
  834,
  false,
  NOW() - INTERVAL '25 days',
  NOW()
);

-- ============================================
-- 2. 매물 이미지 (Listing Images)
-- ============================================

-- 실제 프로젝트에서는 Unsplash나 실제 이미지를 사용하세요
-- 여기서는 placeholder 이미지를 사용합니다

DO $$
DECLARE
  listing_record RECORD;
  image_number INT;
BEGIN
  FOR listing_record IN SELECT id FROM listings LOOP
    FOR image_number IN 1..5 LOOP
      INSERT INTO listing_images (
        id,
        listing_id,
        url,
        alt,
        display_order,
        is_primary,
        created_at
      ) VALUES (
        gen_random_uuid(),
        listing_record.id,
        'https://images.unsplash.com/photo-149736621' || image_number || '?w=800&h=600&fit=crop',
        '공유오피스 이미지 ' || image_number,
        image_number - 1,
        image_number = 1,
        NOW()
      );
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- 3. 아티클 데이터 (Articles)
-- ============================================

INSERT INTO articles (
  id,
  title,
  slug,
  category,
  excerpt,
  content_html,
  thumbnail_url,
  author_name,
  author_image,
  view_count,
  is_featured,
  external_url,
  last_synced_at,
  published_at,
  created_at,
  updated_at
) VALUES
-- 아티클 1: 가이드
(
  gen_random_uuid(),
  '공유오피스 창업 완벽 가이드: A부터 Z까지',
  'complete-guide-to-shared-office',
  'guide',
  '공유오피스 창업을 준비하는 예비 창업자를 위한 완벽 가이드입니다. 입지 선정부터 운영 노하우까지 모든 것을 담았습니다.',
  '<h2>공유오피스 창업, 어떻게 시작할까요?</h2><p>공유오피스는 최근 가장 주목받는 창업 아이템 중 하나입니다...</p>',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  '김창업',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  2345,
  true,
  'https://blog.sharezone.com/guide-to-shared-office',
  NOW(),
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days',
  NOW()
),

-- 아티클 2: 팁
(
  gen_random_uuid(),
  '공유오피스 수익률 극대화하는 5가지 전략',
  'maximize-shared-office-profit',
  'tips',
  '공유오피스 운영 수익률을 높이는 실전 전략을 소개합니다. 검증된 노하우로 매출을 2배 높이세요.',
  '<h2>수익률을 높이는 핵심 전략</h2><p>1. 차별화된 서비스 제공...</p>',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
  '이수익',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  1823,
  true,
  'https://blog.sharezone.com/maximize-profit',
  NOW(),
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days',
  NOW()
),

-- 아티클 3: 시장 분석
(
  gen_random_uuid(),
  '2025년 공유오피스 시장 전망과 투자 기회',
  '2025-shared-office-market-outlook',
  'market',
  '2025년 공유오피스 시장은 어떻게 변화할까요? 최신 시장 데이터와 전망을 통해 투자 기회를 찾아보세요.',
  '<h2>시장 규모와 성장 전망</h2><p>국내 공유오피스 시장은 연평균 15% 이상 성장하고 있습니다...</p>',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  '박시장',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  3021,
  true,
  'https://blog.sharezone.com/2025-market-outlook',
  NOW(),
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days',
  NOW()
),

-- 아티클 4: 가이드
(
  gen_random_uuid(),
  '공유오피스 입지 선정의 모든 것',
  'choosing-right-location',
  'guide',
  '성공적인 공유오피스를 위한 입지 선정 가이드. 교통, 상권, 경쟁 분석까지 한번에 확인하세요.',
  '<h2>입지가 성공의 80%를 결정합니다</h2><p>입지 선정 시 고려해야 할 핵심 요소들...</p>',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
  '최입지',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  1456,
  false,
  'https://blog.sharezone.com/choosing-location',
  NOW(),
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '12 days',
  NOW()
),

-- 아티클 5: 팁
(
  gen_random_uuid(),
  '공유오피스 회원 유치를 위한 마케팅 전략',
  'marketing-strategy-for-members',
  'tips',
  '효과적인 마케팅으로 회원을 빠르게 유치하는 방법. SNS부터 오프라인까지 실전 노하우를 공개합니다.',
  '<h2>회원 유치 마케팅의 핵심</h2><p>초기 회원 확보가 성공의 열쇠입니다...</p>',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
  '정마케팅',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  987,
  false,
  'https://blog.sharezone.com/marketing-strategy',
  NOW(),
  NOW() - INTERVAL '18 days',
  NOW() - INTERVAL '18 days',
  NOW()
),

-- 아티클 6: 시장 분석
(
  gen_random_uuid(),
  '강남 vs 판교: 공유오피스 시장 비교 분석',
  'gangnam-vs-pangyo-comparison',
  'market',
  '강남과 판교, 어디가 더 유망한 공유오피스 입지일까요? 데이터 기반 비교 분석으로 확인하세요.',
  '<h2>두 지역의 시장 특성 비교</h2><p>강남과 판교는 각각 다른 매력을 가지고 있습니다...</p>',
  'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800&h=600&fit=crop',
  '강비교',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
  1654,
  true,
  'https://blog.sharezone.com/gangnam-vs-pangyo',
  NOW(),
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days',
  NOW()
);

-- ============================================
-- 4. 인수 상담 데이터 (Purchase Inquiries)
-- ============================================

INSERT INTO purchase_inquiries (
  id,
  listing_id,
  name,
  phone,
  email,
  purpose,
  message,
  status,
  assigned_to,
  admin_notes,
  created_at,
  updated_at
) VALUES
-- 인수 상담 1: 대기
(
  gen_random_uuid(),
  (SELECT id FROM listings WHERE slug = 'gangnam-premium-office'),
  '홍길동',
  '010-1234-5678',
  'hong@example.com',
  'investment',
  '강남 공유오피스에 관심이 있습니다. 투자 수익률과 현재 운영 상태에 대해 상담받고 싶습니다.',
  'pending',
  NULL,
  NULL,
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
),

-- 인수 상담 2: 연락완료
(
  gen_random_uuid(),
  (SELECT id FROM listings WHERE slug = 'hongdae-station-office'),
  '김투자',
  '010-2345-6789',
  'kim@example.com',
  'investment',
  '홍대 매물 현장 방문 일정을 잡고 싶습니다.',
  'contacted',
  NULL,
  '2025-11-10 14:00 현장 방문 예약 완료',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '6 hours'
),

-- 인수 상담 3: 검증완료
(
  gen_random_uuid(),
  (SELECT id FROM listings WHERE slug = 'pangyo-techno-valley'),
  '이사장',
  '010-3456-7890',
  'lee@example.com',
  'business',
  '판교 공유오피스를 직접 운영하고 싶습니다. 인수 후 운영 지원도 가능한가요?',
  'qualified',
  NULL,
  '현장 실사 완료. 재무 검증 중. 운영 교육 프로그램 안내 완료.',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '1 day'
),

-- 인수 상담 4: 전환 (계약 체결)
(
  gen_random_uuid(),
  (SELECT id FROM listings WHERE slug = 'sinchon-startup-office'),
  '박계약',
  '010-4567-8901',
  'park@example.com',
  'investment',
  '신촌 매물 계약 진행하고 싶습니다.',
  'converted',
  NULL,
  '계약 체결 완료. 2025-11-15 인수 예정.',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '2 days'
),

-- 인수 상담 5: 대기
(
  gen_random_uuid(),
  (SELECT id FROM listings WHERE slug = 'yeouido-finance-office'),
  '최관심',
  '010-5678-9012',
  'choi@example.com',
  'exploration',
  '여의도 매물에 대해 더 알아보고 싶습니다. 수익 구조를 자세히 설명해주세요.',
  'pending',
  NULL,
  NULL,
  NOW() - INTERVAL '5 hours',
  NOW() - INTERVAL '5 hours'
);

-- ============================================
-- 5. 매각 상담 데이터 (Register Inquiries)
-- ============================================

INSERT INTO register_inquiries (
  id,
  name,
  phone,
  email,
  location,
  area_range,
  price_range,
  message,
  status,
  assigned_to,
  admin_notes,
  linked_listing_id,
  created_at,
  updated_at
) VALUES
-- 매각 상담 1: 대기
(
  gen_random_uuid(),
  '장사장',
  '010-1111-2222',
  'jang@example.com',
  '서울 송파구',
  '40-50평',
  '3-4억',
  '송파구에서 공유오피스 운영 중입니다. 매각하고 싶은데 가능한가요?',
  'pending',
  NULL,
  NULL,
  NULL,
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '3 hours'
),

-- 매각 상담 2: 연락완료
(
  gen_random_uuid(),
  '윤대표',
  '010-2222-3333',
  'yoon@example.com',
  '서울 서초구',
  '60-70평',
  '5-6억',
  '서초구 공유오피스 매각 상담 신청합니다. 현재 가동률 85%입니다.',
  'contacted',
  NULL,
  '전화 상담 완료. 2025-11-09 현장 실사 예정.',
  NULL,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '8 hours'
),

-- 매각 상담 3: 검증완료
(
  gen_random_uuid(),
  '송운영',
  '010-3333-4444',
  'song@example.com',
  '경기 수원시',
  '50-60평',
  '4-5억',
  '수원역 인근 공유오피스입니다. 개인 사정으로 매각합니다.',
  'qualified',
  NULL,
  '현장 실사 완료. 재무 검증 완료. 매물 등록 준비 중.',
  NULL,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '1 day'
),

-- 매각 상담 4: 매물 등록 완료
(
  gen_random_uuid(),
  '정원장',
  '010-4444-5555',
  'jeong@example.com',
  '서울 강남구',
  '50평',
  '5억',
  '강남역 도보 5분 공유오피스입니다.',
  'converted',
  NULL,
  '매물 등록 완료. 홍보 진행 중.',
  (SELECT id FROM listings WHERE slug = 'gangnam-premium-office'),
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days'
);

-- ============================================
-- 6. 데이터 삽입 확인
-- ============================================

-- 각 테이블의 데이터 개수 확인
SELECT
  'listings' as table_name,
  COUNT(*) as count
FROM listings
UNION ALL
SELECT
  'listing_images' as table_name,
  COUNT(*) as count
FROM listing_images
UNION ALL
SELECT
  'articles' as table_name,
  COUNT(*) as count
FROM articles
UNION ALL
SELECT
  'purchase_inquiries' as table_name,
  COUNT(*) as count
FROM purchase_inquiries
UNION ALL
SELECT
  'register_inquiries' as table_name,
  COUNT(*) as count
FROM register_inquiries;

-- 예상 결과:
-- listings: 5개
-- listing_images: 25개 (5개 매물 × 5개 이미지)
-- articles: 6개
-- purchase_inquiries: 5개
-- register_inquiries: 4개
