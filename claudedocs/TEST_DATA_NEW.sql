-- ============================================================================
-- SHAREZONE 테스트 데이터
-- ============================================================================
-- 실행 순서: reset_schema.sql 실행 후 이 파일을 실행하세요
-- ============================================================================

-- ============================================================================
-- 1. 매물 데이터 (5개)
-- ============================================================================

INSERT INTO public.listings (
  listing_number,
  title,
  slug,
  province,
  total_rooms,
  area_square_meter,
  area_pyeong,
  price_amount,
  monthly_revenue_amount,
  rental_deposit,
  monthly_rent,
  lease_period_years,
  description,
  highlights,
  status
) VALUES
(
  'SZ-2024-001',
  '강남역 도보 5분 프리미엄 공유오피스',
  'gangnam-premium-office',
  '서울',
  25,
  165.29,
  50.0,
  500000000,
  12000000,
  100000000,
  5000000,
  5,
  '강남역 인근 최고급 공유오피스입니다. 만실 운영 중이며 안정적인 수익을 보장합니다.',
  ARRAY['강남역 도보 5분', '만실 운영 중', '프리미엄 인테리어', '24시간 출입 가능'],
  'active'
),
(
  'SZ-2024-002',
  '판교 테크노밸리 공유오피스',
  'pangyo-techno-valley',
  '경기',
  30,
  198.35,
  60.0,
  600000000,
  15000000,
  150000000,
  7000000,
  5,
  'IT 기업들이 선호하는 판교 테크노밸리 핵심 위치입니다.',
  ARRAY['판교역 5분', 'IT 기업 밀집지', '고급 회의실 3개', '무료 주차 15대'],
  'active'
),
(
  'SZ-2024-003',
  '홍대입구 크리에이티브 오피스',
  'hongdae-creative-office',
  '서울',
  20,
  132.23,
  40.0,
  350000000,
  9000000,
  80000000,
  4000000,
  3,
  '크리에이터, 스타트업을 위한 감성 공유오피스입니다.',
  ARRAY['홍대입구역 도보 3분', '루프탑 라운지', '촬영 스튜디오', '카페 분위기'],
  'active'
),
(
  'SZ-2024-004',
  '여의도 금융가 비즈니스 센터',
  'yeouido-business-center',
  '서울',
  40,
  264.46,
  80.0,
  800000000,
  20000000,
  200000000,
  10000000,
  7,
  '여의도 금융가 핵심 상권의 프리미엄 비즈니스 센터입니다.',
  ARRAY['여의도역 직결', '한강뷰', '대기업 임차인', 'VIP 라운지'],
  'active'
),
(
  'SZ-2024-005',
  '부산 서면 공유오피스',
  'busan-seomyeon-office',
  '부산',
  18,
  119.01,
  36.0,
  280000000,
  7000000,
  60000000,
  3000000,
  3,
  '부산 최대 상권 서면의 합리적인 가격의 공유오피스입니다.',
  ARRAY['서면역 2분', '부산 최대 상권', '리모델링 완료', '저렴한 임대료'],
  'active'
);

-- ============================================================================
-- 2. 매물 이미지 (각 매물당 5장)
-- ============================================================================

INSERT INTO public.listing_images (listing_id, image_url, display_order, alt_text)
SELECT
  l.id,
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  1,
  '외부 전경'
FROM public.listings l WHERE l.listing_number = 'SZ-2024-001'
UNION ALL
SELECT l.id, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', 2, '오픈 오피스 공간'
FROM public.listings l WHERE l.listing_number = 'SZ-2024-001'
UNION ALL
SELECT l.id, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 3, '회의실'
FROM public.listings l WHERE l.listing_number = 'SZ-2024-001'
UNION ALL
SELECT l.id, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', 4, '라운지'
FROM public.listings l WHERE l.listing_number = 'SZ-2024-001'
UNION ALL
SELECT l.id, 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800', 5, '개인 오피스'
FROM public.listings l WHERE l.listing_number = 'SZ-2024-001';

