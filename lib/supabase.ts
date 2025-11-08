import { createClient } from '@supabase/supabase-js'

// Supabase 프로젝트 연결 정보
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
  )
}

// Supabase 클라이언트 생성
// 참고: sharezone 스키마의 테이블에 접근하려면 테이블 이름 앞에 'sharezone.' 접두사 사용
// 예: supabase.from('sharezone.listings').select('*')
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'sharezone', // 기본 스키마를 sharezone으로 설정
  },
})

// 관리자 전용 클라이언트 (서버 사이드에서만 사용)
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다.'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    db: {
      schema: 'sharezone',
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
