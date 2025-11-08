import { supabase } from '../supabase'
import type { Listing, ListingImage } from '../types'

// ============================================================================
// 매물 CRUD
// ============================================================================

/**
 * 모든 매물 조회 (active만)
 */
export async function getAllListings() {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images (*)
    `)
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllListings 에러:', error)
    return null
  }
  return data
}

/**
 * 관리자용: 모든 매물 조회 (상태 무관)
 */
export async function getAllListingsAdmin() {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images (*)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllListingsAdmin 에러:', error)
    console.error('에러 상세:', JSON.stringify(error, null, 2))
    return null
  }
  return data
}

/**
 * 특정 매물 조회
 */
export async function getListingById(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images (*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * slug로 매물 조회
 */
export async function getListingBySlug(slug: string) {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images (*)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

/**
 * 지역별 매물 조회
 */
export async function getListingsByProvince(province: string) {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images (*)
    `)
    .eq('province', province)
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getListingsByProvince 에러:', error)
    return null
  }
  return data
}

/**
 * 매물 생성
 */
export async function createListing(listing: Partial<Listing>) {
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  const { data, error } = await supabase
    .from('listings')
    .insert({
      ...listing,
      created_by: userId,
      updated_by: userId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 매물 수정
 */
export async function updateListing(id: string, updates: Partial<Listing>) {
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  const { data, error } = await supabase
    .from('listings')
    .update({
      ...updates,
      updated_by: userId,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 매물 삭제 (Soft Delete)
 */
export async function deleteListing(id: string) {
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  const { data, error } = await supabase
    .from('listings')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 매물 영구 삭제 (관리자 전용)
 */
export async function permanentDeleteListing(id: string) {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * 조회수 증가
 */
export async function incrementViewCount(id: string) {
  const { data, error } = await supabase.rpc('increment_listing_view_count', {
    listing_id: id,
  })

  if (error) {
    // RPC 함수가 없으면 직접 업데이트
    const { data: listing } = await supabase
      .from('listings')
      .select('view_count')
      .eq('id', id)
      .single()

    if (listing) {
      const { error: updateError } = await supabase
        .from('listings')
        .update({ view_count: (listing.view_count || 0) + 1 })
        .eq('id', id)

      if (updateError) throw updateError
    }
  }

  return data
}

// ============================================================================
// 매물 이미지 관리
// ============================================================================

/**
 * 매물 이미지 조회
 */
export async function getListingImages(listingId: string) {
  const { data, error } = await supabase
    .from('listing_images')
    .select('*')
    .eq('listing_id', listingId)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data
}

/**
 * 매물 이미지 추가
 */
export async function addListingImage(image: Partial<ListingImage>) {
  const { data, error} = await supabase
    .from('listing_images')
    .insert(image)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 매물 이미지 삭제
 */
export async function deleteListingImage(imageId: string) {
  const { error } = await supabase
    .from('listing_images')
    .delete()
    .eq('id', imageId)

  if (error) throw error
  return { success: true }
}

/**
 * 매물 이미지 순서 변경
 */
export async function reorderListingImages(updates: { id: string; display_order: number }[]) {
  const promises = updates.map(({ id, display_order }) =>
    supabase
      .from('listing_images')
      .update({ display_order })
      .eq('id', id)
  )

  const results = await Promise.all(promises)
  const errors = results.filter((r) => r.error)

  if (errors.length > 0) {
    throw errors[0].error
  }

  return { success: true }
}
