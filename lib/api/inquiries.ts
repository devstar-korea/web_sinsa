import { supabase } from '../supabase'

// ============================================================================
// 인수 상담 (Purchase Inquiries) CRUD
// ============================================================================

export interface PurchaseInquiry {
  id?: string
  listing_id?: string
  name: string
  phone: string
  email: string
  purpose: 'investment' | 'startup' | 'expansion' | 'other'
  message?: string
  status?: 'pending' | 'contacted' | 'qualified' | 'converted' | 'rejected'
  assigned_to?: string
  admin_notes?: string
  created_at?: string
  updated_at?: string
}

/**
 * 모든 인수 상담 조회
 */
export async function getAllPurchaseInquiries() {
  const { data, error } = await supabase
    .from('purchase_inquiries')
    .select(`
      *,
      listing:listing_id (
        id,
        title,
        listing_number
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllPurchaseInquiries 에러:', error)
    return null
  }
  return data
}

/**
 * 상태별 인수 상담 조회
 */
export async function getPurchaseInquiriesByStatus(status: string) {
  const { data, error } = await supabase
    .from('purchase_inquiries')
    .select(`
      *,
      listing:listing_id (
        id,
        title,
        listing_number
      )
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getPurchaseInquiriesByStatus 에러:', error)
    return null
  }
  return data
}

/**
 * 특정 인수 상담 조회
 */
export async function getPurchaseInquiryById(id: string) {
  const { data, error } = await supabase
    .from('purchase_inquiries')
    .select(`
      *,
      listing:listing_id (
        id,
        title,
        listing_number,
        province,
        price_amount
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * 인수 상담 생성 (사용자용)
 */
export async function createPurchaseInquiry(inquiry: PurchaseInquiry) {
  const { data, error } = await supabase
    .from('purchase_inquiries')
    .insert(inquiry)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 인수 상담 상태 업데이트
 */
export async function updatePurchaseInquiry(id: string, updates: Partial<PurchaseInquiry>) {
  const { data, error } = await supabase
    .from('purchase_inquiries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 인수 상담 삭제
 */
export async function deletePurchaseInquiry(id: string) {
  const { error } = await supabase
    .from('purchase_inquiries')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

// ============================================================================
// 매각 상담 (Register Inquiries) CRUD
// ============================================================================

export interface RegisterInquiry {
  id?: string
  name: string
  phone: string
  email: string
  location: string
  area_range?: string
  price_range?: string
  message?: string
  status?: 'pending' | 'contacted' | 'qualified' | 'converted' | 'rejected'
  assigned_to?: string
  admin_notes?: string
  linked_listing_id?: string
  created_at?: string
  updated_at?: string
}

/**
 * 모든 매각 상담 조회
 */
export async function getAllRegisterInquiries() {
  const { data, error } = await supabase
    .from('register_inquiries')
    .select(`
      *,
      linked_listing:linked_listing_id (
        id,
        title,
        listing_number
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllRegisterInquiries 에러:', error)
    return null
  }
  return data
}

/**
 * 상태별 매각 상담 조회
 */
export async function getRegisterInquiriesByStatus(status: string) {
  const { data, error } = await supabase
    .from('register_inquiries')
    .select(`
      *,
      linked_listing:linked_listing_id (
        id,
        title,
        listing_number
      )
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getRegisterInquiriesByStatus 에러:', error)
    return null
  }
  return data
}

/**
 * 특정 매각 상담 조회
 */
export async function getRegisterInquiryById(id: string) {
  const { data, error } = await supabase
    .from('register_inquiries')
    .select(`
      *,
      linked_listing:linked_listing_id (
        id,
        title,
        listing_number,
        province,
        price_amount
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * 매각 상담 생성 (사용자용)
 */
export async function createRegisterInquiry(inquiry: RegisterInquiry) {
  const { data, error } = await supabase
    .from('register_inquiries')
    .insert(inquiry)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 매각 상담 상태 업데이트
 */
export async function updateRegisterInquiry(id: string, updates: Partial<RegisterInquiry>) {
  const { data, error } = await supabase
    .from('register_inquiries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 매각 상담 삭제
 */
export async function deleteRegisterInquiry(id: string) {
  const { error } = await supabase
    .from('register_inquiries')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

// ============================================================================
// 통합 통계
// ============================================================================

/**
 * 상담 통계 조회
 */
export async function getInquiryStats() {
  const [purchaseStats, registerStats] = await Promise.all([
    supabase
      .from('purchase_inquiries')
      .select('status', { count: 'exact', head: true })
      .then(({ count }) => ({ total: count || 0 })),
    supabase
      .from('register_inquiries')
      .select('status', { count: 'exact', head: true })
      .then(({ count }) => ({ total: count || 0 })),
  ])

  return {
    purchase: purchaseStats.total,
    register: registerStats.total,
    total: purchaseStats.total + registerStats.total,
  }
}

/**
 * 최근 상담 조회 (양쪽 통합)
 */
export async function getRecentInquiries(limit: number = 10) {
  const [purchaseData, registerData] = await Promise.all([
    supabase
      .from('purchase_inquiries')
      .select('*, listing:listing_id(title)')
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('register_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit),
  ])

  const purchase = purchaseData.data || []
  const register = registerData.data || []

  // 두 배열을 합치고 날짜순 정렬
  const combined = [
    ...purchase.map((item) => ({ ...item, type: 'purchase' as const })),
    ...register.map((item) => ({ ...item, type: 'register' as const })),
  ]
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    .slice(0, limit)

  return combined
}
