// ============================================================================
// Supabase 데이터 확인 스크립트
// ============================================================================
// 실행: node scripts/check-data.mjs

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
console.log('\n📊 현재 데이터베이스 상태 확인\n')

async function checkData() {
  try {
    // 1. 매물 확인
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (listingsError) throw listingsError
    console.log(`📦 매물: ${listings?.length || 0}개`)
    if (listings && listings.length > 0) {
      listings.forEach((l, i) => {
        console.log(`   ${i + 1}. ${l.listing_number} - ${l.title}`)
      })
    }

    // 2. 이미지 확인
    const { data: images, error: imagesError } = await supabase
      .from('listing_images')
      .select('*')

    if (imagesError) throw imagesError
    console.log(`\n📸 매물 이미지: ${images?.length || 0}개`)

    // 3. 아티클 확인
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (articlesError) throw articlesError
    console.log(`\n📰 아티클: ${articles?.length || 0}개`)
    if (articles && articles.length > 0) {
      articles.forEach((a, i) => {
        console.log(`   ${i + 1}. ${a.slug} - ${a.title}`)
      })
    }

    // 4. 인수 상담 확인
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchase_inquiries')
      .select('*')

    if (purchasesError) throw purchasesError
    console.log(`\n💼 인수 상담: ${purchases?.length || 0}개`)

    // 5. 매각 상담 확인
    const { data: registers, error: registersError } = await supabase
      .from('register_inquiries')
      .select('*')

    if (registersError) throw registersError
    console.log(`📋 매각 상담: ${registers?.length || 0}개`)

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ 데이터 확인 완료!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  } catch (error) {
    console.error('❌ 오류:', error.message)
  }
}

checkData()
