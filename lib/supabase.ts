import { createClient } from '@supabase/supabase-js'

// Supabase 프로젝트 연결 정보
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Supabase 클라이언트 생성 (public 스키마 사용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 관리자 전용 클라이언트 (서버 사이드에서만 사용)
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다.'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