-- 나머지 매물도 같은 이미지 사용 (간단하게)
INSERT INTO public.listing_images (listing_id, image_url, display_order, alt_text)
SELECT
  l.id,
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  1,
  '오피스 공간'
FROM public.listings l WHERE l.listing_number IN ('SZ-2024-002', 'SZ-2024-003', 'SZ-2024-004', 'SZ-2024-005');

-- ============================================================================
-- 3. 아티클 데이터 (6개, featured)
-- ============================================================================

INSERT INTO public.articles (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  is_featured,
  published_at
) VALUES
(
  '공유오피스 창업 가이드: 성공을 위한 10가지 체크리스트',
  'coworking-startup-guide',
  '공유오피스 창업을 고려 중이신가요? 성공적인 공유오피스 운영을 위한 필수 체크리스트를 확인하세요.',
  '## 공유오피스 창업, 이것만은 꼭!

공유오피스는 단순히 공간을 임대하는 것을 넘어, 커뮤니티를 만들고 가치를 제공하는 비즈니스입니다.

### 1. 입지 선정
성공의 70%는 입지에서 결정됩니다.

### 2. 타겟 고객 정의
누구를 위한 공간인가?

### 3. 차별화 포인트
우리만의 특별함은 무엇인가?',
  'startup',
  ARRAY['창업', '가이드', '체크리스트'],
  true,
  NOW()
),
(
  '공유오피스 인수 시 반드시 확인해야 할 재무제표 항목',
  'financial-checklist',
  '공유오피스 인수를 고려 중이시라면, 재무제표를 통해 수익성과 안정성을 철저히 검증해야 합니다.',
  '## 숨겨진 리스크를 찾아내는 법

매물을 볼 때 가장 중요한 것은 실제 수익성입니다.

### 매출 확인
- 월별 매출 추이
- 계절성 분석
- 고객 이탈률

### 비용 구조
- 고정비와 변동비
- 숨겨진 비용 찾기',
  'acquisition',
  ARRAY['인수', '재무', 'M&A'],
  true,
  NOW()
),
(
  '2024년 공유오피스 트렌드: 하이브리드 워크의 확산',
  'coworking-trends-2024',
  '팬데믹 이후 하이브리드 워크가 일상화되면서 공유오피스 시장이 급성장하고 있습니다.',
  '## 변화하는 업무 환경

코로나19 이후 재택근무와 사무실 근무를 병행하는 하이브리드 워크가 확산되고 있습니다.

### 주요 트렌드
1. 유연한 멤버십 옵션
2. 프라이빗 오피스 수요 증가
3. 웰니스 공간 확대',
  'operation',
  ARRAY['트렌드', '하이브리드', '시장분석'],
  true,
  NOW()
),
(
  '공유오피스 매각 타이밍: 언제 팔아야 최고가를 받을까?',
  'best-time-to-sell',
  '공유오피스 매각을 고려 중이시라면, 최적의 타이밍을 선택하는 것이 중요합니다.',
  '## 매각 타이밍의 중요성

공유오피스 매각은 타이밍이 전부입니다.

### 최적의 매각 시기
- 만실 달성 후 6개월
- 리뉴얼 완료 직후
- 장기 계약 체결 시점

### 피해야 할 시기
- 공실률 상승기
- 대규모 퇴실 예정 시',
  'exit',
  ARRAY['매각', '타이밍', '전략'],
  true,
  NOW()
),
(
  '공유오피스 운영 노하우: 고객 만족도를 높이는 5가지 방법',
  'customer-satisfaction-tips',
  '성공적인 공유오피스 운영의 핵심은 고객 만족도입니다. 실전 노하우를 공개합니다.',
  '## 고객이 떠나지 않는 비결

재계약률 90% 이상을 유지하는 운영 노하우

### 1. 커뮤니티 이벤트
월 2회 이상 네트워킹 행사

### 2. 즉각적인 응대
불편사항 24시간 내 해결

### 3. 개인화 서비스
멤버별 맞춤 케어',
  'operation',
  ARRAY['운영', '고객만족', '재계약'],
  true,
  NOW()
),
(
  '공유오피스 투자 ROI 분석: 실제 수익률은 얼마나 될까?',
  'roi-analysis',
  '공유오피스 투자의 실제 수익률을 사례를 통해 분석해드립니다.',
  '## 리얼 ROI 공개

강남 A 공유오피스 실제 투자 수익률

### 투자 금액
- 매입가: 5억
- 리모델링: 1억
- 총 투자: 6억

### 연간 수익
- 월 매출: 1,200만원
- 월 순이익: 800만원
- 연 수익률: 16%

### 회수 기간
약 6.25년',
  'investment',
  ARRAY['투자', 'ROI', '수익률'],
  true,
  NOW()
);

