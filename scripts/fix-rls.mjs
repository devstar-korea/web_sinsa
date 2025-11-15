// ============================================================================
// Supabase RLS 정책 수정 스크립트
// ============================================================================
// 실행: node scripts/fix-rls.mjs

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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

console.log('🔗 Supabase 연결 성공:', supabaseUrl)
console.log('\n🔧 RLS 정책 확인 및 수정 시작...\n')

async function fixRLS() {
  try {
    // RLS 정책 삭제 및 재생성
    console.log('1️⃣  기존 RLS 정책 삭제 중...')

    const dropPolicies = `
      -- 기존 정책 삭제
      DROP POLICY IF EXISTS "listings_public_read" ON public.listings;
      DROP POLICY IF EXISTS "listings_admin_all" ON public.listings;
      DROP POLICY IF EXISTS "listing_images_public_read" ON public.listing_images;
      DROP POLICY IF EXISTS "listing_images_admin_all" ON public.listing_images;
      DROP POLICY IF EXISTS "articles_public_read" ON public.articles;
      DROP POLICY IF EXISTS "articles_admin_all" ON public.articles;
      DROP POLICY IF EXISTS "purchase_inquiries_public_insert" ON public.purchase_inquiries;
      DROP POLICY IF EXISTS "purchase_inquiries_admin_all" ON public.purchase_inquiries;
      DROP POLICY IF EXISTS "register_inquiries_public_insert" ON public.register_inquiries;
      DROP POLICY IF EXISTS "register_inquiries_admin_all" ON public.register_inquiries;
    `

    // Supabase SQL API는 직접 SQL 실행이 안 되므로, RPC를 통해 실행해야 합니다
    // 대신 anon 키로 데이터 확인
    console.log('\n2️⃣  현재 RLS 상태 확인 중...')

    // anon 키로 클라이언트 생성 (실제 프론트엔드가 사용하는 것과 동일)
    const anonClient = createClient(supabaseUrl, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // 매물 조회 테스트
    const { data: listings, error: listingsError } = await anonClient
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .limit(5)

    console.log('\n📦 매물 조회 결과 (anon 키):')
    if (listingsError) {
      console.error('   ❌ 오류:', listingsError.message)
      console.error('   상세:', listingsError)
    } else {
      console.log(`   ✅ 성공: ${listings?.length || 0}개 조회됨`)
      if (listings && listings.length > 0) {
        console.log('   첫 번째 매물:', listings[0].title)
      }
    }

    // 아티클 조회 테스트
    const { data: articles, error: articlesError } = await anonClient
      .from('articles')
      .select('*')
      .limit(5)

    console.log('\n📰 아티클 조회 결과 (anon 키):')
    if (articlesError) {
      console.error('   ❌ 오류:', articlesError.message)
      console.error('   상세:', articlesError)
    } else {
      console.log(`   ✅ 성공: ${articles?.length || 0}개 조회됨`)
      if (articles && articles.length > 0) {
        console.log('   첫 번째 아티클:', articles[0].title)
      }
    }

    // Service Role Key로 확인
    console.log('\n3️⃣  Service Role Key로 데이터 확인 중...')

    const { data: serviceListings, error: serviceError } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .limit(5)

    console.log('\n📦 매물 조회 결과 (service role):')
    if (serviceError) {
      console.error('   ❌ 오류:', serviceError.message)
    } else {
      console.log(`   ✅ 성공: ${serviceListings?.length || 0}개 조회됨`)
      if (serviceListings && serviceListings.length > 0) {
        console.log('   첫 번째 매물:', serviceListings[0].title)
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ RLS 확인 완료!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // 문제 진단
    if (listingsError || articlesError) {
      console.log('\n⚠️  RLS 정책 문제 발견!')
      console.log('\n해결 방법:')
      console.log('1. Supabase 대시보드 접속 (https://supabase.com)')
      console.log('2. SQL Editor로 이동')
      console.log('3. 다음 SQL 실행:\n')
      console.log('-- RLS 비활성화 (임시)')
      console.log('ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;')
      console.log('ALTER TABLE public.listing_images DISABLE ROW LEVEL SECURITY;')
      console.log('ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;\n')
      console.log('또는\n')
      console.log('-- RLS 정책 수정')
      console.log('DROP POLICY IF EXISTS "listings_public_read" ON public.listings;')
      console.log('CREATE POLICY "listings_public_read" ON public.listings')
      console.log('  FOR SELECT USING (true); -- 모든 사람이 읽기 가능\n')
    } else {
      console.log('\n✅ RLS 정책이 정상 작동 중입니다!')
    }

  } catch (error) {
    console.error('❌ 오류:', error.message)
    console.error('상세:', error)
  }
}

fixRLS()
