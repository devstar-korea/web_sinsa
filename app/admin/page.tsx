import { redirect } from 'next/navigation'

export default function AdminPage() {
  // TODO: 인증 체크 후 로그인 페이지 또는 대시보드로 리다이렉트
  // 현재는 임시로 대시보드로 바로 리다이렉트
  redirect('/admin/dashboard')
}
