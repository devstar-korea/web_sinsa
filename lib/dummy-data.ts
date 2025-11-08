import { Listing, Article } from './types'

// ============================================
// 매물 더미 데이터 (20개)
// ============================================

export const dummyListings: Listing[] = [
  {
    id: 'listing-001',
    listingNumber: 'sz-2847',
    title: '강남역 도보 3분, 리모델링 완료 프리미엄 공유오피스',
    slug: 'gangnam-premium-office-001',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 280000000,
      displayText: '2억 8천만원',
      isNegotiable: true,
    },
    premiumAmount: 70000000,  // 권리금 7천만원
    totalInvestment: 280000000,  // 총 투자비용 2억 8천만원
    monthlyProfit: 5600000,  // 월수익 560만원
    area: {
      squareMeter: 165,
      pyeong: 50,
    },
    totalRooms: 45,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      alt: '강남 프리미엄 공유오피스 외관',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
        alt: '공유오피스 외관',
        order: 1,
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop',
        alt: '오픈 워크스페이스',
        order: 2,
        isPrimary: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=800&fit=crop',
        alt: '회의실',
        order: 3,
        isPrimary: false,
      },
    ],
    shortDescription: '강남역 3분 거리, 최근 리모델링 완료. 안정적 회원 45명 확보, 월 매출 1,200만원 이상',
    description: '# 매물 상세 정보\n\n## 위치\n- 강남역 3번 출구 도보 3분\n- 대로변 위치로 접근성 우수\n\n## 시설 현황\n- 전용면적: 50평 (165㎡)\n- 좌석 수: 45석 (고정석 30, 자유석 15)\n- 회의실: 4개 (4인실 2개, 8인실 2개)\n- 최근 리모델링 완료 (2024년 10월)\n\n## 운영 현황\n- 월 평균 매출: 1,200만원\n- 현재 회원: 45명 (가동률 100%)\n- 안정적 수익 구조\n\n## 양도 사유\n- 사업 확장으로 인한 이전',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2022-03-15',
    viewCount: 342,
    isPremium: true,
    createdAt: '2025-11-01T09:00:00Z',
    updatedAt: '2025-11-06T10:30:00Z',
  },
  {
    id: 'listing-002',
    listingNumber: 'sz-5139',
    title: '서초역 초역세권, 안정적 수익형 공유오피스',
    slug: 'seocho-stable-office-002',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 350000000,
      displayText: '3억 5천만원',
      isNegotiable: true,
    },
    premiumAmount: 85000000,  // 권리금 8천 5백만원
    totalInvestment: 350000000,  // 총 투자비용 3억 5천만원
    monthlyProfit: 7000000,  // 월수익 700만원
    area: {
      squareMeter: 198,
      pyeong: 60,
    },
    totalRooms: 60,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
      alt: '서초역 공유오피스',
    },
    shortDescription: '서초역 1분 거리, 60석 규모. 3년간 안정적 운영, 월 매출 1,500만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2021-06-01',
    viewCount: 289,
    isPremium: true,
    createdAt: '2025-10-28T14:20:00Z',
    updatedAt: '2025-11-05T16:45:00Z',
  },
  {
    id: 'listing-003',
    listingNumber: 'sz-7264',
    title: '여의도 IFC몰 인근, 프리미엄 비즈니스 센터',
    slug: 'yeouido-business-center-003',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 520000000,
      displayText: '5억 2천만원',
      isNegotiable: false,
    },
    premiumAmount: 150000000,  // 권리금 1억 5천만원
    totalInvestment: 520000000,  // 총 투자비용 5억 2천만원
    monthlyProfit: 10400000,  // 월수익 1,040만원
    area: {
      squareMeter: 264,
      pyeong: 80,
    },
    totalRooms: 80,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      alt: '여의도 비즈니스 센터',
    },
    shortDescription: '여의도 핵심 상권, 80석 대형 센터. 금융/법무 전문직 고객층, 월 매출 2,200만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2020-09-10',
    viewCount: 456,
    isPremium: true,
    createdAt: '2025-10-25T11:10:00Z',
    updatedAt: '2025-11-04T09:20:00Z',
  },
  {
    id: 'listing-004',
    title: '성수동 핫플레이스, 감성 공유오피스',
    slug: 'seongsu-hipster-office-004',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 180000000,
      displayText: '1억 8천만원',
      isNegotiable: true,
    },
    premiumAmount: 45000000,  // 권리금 4천 5백만원
    totalInvestment: 180000000,  // 총 투자비용 1억 8천만원
    monthlyProfit: 3600000,  // 월수익 360만원
    area: {
      squareMeter: 132,
      pyeong: 40,
    },
    totalRooms: 35,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop',
      alt: '성수동 감성 오피스',
    },
    shortDescription: '성수동 카페거리, 인테리어 감성 우수. 스타트업/1인 기업 선호, 월 매출 850만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2023-02-20',
    viewCount: 523,
    isPremium: false,
    createdAt: '2025-10-20T08:30:00Z',
    updatedAt: '2025-11-03T14:15:00Z',
  },
  {
    id: 'listing-005',
    title: '홍대입구역 메인상권, 크리에이터 특화 공간',
    slug: 'hongdae-creator-space-005',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 220000000,
      displayText: '2억 2천만원',
      isNegotiable: true,
    },
    premiumAmount: 55000000,  // 권리금 5천 5백만원
    totalInvestment: 220000000,  // 총 투자비용 2억 2천만원
    monthlyProfit: 4400000,  // 월수익 440만원
    area: {
      squareMeter: 149,
      pyeong: 45,
    },
    totalRooms: 40,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&h=600&fit=crop',
      alt: '홍대 크리에이터 공간',
    },
    shortDescription: '홍대 핵심상권, 촬영/녹음 부스 완비. 유튜버/디자이너 특화, 월 매출 980만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2022-11-05',
    viewCount: 412,
    isPremium: false,
    createdAt: '2025-10-18T15:40:00Z',
    updatedAt: '2025-11-02T11:25:00Z',
  },
  {
    id: 'listing-006',
    title: '판교테크노밸리, IT 스타트업 허브',
    slug: 'pangyo-it-hub-006',
    location: {
      province: '경기',
      locationKey: '경기-성남',
    },
    price: {
      amount: 420000000,
      displayText: '4억 2천만원',
      isNegotiable: false,
    },
    premiumAmount: 120000000,  // 권리금 1억 2천만원
    totalInvestment: 420000000,  // 총 투자비용 4억 2천만원
    monthlyProfit: 8400000,  // 월수익 840만원
    area: {
      squareMeter: 231,
      pyeong: 70,
    },
    totalRooms: 70,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
      alt: '판교 IT 허브',
    },
    shortDescription: '판교 테크노밸리 중심, IT 스타트업 70개사 입주. 월 매출 2,000만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2021-04-01',
    viewCount: 367,
    isPremium: true,
    createdAt: '2025-10-15T10:20:00Z',
    updatedAt: '2025-11-01T16:30:00Z',
  },
  {
    id: 'listing-007',
    title: '선릉역 테헤란로, 대기업 밀집지역 비즈니스 센터',
    slug: 'seolleung-teheran-007',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 380000000,
      displayText: '3억 8천만원',
      isNegotiable: true,
    },
    premiumAmount: 100000000,  // 권리금 1억원
    totalInvestment: 380000000,  // 총 투자비용 3억 8천만원
    monthlyProfit: 7600000,  // 월수익 760만원
    area: {
      squareMeter: 198,
      pyeong: 60,
    },
    totalRooms: 55,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop',
      alt: '선릉역 비즈니스 센터',
    },
    shortDescription: '테헤란로 중심, 대기업 협력사 다수 입주. 안정적 운영 4년차, 월 매출 1,650만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2020-08-15',
    viewCount: 298,
    isPremium: true,
    createdAt: '2025-10-12T09:15:00Z',
    updatedAt: '2025-10-31T13:50:00Z',
  },
  {
    id: 'listing-008',
    title: '신논현역 강남대로변, 고급 오피스',
    slug: 'sinnonhyeon-luxury-008',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 320000000,
      displayText: '3억 2천만원',
      isNegotiable: true,
    },
    premiumAmount: 85000000,  // 권리금 8천 5백만원
    totalInvestment: 320000000,  // 총 투자비용 3억 2천만원
    monthlyProfit: 6400000,  // 월수익 640만원
    area: {
      squareMeter: 165,
      pyeong: 50,
    },
    totalRooms: 48,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      alt: '신논현 고급 오피스',
    },
    shortDescription: '강남대로변 1층, 시야 확보 우수. 법무/회계 전문직 다수, 월 매출 1,400만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2021-12-10',
    viewCount: 334,
    isPremium: false,
    createdAt: '2025-10-10T14:25:00Z',
    updatedAt: '2025-10-30T10:40:00Z',
  },
  {
    id: 'listing-009',
    title: '역삼역 스타트업 밸리, 젊은층 선호 공간',
    slug: 'yeoksam-startup-valley-009',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 240000000,
      displayText: '2억 4천만원',
      isNegotiable: true,
    },
    premiumAmount: 60000000,  // 권리금 6천만원
    totalInvestment: 240000000,  // 총 투자비용 2억 4천만원
    monthlyProfit: 4800000,  // 월수익 480만원
    area: {
      squareMeter: 149,
      pyeong: 45,
    },
    totalRooms: 42,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
      alt: '역삼 스타트업 밸리',
    },
    shortDescription: '역삼역 인근, 스타트업 30개사 입주. 네트워킹 활발, 월 매출 1,100만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2022-07-20',
    viewCount: 401,
    isPremium: false,
    createdAt: '2025-10-08T11:50:00Z',
    updatedAt: '2025-10-29T15:20:00Z',
  },
  {
    id: 'listing-010',
    title: '인천 송도 국제도시, 첨단 비즈니스 센터',
    slug: 'songdo-business-center-010',
    location: {
      province: '인천',
      locationKey: '인천',
    },
    price: {
      amount: 120000000,
      displayText: '1억 2천만원',
      isNegotiable: true,
    },
    premiumAmount: 30000000,  // 권리금 3천만원
    totalInvestment: 120000000,  // 총 투자비용 1억 2천만원
    monthlyProfit: 2400000,  // 월수익 240만원
    area: {
      squareMeter: 99,
      pyeong: 30,
    },
    totalRooms: 30,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      alt: '건대 스터디 카페형 오피스',
    },
    shortDescription: '건대 대학가, 1인 창업자/대학생 선호. 회전율 높음, 월 매출 650만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2023-05-01',
    viewCount: 267,
    isPremium: false,
    createdAt: '2025-10-05T16:35:00Z',
    updatedAt: '2025-10-28T09:15:00Z',
  },
  {
    id: 'listing-011',
    title: '부산 서면 중심가, 프리미엄 공유오피스',
    slug: 'seomyeon-premium-office-011',
    location: {
      province: '부산',
      locationKey: '부산',
    },
    price: {
      amount: 480000000,
      displayText: '4억 8천만원',
      isNegotiable: false,
    },
    premiumAmount: 140000000,  // 권리금 1억 4천만원
    totalInvestment: 480000000,  // 총 투자비용 4억 8천만원
    monthlyProfit: 9600000,  // 월수익 960만원
    area: {
      squareMeter: 231,
      pyeong: 70,
    },
    totalRooms: 65,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?w=800&h=600&fit=crop',
      alt: '삼성역 글로벌 센터',
    },
    shortDescription: '코엑스 도보 5분, 외국계 기업 다수. 통역 서비스 제공, 월 매출 2,100만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2020-11-20',
    viewCount: 389,
    isPremium: true,
    createdAt: '2025-10-03T13:20:00Z',
    updatedAt: '2025-10-27T11:45:00Z',
  },
  {
    id: 'listing-012',
    title: '대전 둔산동 정부청사 인근 비즈니스 센터',
    slug: 'dunsan-business-center-012',
    location: {
      province: '대전',
      locationKey: '대전',
    },
    price: {
      amount: 150000000,
      displayText: '1억 5천만원',
      isNegotiable: true,
    },
    premiumAmount: 37500000,  // 권리금 3천 7백 5십만원
    totalInvestment: 150000000,  // 총 투자비용 1억 5천만원
    monthlyProfit: 3000000,  // 월수익 300만원
    area: {
      squareMeter: 115,
      pyeong: 35,
    },
    totalRooms: 28,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
      alt: '을지로 레트로 작업실',
    },
    shortDescription: '을지로 인쇄골목, 높은 층고와 레트로 감성. 디자이너/사진가 선호, 월 매출 720만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2022-09-15',
    viewCount: 445,
    isPremium: false,
    createdAt: '2025-10-01T10:40:00Z',
    updatedAt: '2025-10-26T14:30:00Z',
  },
  {
    id: 'listing-013',
    title: '신촌 대학가, 프리랜서 커뮤니티 공간',
    slug: 'sinchon-freelancer-013',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 140000000,
      displayText: '1억 4천만원',
      isNegotiable: true,
    },
    premiumAmount: 35000000,  // 권리금 3천 5백만원
    totalInvestment: 140000000,  // 총 투자비용 1억 4천만원
    monthlyProfit: 2800000,  // 월수익 280만원
    area: {
      squareMeter: 99,
      pyeong: 30,
    },
    totalRooms: 32,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
      alt: '신촌 프리랜서 공간',
    },
    shortDescription: '신촌 대학가, 젊은 프리랜서 커뮤니티. 이벤트 공간 활용, 월 매출 680만원',
    status: 'pending',
    operatingStatus: 'operating',
    openedAt: '2023-03-10',
    viewCount: 198,
    isPremium: false,
    createdAt: '2025-09-28T15:55:00Z',
    updatedAt: '2025-10-25T16:20:00Z',
  },
  {
    id: 'listing-014',
    title: '광화문 정부청사 인근, 공공기관 협력 비즈니스 센터',
    slug: 'gwanghwamun-government-014',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 390000000,
      displayText: '3억 9천만원',
      isNegotiable: false,
    },
    premiumAmount: 105000000,  // 권리금 1억 5백만원
    totalInvestment: 390000000,  // 총 투자비용 3억 9천만원
    monthlyProfit: 7800000,  // 월수익 780만원
    area: {
      squareMeter: 198,
      pyeong: 60,
    },
    totalRooms: 58,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=800&h=600&fit=crop',
      alt: '광화문 비즈니스 센터',
    },
    shortDescription: '광화문 중심, 공공기관 협력 업체 다수. 안정적 고객층, 월 매출 1,700만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2021-02-01',
    viewCount: 276,
    isPremium: true,
    createdAt: '2025-09-25T09:30:00Z',
    updatedAt: '2025-10-24T12:10:00Z',
  },
  {
    id: 'listing-015',
    title: '구로디지털단지, IT 개발자 집중 공간',
    slug: 'guro-digital-dev-015',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 260000000,
      displayText: '2억 6천만원',
      isNegotiable: true,
    },
    premiumAmount: 65000000,  // 권리금 6천 5백만원
    totalInvestment: 260000000,  // 총 투자비용 2억 6천만원
    monthlyProfit: 5200000,  // 월수익 520만원
    area: {
      squareMeter: 165,
      pyeong: 50,
    },
    totalRooms: 50,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1558403194-611308249627?w=800&h=600&fit=crop',
      alt: '구로 개발자 공간',
    },
    shortDescription: 'IT 밸리 중심, 개발자 50명 입주. 24시간 운영, 월 매출 1,300만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2022-04-25',
    viewCount: 312,
    isPremium: false,
    createdAt: '2025-09-22T11:15:00Z',
    updatedAt: '2025-10-23T10:05:00Z',
  },
  {
    id: 'listing-016',
    title: '서울대입구 연구소 특화 오피스',
    slug: 'snu-research-016',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 170000000,
      displayText: '1억 7천만원',
      isNegotiable: true,
    },
    premiumAmount: 42500000,  // 권리금 4천 2백 5십만원
    totalInvestment: 170000000,  // 총 투자비용 1억 7천만원
    monthlyProfit: 3400000,  // 월수익 340만원
    area: {
      squareMeter: 132,
      pyeong: 40,
    },
    totalRooms: 35,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
      alt: '서울대입구 연구소',
    },
    shortDescription: '서울대 인근, 연구소/교육 스타트업 특화. 조용한 분위기, 월 매출 780만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2023-01-15',
    viewCount: 234,
    isPremium: false,
    createdAt: '2025-09-20T14:45:00Z',
    updatedAt: '2025-10-22T15:35:00Z',
  },
  {
    id: 'listing-017',
    title: '잠실 롯데월드타워 인근, 프리미엄 뷰 오피스',
    slug: 'jamsil-lotte-tower-017',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 410000000,
      displayText: '4억 1천만원',
      isNegotiable: false,
    },
    premiumAmount: 120000000,  // 권리금 1억 2천만원
    totalInvestment: 410000000,  // 총 투자비용 4억 1천만원
    monthlyProfit: 8200000,  // 월수익 820만원
    area: {
      squareMeter: 198,
      pyeong: 60,
    },
    totalRooms: 56,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?w=800&h=600&fit=crop',
      alt: '잠실 프리미엄 뷰',
    },
    shortDescription: '롯데타워 뷰 확보, 고급 인테리어. 금융/부동산 업종 다수, 월 매출 1,850만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2021-08-01',
    viewCount: 367,
    isPremium: true,
    createdAt: '2025-09-18T16:20:00Z',
    updatedAt: '2025-10-21T13:25:00Z',
  },
  {
    id: 'listing-018',
    title: '합정역 카페거리, 소규모 감성 오피스',
    slug: 'hapjeong-cafe-small-018',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 130000000,
      displayText: '1억 3천만원',
      isNegotiable: true,
    },
    premiumAmount: 32500000,  // 권리금 3천 2백 5십만원
    totalInvestment: 130000000,  // 총 투자비용 1억 3천만원
    monthlyProfit: 2600000,  // 월수익 260만원
    area: {
      squareMeter: 82,
      pyeong: 25,
    },
    totalRooms: 22,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=800&h=600&fit=crop',
      alt: '합정 소규모 오피스',
    },
    shortDescription: '합정 카페거리, 아늑한 소규모 공간. 1인 기업/작가 선호, 월 매출 580만원',
    status: 'sold',
    operatingStatus: 'operating',
    openedAt: '2023-06-10',
    viewCount: 521,
    isPremium: false,
    createdAt: '2025-09-15T10:10:00Z',
    updatedAt: '2025-10-20T09:40:00Z',
  },
  {
    id: 'listing-019',
    title: '강남대로 사거리, 대형 비즈니스 허브',
    slug: 'gangnam-daero-hub-019',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 580000000,
      displayText: '5억 8천만원',
      isNegotiable: false,
    },
    premiumAmount: 170000000,  // 권리금 1억 7천만원
    totalInvestment: 580000000,  // 총 투자비용 5억 8천만원
    monthlyProfit: 11600000,  // 월수익 1,160만원
    area: {
      squareMeter: 330,
      pyeong: 100,
    },
    totalRooms: 95,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop',
      alt: '강남대로 비즈니스 허브',
    },
    shortDescription: '강남 최대 규모 100평, 회원 95명. 각종 편의시설 완비, 월 매출 2,800만원',
    status: 'active',
    operatingStatus: 'operating',
    openedAt: '2019-12-01',
    viewCount: 612,
    isPremium: true,
    createdAt: '2025-09-12T13:35:00Z',
    updatedAt: '2025-10-19T14:55:00Z',
  },
  {
    id: 'listing-020',
    title: '용산 아이파크몰 인근, 패밀리 친화 오피스',
    slug: 'yongsan-ipark-family-020',
    location: {
      province: '서울',
      locationKey: '서울',
    },
    price: {
      amount: 190000000,
      displayText: '1억 9천만원',
      isNegotiable: true,
    },
    premiumAmount: 47500000,  // 권리금 4천 7백 5십만원
    totalInvestment: 190000000,  // 총 투자비용 1억 9천만원
    monthlyProfit: 3800000,  // 월수익 380만원
    area: {
      squareMeter: 132,
      pyeong: 40,
    },
    totalRooms: 38,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&h=600&fit=crop',
      alt: '용산 패밀리 오피스',
    },
    shortDescription: '아이파크몰 인근, 육아맘/파파 프리랜서 다수. 키즈 공간 별도, 월 매출 920만원',
    status: 'hidden',
    operatingStatus: 'operating',  // 운영중인 매장만 등록 가능
    openedAt: '2022-10-05',
    viewCount: 145,
    isPremium: false,
    createdAt: '2025-09-10T15:25:00Z',
    updatedAt: '2025-10-18T11:30:00Z',
  },
]