-- ============================================================================
-- 4. 인수 상담 데이터 (5개)
-- ============================================================================

INSERT INTO public.purchase_inquiries (
  name,
  phone,
  email,
  purpose,
  message,
  status
) VALUES
(
  '김투자',
  '010-1234-5678',
  'investor1@example.com',
  'investment',
  '강남 지역 공유오피스 투자에 관심이 있습니다. SZ-2024-001 매물에 대해 자세한 상담 원합니다.',
  'pending'
),
(
  '이창업',
  '010-2345-6789',
  'startup@example.com',
  'startup',
  '공유오피스 창업을 준비 중입니다. 판교 지역 매물 정보 부탁드립니다.',
  'contacted'
),
(
  '박확장',
  '010-3456-7890',
  'expand@example.com',
  'expansion',
  '기존 공유오피스를 운영 중인데, 2호점 오픈을 고려하고 있습니다.',
  'qualified'
),
(
  '최수익',
  '010-4567-8901',
  'profit@example.com',
  'investment',
  '안정적인 수익 창출이 가능한 매물을 찾고 있습니다.',
  'pending'
),
(
  '정프랜차이즈',
  '010-5678-9012',
  'franchise@example.com',
  'expansion',
  '프랜차이즈 확장을 위한 매물을 알아보고 있습니다.',
  'contacted'
);

-- ============================================================================
-- 5. 매각 상담 데이터 (4개)
-- ============================================================================

INSERT INTO public.register_inquiries (
  name,
  phone,
  email,
  location,
  area_range,
  price_range,
  message,
  status
) VALUES
(
  '강매각',
  '010-1111-2222',
  'sell1@example.com',
  '서울 마포구',
  '30-40평',
  '3-4억',
  '홍대 인근 공유오피스 매각을 희망합니다. 현재 만실 운영 중입니다.',
  'pending'
),
(
  '윤오너',
  '010-2222-3333',
  'owner@example.com',
  '경기 성남시',
  '50-60평',
  '5-6억',
  '판교 테크노밸리 공유오피스 매각 상담 요청드립니다.',
  'contacted'
),
(
  '한사장',
  '010-3333-4444',
  'boss@example.com',
  '서울 영등포구',
  '70-80평',
  '7-8억',
  '여의도 오피스 빌딩 내 공유오피스 매각 희망합니다.',
  'qualified'
),
(
  '송대표',
  '010-4444-5555',
  'ceo@example.com',
  '부산 부산진구',
  '40-50평',
  '3억대',
  '서면 공유오피스 매각 문의드립니다.',
  'pending'
);

-- ============================================================================
-- 완료 메시지
-- ============================================================================
SELECT 'Test data inserted successfully!' as message,
       (SELECT COUNT(*) FROM public.listings) as listings_count,
       (SELECT COUNT(*) FROM public.listing_images) as images_count,
       (SELECT COUNT(*) FROM public.articles) as articles_count,
       (SELECT COUNT(*) FROM public.purchase_inquiries) as purchase_inquiries_count,
       (SELECT COUNT(*) FROM public.register_inquiries) as register_inquiries_count;
