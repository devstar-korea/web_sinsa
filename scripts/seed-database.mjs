// ============================================================================
// Supabase 데이터베이스 시딩 스크립트
// ============================================================================
// 실행: node scripts/seed-database.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 환경 변수 수동 로드
const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=')
  if (key && values.length > 0) {
    envVars[key.trim()] = values.join('=').trim()
  }
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Supabase 클라이언트 생성 (Service Role Key 사용)
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '설정됨' : '없음')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

console.log('🔗 Supabase 연결 성공:', supabaseUrl)

// SQL 파일 읽기 및 실행 함수
async function executeSqlFile(filePath, description) {
  console.log(`\n📄 ${description} 실행 중...`)
  console.log(`   파일: ${filePath}`)

  try {
    const sql = readFileSync(filePath, 'utf-8')

    // SQL을 세미콜론으로 분리하여 개별 실행
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`   총 ${statements.length}개 SQL 구문 실행`)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]

      // 주석 제거
      if (statement.startsWith('--') || statement.length < 5) {
        continue
      }

      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement })

        if (error) {
          // RPC 방식이 안 되면 직접 REST API 호출
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({ query: statement })
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`)
          }
        }

        successCount++
        if (successCount % 10 === 0) {
          console.log(`   ✓ ${successCount}개 완료...`)
        }
      } catch (err) {
        errorCount++
        console.error(`   ❌ 오류 (구문 ${i + 1}):`, err.message.substring(0, 100))
      }
    }

    console.log(`\n✅ ${description} 완료: ${successCount}개 성공, ${errorCount}개 실패`)
    return { success: errorCount === 0, successCount, errorCount }

  } catch (error) {
    console.error(`❌ ${description} 실패:`, error.message)
    return { success: false, error: error.message }
  }
}

// 대안: REST API로 직접 SQL 실행
async function executeRawSql(sql, description) {
  console.log(`\n📄 ${description} 실행 중...`)

  try {
    const { data, error } = await supabase.from('_sql').select('*').limit(0)

    // Supabase SQL API 엔드포인트 직접 호출
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }

    console.log(`✅ ${description} 완료`)
    return { success: true }

  } catch (error) {
    console.error(`❌ ${description} 실패:`, error.message)
    return { success: false, error: error.message }
  }
}

// 데이터 직접 삽입 (SQL 대신 Supabase Client 사용)
async function insertTestData() {
  console.log('\n🌱 테스트 데이터 삽입 시작...\n')

  try {
    // 1. 매물 데이터 삽입
    console.log('📦 1. 매물 데이터 삽입 중...')
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .insert([
        {
          listing_number: 'SZ-2024-001',
          title: '강남역 도보 5분 프리미엄 공유오피스',
          slug: 'gangnam-premium-office',
          province: '서울',
          total_rooms: 25,
          area_square_meter: 165.29,
          area_pyeong: 50.0,
          price_amount: 500000000,
          monthly_revenue_amount: 12000000,
          rental_deposit: 100000000,
          monthly_rent: 5000000,
          lease_period_years: 5,
          description: '강남역 인근 최고급 공유오피스입니다. 만실 운영 중이며 안정적인 수익을 보장합니다.',
          highlights: ['강남역 도보 5분', '만실 운영 중', '프리미엄 인테리어', '24시간 출입 가능'],
          status: 'active'
        },
        {
          listing_number: 'SZ-2024-002',
          title: '판교 테크노밸리 공유오피스',
          slug: 'pangyo-techno-valley',
          province: '경기',
          total_rooms: 30,
          area_square_meter: 198.35,
          area_pyeong: 60.0,
          price_amount: 600000000,
          monthly_revenue_amount: 15000000,
          rental_deposit: 150000000,
          monthly_rent: 7000000,
          lease_period_years: 5,
          description: 'IT 기업들이 선호하는 판교 테크노밸리 핵심 위치입니다.',
          highlights: ['판교역 5분', 'IT 기업 밀집지', '고급 회의실 3개', '무료 주차 15대'],
          status: 'active'
        },
        {
          listing_number: 'SZ-2024-003',
          title: '홍대입구 크리에이티브 오피스',
          slug: 'hongdae-creative-office',
          province: '서울',
          total_rooms: 20,
          area_square_meter: 132.23,
          area_pyeong: 40.0,
          price_amount: 350000000,
          monthly_revenue_amount: 9000000,
          rental_deposit: 80000000,
          monthly_rent: 4000000,
          lease_period_years: 3,
          description: '크리에이터, 스타트업을 위한 감성 공유오피스입니다.',
          highlights: ['홍대입구역 도보 3분', '루프탑 라운지', '촬영 스튜디오', '카페 분위기'],
          status: 'active'
        },
        {
          listing_number: 'SZ-2024-004',
          title: '여의도 금융가 비즈니스 센터',
          slug: 'yeouido-business-center',
          province: '서울',
          total_rooms: 40,
          area_square_meter: 264.46,
          area_pyeong: 80.0,
          price_amount: 800000000,
          monthly_revenue_amount: 20000000,
          rental_deposit: 200000000,
          monthly_rent: 10000000,
          lease_period_years: 7,
          description: '여의도 금융가 핵심 상권의 프리미엄 비즈니스 센터입니다.',
          highlights: ['여의도역 직결', '한강뷰', '대기업 임차인', 'VIP 라운지'],
          status: 'active'
        },
        {
          listing_number: 'SZ-2024-005',
          title: '부산 서면 공유오피스',
          slug: 'busan-seomyeon-office',
          province: '부산',
          total_rooms: 18,
          area_square_meter: 119.01,
          area_pyeong: 36.0,
          price_amount: 280000000,
          monthly_revenue_amount: 7000000,
          rental_deposit: 60000000,
          monthly_rent: 3000000,
          lease_period_years: 3,
          description: '부산 최대 상권 서면의 합리적인 가격의 공유오피스입니다.',
          highlights: ['서면역 2분', '부산 최대 상권', '리모델링 완료', '저렴한 임대료'],
          status: 'active'
        }
      ])
      .select()

    if (listingsError) throw listingsError
    console.log(`✅ 매물 ${listings.length}개 삽입 완료`)

    // 2. 매물 이미지 삽입
    console.log('📸 2. 매물 이미지 삽입 중...')
    const listingImages = []

    for (const listing of listings) {
      if (listing.listing_number === 'SZ-2024-001') {
        listingImages.push(
          { listing_id: listing.id, image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', display_order: 1, alt_text: '외부 전경' },
          { listing_id: listing.id, image_url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', display_order: 2, alt_text: '오픈 오피스 공간' },
          { listing_id: listing.id, image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', display_order: 3, alt_text: '회의실' },
          { listing_id: listing.id, image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', display_order: 4, alt_text: '라운지' },
          { listing_id: listing.id, image_url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800', display_order: 5, alt_text: '개인 오피스' }
        )
      } else {
        listingImages.push(
          { listing_id: listing.id, image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', display_order: 1, alt_text: '오피스 공간' }
        )
      }
    }

    const { data: images, error: imagesError } = await supabase
      .from('listing_images')
      .insert(listingImages)
      .select()

    if (imagesError) throw imagesError
    console.log(`✅ 이미지 ${images.length}개 삽입 완료`)

    // 3. 아티클 삽입
    console.log('📰 3. 아티클 삽입 중...')
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .insert([
        {
          title: '공유오피스 창업 가이드: 성공을 위한 10가지 체크리스트',
          slug: 'coworking-startup-guide',
          excerpt: '공유오피스 창업을 고려 중이신가요? 성공적인 공유오피스 운영을 위한 필수 체크리스트를 확인하세요.',
          content: '## 공유오피스 창업, 이것만은 꼭!\n\n공유오피스는 단순히 공간을 임대하는 것을 넘어, 커뮤니티를 만들고 가치를 제공하는 비즈니스입니다.\n\n### 1. 입지 선정\n성공의 70%는 입지에서 결정됩니다.\n\n### 2. 타겟 고객 정의\n누구를 위한 공간인가?\n\n### 3. 차별화 포인트\n우리만의 특별함은 무엇인가?',
          category: 'startup',
          tags: ['창업', '가이드', '체크리스트'],
          is_featured: true,
          published_at: new Date().toISOString()
        },
        {
          title: '공유오피스 인수 시 반드시 확인해야 할 재무제표 항목',
          slug: 'financial-checklist',
          excerpt: '공유오피스 인수를 고려 중이시라면, 재무제표를 통해 수익성과 안정성을 철저히 검증해야 합니다.',
          content: '## 숨겨진 리스크를 찾아내는 법\n\n매물을 볼 때 가장 중요한 것은 실제 수익성입니다.\n\n### 매출 확인\n- 월별 매출 추이\n- 계절성 분석\n- 고객 이탈률\n\n### 비용 구조\n- 고정비와 변동비\n- 숨겨진 비용 찾기',
          category: 'acquisition',
          tags: ['인수', '재무', 'M&A'],
          is_featured: true,
          published_at: new Date().toISOString()
        },
        {
          title: '2024년 공유오피스 트렌드: 하이브리드 워크의 확산',
          slug: 'coworking-trends-2024',
          excerpt: '팬데믹 이후 하이브리드 워크가 일상화되면서 공유오피스 시장이 급성장하고 있습니다.',
          content: '## 변화하는 업무 환경\n\n코로나19 이후 재택근무와 사무실 근무를 병행하는 하이브리드 워크가 확산되고 있습니다.\n\n### 주요 트렌드\n1. 유연한 멤버십 옵션\n2. 프라이빗 오피스 수요 증가\n3. 웰니스 공간 확대',
          category: 'operation',
          tags: ['트렌드', '하이브리드', '시장분석'],
          is_featured: true,
          published_at: new Date().toISOString()
        },
        {
          title: '공유오피스 매각 타이밍: 언제 팔아야 최고가를 받을까?',
          slug: 'best-time-to-sell',
          excerpt: '공유오피스 매각을 고려 중이시라면, 최적의 타이밍을 선택하는 것이 중요합니다.',
          content: '## 매각 타이밍의 중요성\n\n공유오피스 매각은 타이밍이 전부입니다.\n\n### 최적의 매각 시기\n- 만실 달성 후 6개월\n- 리뉴얼 완료 직후\n- 장기 계약 체결 시점\n\n### 피해야 할 시기\n- 공실률 상승기\n- 대규모 퇴실 예정 시',
          category: 'exit',
          tags: ['매각', '타이밍', '전략'],
          is_featured: true,
          published_at: new Date().toISOString()
        },
        {
          title: '공유오피스 운영 노하우: 고객 만족도를 높이는 5가지 방법',
          slug: 'customer-satisfaction-tips',
          excerpt: '성공적인 공유오피스 운영의 핵심은 고객 만족도입니다. 실전 노하우를 공개합니다.',
          content: '## 고객이 떠나지 않는 비결\n\n재계약률 90% 이상을 유지하는 운영 노하우\n\n### 1. 커뮤니티 이벤트\n월 2회 이상 네트워킹 행사\n\n### 2. 즉각적인 응대\n불편사항 24시간 내 해결\n\n### 3. 개인화 서비스\n멤버별 맞춤 케어',
          category: 'operation',
          tags: ['운영', '고객만족', '재계약'],
          is_featured: true,
          published_at: new Date().toISOString()
        },
        {
          title: '공유오피스 투자 ROI 분석: 실제 수익률은 얼마나 될까?',
          slug: 'roi-analysis',
          excerpt: '공유오피스 투자의 실제 수익률을 사례를 통해 분석해드립니다.',
          content: '## 리얼 ROI 공개\n\n강남 A 공유오피스 실제 투자 수익률\n\n### 투자 금액\n- 매입가: 5억\n- 리모델링: 1억\n- 총 투자: 6억\n\n### 연간 수익\n- 월 매출: 1,200만원\n- 월 순이익: 800만원\n- 연 수익률: 16%\n\n### 회수 기간\n약 6.25년',
          category: 'investment',
          tags: ['투자', 'ROI', '수익률'],
          is_featured: true,
          published_at: new Date().toISOString()
        }
      ])
      .select()

    if (articlesError) throw articlesError
    console.log(`✅ 아티클 ${articles.length}개 삽입 완료`)

    // 4. 인수 상담 데이터 삽입
    console.log('💼 4. 인수 상담 데이터 삽입 중...')
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchase_inquiries')
      .insert([
        {
          name: '김투자',
          phone: '010-1234-5678',
          email: 'investor1@example.com',
          purpose: 'investment',
          message: '강남 지역 공유오피스 투자에 관심이 있습니다. SZ-2024-001 매물에 대해 자세한 상담 원합니다.',
          status: 'pending'
        },
        {
          name: '이창업',
          phone: '010-2345-6789',
          email: 'startup@example.com',
          purpose: 'startup',
          message: '공유오피스 창업을 준비 중입니다. 판교 지역 매물 정보 부탁드립니다.',
          status: 'contacted'
        },
        {
          name: '박확장',
          phone: '010-3456-7890',
          email: 'expand@example.com',
          purpose: 'expansion',
          message: '기존 공유오피스를 운영 중인데, 2호점 오픈을 고려하고 있습니다.',
          status: 'qualified'
        },
        {
          name: '최수익',
          phone: '010-4567-8901',
          email: 'profit@example.com',
          purpose: 'investment',
          message: '안정적인 수익 창출이 가능한 매물을 찾고 있습니다.',
          status: 'pending'
        },
        {
          name: '정프랜차이즈',
          phone: '010-5678-9012',
          email: 'franchise@example.com',
          purpose: 'expansion',
          message: '프랜차이즈 확장을 위한 매물을 알아보고 있습니다.',
          status: 'contacted'
        }
      ])
      .select()

    if (purchasesError) throw purchasesError
    console.log(`✅ 인수 상담 ${purchases.length}개 삽입 완료`)

    // 5. 매각 상담 데이터 삽입
    console.log('📋 5. 매각 상담 데이터 삽입 중...')
    const { data: registers, error: registersError } = await supabase
      .from('register_inquiries')
      .insert([
        {
          name: '강매각',
          phone: '010-1111-2222',
          email: 'sell1@example.com',
          location: '서울 마포구',
          area_range: '30-40평',
          price_range: '3-4억',
          message: '홍대 인근 공유오피스 매각을 희망합니다. 현재 만실 운영 중입니다.',
          status: 'pending'
        },
        {
          name: '윤오너',
          phone: '010-2222-3333',
          email: 'owner@example.com',
          location: '경기 성남시',
          area_range: '50-60평',
          price_range: '5-6억',
          message: '판교 테크노밸리 공유오피스 매각 상담 요청드립니다.',
          status: 'contacted'
        },
        {
          name: '한사장',
          phone: '010-3333-4444',
          email: 'boss@example.com',
          location: '서울 영등포구',
          area_range: '70-80평',
          price_range: '7-8억',
          message: '여의도 오피스 빌딩 내 공유오피스 매각 희망합니다.',
          status: 'qualified'
        },
        {
          name: '송대표',
          phone: '010-4444-5555',
          email: 'ceo@example.com',
          location: '부산 부산진구',
          area_range: '40-50평',
          price_range: '3억대',
          message: '서면 공유오피스 매각 문의드립니다.',
          status: 'pending'
        }
      ])
      .select()

    if (registersError) throw registersError
    console.log(`✅ 매각 상담 ${registers.length}개 삽입 완료`)

    // 최종 결과 출력
    console.log('\n🎉 테스트 데이터 삽입 완료!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📦 매물: ${listings.length}개`)
    console.log(`📸 이미지: ${images.length}개`)
    console.log(`📰 아티클: ${articles.length}개`)
    console.log(`💼 인수 상담: ${purchases.length}개`)
    console.log(`📋 매각 상담: ${registers.length}개`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    return { success: true }

  } catch (error) {
    console.error('❌ 데이터 삽입 실패:', error.message)
    console.error('상세 정보:', error)
    return { success: false, error: error.message }
  }
}

// 메인 실행
async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('🚀 Supabase 데이터베이스 시딩 시작')
  console.log('═══════════════════════════════════════════════')

  const result = await insertTestData()

  if (result.success) {
    console.log('\n✅ 모든 작업이 성공적으로 완료되었습니다!')
    process.exit(0)
  } else {
    console.log('\n❌ 작업 중 오류가 발생했습니다.')
    process.exit(1)
  }
}

main()