// ============================================
// 아티클 더미 데이터 (10개)
// ============================================

export const dummyArticles: Article[] = [
  {
    id: 'article-001',
    title: '2025년 공유오피스 창업 완벽 가이드',
    slug: 'coworking-startup-guide-2025',
    category: 'guide',
    excerpt: '공유오피스 창업을 고려 중이신가요? 입지 선정부터 인테리어, 운영 노하우까지 실전 경험을 바탕으로 정리했습니다.',
    content: '# 공유오피스 창업 가이드\n\n## 1. 입지 선정...',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      alt: '공유오피스 인테리어',
    },
    author: {
      name: '김창업',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    viewCount: 1245,
    isFeatured: true,
    isImported: false,
    tags: ['창업', '가이드', '입지선정'],
    publishedAt: '2025-11-01T09:00:00Z',
    createdAt: '2025-10-28T14:20:00Z',
    updatedAt: '2025-11-01T09:00:00Z',
  },
  {
    id: 'article-002',
    title: '공유오피스 매각 시 체크리스트 10가지',
    slug: 'office-sale-checklist',
    category: 'tips',
    excerpt: '공유오피스를 매각할 때 반드시 확인해야 할 10가지 핵심 사항. 계약서, 회원 관리, 임대차 계약 이전 등을 상세히 안내합니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
      alt: '체크리스트',
    },
    author: {
      name: '이전문',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    viewCount: 892,
    isFeatured: true,
    isImported: false,
    tags: ['매각', '체크리스트', '계약'],
    publishedAt: '2025-10-28T10:00:00Z',
    createdAt: '2025-10-25T11:30:00Z',
    updatedAt: '2025-10-28T10:00:00Z',
  },
  {
    id: 'article-003',
    title: '강남 vs 판교, 공유오피스 입지 비교 분석',
    slug: 'gangnam-vs-pangyo-analysis',
    category: 'market',
    excerpt: '강남과 판교, 두 지역의 공유오피스 시장을 심층 비교합니다. 임대료, 고객층, 수익성을 데이터로 분석했습니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      alt: '강남 오피스 빌딩',
    },
    author: {
      name: '박시장',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    viewCount: 1567,
    isFeatured: true,
    isImported: false,
    tags: ['시장분석', '강남', '판교'],
    publishedAt: '2025-10-25T14:00:00Z',
    createdAt: '2025-10-22T09:15:00Z',
    updatedAt: '2025-10-25T14:00:00Z',
  },
  {
    id: 'article-004',
    title: '공유오피스 회원 유지율 높이는 5가지 전략',
    slug: 'member-retention-strategies',
    category: 'tips',
    excerpt: '회원 이탈을 막고 장기 고객을 확보하는 실전 노하우. 커뮤니티 운영부터 혜택 설계까지 상세 가이드.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      alt: '커뮤니티 미팅',
    },
    author: {
      name: '최운영',
      avatar: 'https://i.pravatar.cc/150?img=22',
    },
    viewCount: 723,
    isFeatured: false,
    isImported: false,
    tags: ['회원관리', '운영전략', '커뮤니티'],
    publishedAt: '2025-10-22T11:00:00Z',
    createdAt: '2025-10-19T15:40:00Z',
    updatedAt: '2025-10-22T11:00:00Z',
  },
  {
    id: 'article-005',
    title: '2025년 1분기 공유오피스 시장 동향 리포트',
    slug: 'market-report-2025-q1',
    category: 'market',
    excerpt: '2025년 1분기 서울/경기 지역 공유오피스 시장 분석. 평균 가격, 공실률, 거래량 등 핵심 지표를 정리했습니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      alt: '시장 리포트',
    },
    author: {
      name: '정데이터',
      avatar: 'https://i.pravatar.cc/150?img=58',
    },
    viewCount: 2103,
    isFeatured: true,
    isImported: false,
    tags: ['시장동향', '리포트', '통계'],
    publishedAt: '2025-10-20T09:00:00Z',
    createdAt: '2025-10-17T13:25:00Z',
    updatedAt: '2025-10-20T09:00:00Z',
  },
  {
    id: 'article-006',
    title: '공유오피스 인테리어, 얼마나 투자해야 할까?',
    slug: 'interior-budget-guide',
    category: 'guide',
    excerpt: '평수별, 컨셉별 인테리어 비용 가이드. 실제 사례를 통해 적정 예산과 투자 우선순위를 알려드립니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
      alt: '인테리어 공사',
    },
    author: {
      name: '인테리',
      avatar: 'https://i.pravatar.cc/150?img=67',
    },
    viewCount: 1834,
    isFeatured: false,
    isImported: false,
    tags: ['인테리어', '예산', '투자'],
    publishedAt: '2025-10-18T10:30:00Z',
    createdAt: '2025-10-15T11:50:00Z',
    updatedAt: '2025-10-18T10:30:00Z',
  },
  {
    id: 'article-007',
    title: '성수동 공유오피스가 뜨는 이유',
    slug: 'seongsu-office-trend',
    category: 'market',
    excerpt: '힙한 동네 성수동에 공유오피스가 급증하는 배경을 분석합니다. 입주자 특성과 수익성은 어떨까요?',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop',
      alt: '성수동 거리',
    },
    author: {
      name: '박시장',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    viewCount: 1456,
    isFeatured: false,
    isImported: false,
    tags: ['성수동', '트렌드', '입지분석'],
    publishedAt: '2025-10-15T15:00:00Z',
    createdAt: '2025-10-12T09:20:00Z',
    updatedAt: '2025-10-15T15:00:00Z',
  },
  {
    id: 'article-008',
    title: '공유오피스 운영 자동화 툴 BEST 7',
    slug: 'automation-tools-best-7',
    category: 'tips',
    excerpt: '예약 관리, 결제, 출입 통제까지. 공유오피스 운영을 효율화하는 필수 자동화 툴을 소개합니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      alt: '자동화 시스템',
    },
    author: {
      name: '테크니',
      avatar: 'https://i.pravatar.cc/150?img=15',
    },
    viewCount: 967,
    isFeatured: false,
    isImported: false,
    tags: ['자동화', '운영툴', '효율화'],
    publishedAt: '2025-10-12T13:00:00Z',
    createdAt: '2025-10-09T16:35:00Z',
    updatedAt: '2025-10-12T13:00:00Z',
  },
  {
    id: 'article-009',
    title: '공유오피스 법인 전환 vs 개인사업자, 뭐가 유리할까?',
    slug: 'corporation-vs-sole-proprietor',
    category: 'guide',
    excerpt: '공유오피스 운영 시 사업자 유형 선택 가이드. 세금, 책임, 확장성을 비교 분석합니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      alt: '사업자 등록',
    },
    author: {
      name: '세무사',
      avatar: 'https://i.pravatar.cc/150?img=28',
    },
    viewCount: 1092,
    isFeatured: false,
    isImported: false,
    tags: ['법인', '세금', '사업자'],
    publishedAt: '2025-10-10T09:30:00Z',
    createdAt: '2025-10-07T14:15:00Z',
    updatedAt: '2025-10-10T09:30:00Z',
  },
  {
    id: 'article-010',
    title: '공유오피스 매각 후 세금 처리 완벽 가이드',
    slug: 'tax-guide-after-sale',
    category: 'guide',
    excerpt: '공유오피스를 매각한 후 발생하는 양도소득세, 부가가치세 등 세금 처리 방법을 상세히 안내합니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=600&fit=crop',
      alt: '세금 계산',
    },
    author: {
      name: '세무사',
      avatar: 'https://i.pravatar.cc/150?img=28',
    },
    viewCount: 1678,
    isFeatured: true,
    isImported: false,
    tags: ['세금', '양도소득세', '매각'],
    publishedAt: '2025-10-08T11:00:00Z',
    createdAt: '2025-10-05T10:25:00Z',
    updatedAt: '2025-10-08T11:00:00Z',
  },
]

// ============================================
// 헬퍼 함수들
// ============================================

// 활성화된 매물만 필터링
export function getActiveListings(): Listing[] {
  return dummyListings.filter((listing) => listing.status === 'active')
}

// 프리미엄 매물만 필터링
export function getPremiumListings(): Listing[] {
  return dummyListings.filter((listing) => listing.isPremium && listing.status === 'active')
}

// 최신 매물 N개 가져오기
export function getLatestListings(limit: number = 6): Listing[] {
  return [...dummyListings]
    .filter((listing) => listing.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// ID로 매물 찾기
export function getListingById(id: string): Listing | undefined {
  return dummyListings.find((listing) => listing.id === id)
}

// Slug로 매물 찾기
export function getListingBySlug(slug: string): Listing | undefined {
  return dummyListings.find((listing) => listing.slug === slug)
}

// 추천 매물 (조회수 기준 상위 N개)
export function getFeaturedListings(limit: number = 3): Listing[] {
  return [...dummyListings]
    .filter((listing) => listing.status === 'active')
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
}

// Featured 아티클만 필터링
export function getFeaturedArticles(): Article[] {
  return dummyArticles.filter((article) => article.isFeatured)
}

// 최신 아티클 N개 가져오기
export function getLatestArticles(limit: number = 3): Article[] {
  return [...dummyArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

// 카테고리별 아티클 필터링
export function getArticlesByCategory(category: 'guide' | 'tips' | 'market'): Article[] {
  return dummyArticles.filter((article) => article.category === category)
}

// ID로 아티클 찾기
export function getArticleById(id: string): Article | undefined {
  return dummyArticles.find((article) => article.id === id)
}

// Slug로 아티클 찾기
export function getArticleBySlug(slug: string): Article | undefined {
  return dummyArticles.find((article) => article.slug === slug)
}

// ============================================
// 블로그 연동 아티클 더미 데이터 (관리자 페이지 전용)
// ============================================

export const dummyBlogArticles: Article[] = [
  {
    id: 'blog-article-001',
    title: '공유오피스 최신 트렌드 분석',
    slug: 'latest-coworking-trends',
    category: 'market',
    excerpt: '2025년 공유오피스 시장의 변화와 새로운 트렌드를 심층 분석합니다. 입주자 니즈와 운영 전략의 변화를 살펴봅니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      alt: '공유오피스 트렌드',
    },
    author: {
      name: 'SHAREZONE',
    },
    viewCount: 456,
    isFeatured: false,
    isImported: true,
    blogPlatform: 'naver',
    externalUrl: 'https://blog.naver.com/sharezone/trend-2025',
    importedAt: '2025-11-08T10:00:00Z',
    lastSyncedAt: '2025-11-08T10:00:00Z',
    tags: ['트렌드', '시장분석'],
    publishedAt: '2025-11-08T09:00:00Z',
    createdAt: '2025-11-08T10:00:00Z',
    updatedAt: '2025-11-08T10:00:00Z',
  },
  {
    id: 'blog-article-002',
    title: '공간 공유 비즈니스 운영 노하우',
    slug: 'space-sharing-business-tips',
    category: 'tips',
    excerpt: '성공적인 공유오피스 운영을 위한 실전 팁을 공유합니다. 회원 관리부터 수익 극대화까지 현장 경험을 바탕으로 작성했습니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
      alt: '비즈니스 운영',
    },
    author: {
      name: 'SHAREZONE',
    },
    viewCount: 328,
    isFeatured: false,
    isImported: true,
    blogPlatform: 'naver',
    externalUrl: 'https://blog.naver.com/sharezone/operation-tips',
    importedAt: '2025-11-07T14:30:00Z',
    lastSyncedAt: '2025-11-07T14:30:00Z',
    tags: ['운영', '노하우'],
    publishedAt: '2025-11-07T09:00:00Z',
    createdAt: '2025-11-07T14:30:00Z',
    updatedAt: '2025-11-07T14:30:00Z',
  },
  {
    id: 'blog-article-003',
    title: '성공적인 공유오피스 창업 가이드',
    slug: 'successful-coworking-startup',
    category: 'guide',
    excerpt: '공유오피스 창업을 준비하시나요? 입지 선정부터 인테리어, 마케팅까지 단계별로 안내합니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      alt: '창업 가이드',
    },
    author: {
      name: 'SHAREZONE',
    },
    viewCount: 612,
    isFeatured: true,
    isImported: true,
    blogPlatform: 'naver',
    externalUrl: 'https://blog.naver.com/sharezone/startup-guide',
    importedAt: '2025-11-06T11:00:00Z',
    lastSyncedAt: '2025-11-06T11:00:00Z',
    tags: ['창업', '가이드'],
    publishedAt: '2025-11-06T09:00:00Z',
    createdAt: '2025-11-06T11:00:00Z',
    updatedAt: '2025-11-06T11:00:00Z',
  },
  {
    id: 'blog-article-004',
    title: '스타트업을 위한 공간 선택법',
    slug: 'space-selection-for-startups',
    category: 'guide',
    excerpt: '스타트업에게 적합한 공유오피스를 선택하는 방법을 알려드립니다. 비용, 위치, 시설을 고려한 체크리스트를 제공합니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop',
      alt: '스타트업 공간',
    },
    author: {
      name: 'SHAREZONE',
    },
    viewCount: 234,
    isFeatured: false,
    isImported: true,
    blogPlatform: 'naver',
    externalUrl: 'https://blog.naver.com/sharezone/startup-space',
    importedAt: '2025-11-05T15:20:00Z',
    lastSyncedAt: '2025-11-05T15:20:00Z',
    tags: ['스타트업', '선택'],
    publishedAt: '2025-11-05T09:00:00Z',
    createdAt: '2025-11-05T15:20:00Z',
    updatedAt: '2025-11-05T15:20:00Z',
  },
  {
    id: 'blog-article-005',
    title: '공유오피스 임대차 계약 팁',
    slug: 'lease-contract-tips',
    category: 'tips',
    excerpt: '공유오피스 임대차 계약 시 주의할 점을 정리했습니다. 임대인, 임차인 모두에게 유용한 체크리스트입니다.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
      alt: '계약서',
    },
    author: {
      name: 'SHAREZONE',
    },
    viewCount: 189,
    isFeatured: false,
    isImported: true,
    blogPlatform: 'naver',
    externalUrl: 'https://blog.naver.com/sharezone/lease-tips',
    importedAt: '2025-11-04T10:45:00Z',
    lastSyncedAt: '2025-11-04T10:45:00Z',
    tags: ['임대차', '계약'],
    publishedAt: '2025-11-04T09:00:00Z',
    createdAt: '2025-11-04T10:45:00Z',
    updatedAt: '2025-11-04T10:45:00Z',
  },
]

// 블로그 아티클 헬퍼 함수
export function getAllBlogArticles(): Article[] {
  return dummyBlogArticles
}

export function getBlogArticleById(id: string): Article | undefined {
  return dummyBlogArticles.find((article) => article.id === id)
}

// 지역별 매물 필터링
export function getListingsByLocation(province: string): Listing[] {
  return dummyListings.filter(
    (listing) => listing.location.province === province && listing.status === 'active'
  )
}

// 가격 범위로 매물 필터링
export function getListingsByPriceRange(minPrice: number, maxPrice: number): Listing[] {
  return dummyListings.filter(
    (listing) =>
      listing.price.amount >= minPrice &&
      listing.price.amount <= maxPrice &&
      listing.status === 'active'
  )
}

// 면적 범위로 매물 필터링
export function getListingsByAreaRange(minPyeong: number, maxPyeong: number): Listing[] {
  return dummyListings.filter(
    (listing) =>
      listing.area.pyeong >= minPyeong &&
      listing.area.pyeong <= maxPyeong &&
      listing.status === 'active'
  )
}
