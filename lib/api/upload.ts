import { supabase } from '../supabase'

// ============================================================================
// 이미지 업로드 헬퍼 함수
// ============================================================================

/**
 * 스토리지 버킷 이름
 */
export const STORAGE_BUCKETS = {
  LISTINGS: 'listing-images',
  ARTICLES: 'article-images',
  AVATARS: 'avatars',
} as const

/**
 * 파일 업로드 결과
 */
export interface UploadResult {
  url: string
  path: string
  error?: string
}

/**
 * 파일 확장자 추출
 */
function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf('.'))
}

/**
 * 고유한 파일명 생성
 */
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = getFileExtension(originalFilename)
  return `${timestamp}_${random}${extension}`
}

/**
 * 파일 크기 검증 (기본: 5MB)
 */
function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}

/**
 * 이미지 파일 타입 검증
 */
function validateImageType(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return allowedTypes.includes(file.type)
}

// ============================================================================
// 단일 파일 업로드
// ============================================================================

/**
 * 단일 이미지 파일 업로드
 */
export async function uploadImage(
  file: File,
  bucket: keyof typeof STORAGE_BUCKETS,
  folder?: string
): Promise<UploadResult> {
  try {
    // 파일 검증
    if (!validateImageType(file)) {
      return {
        url: '',
        path: '',
        error: '지원하지 않는 파일 형식입니다. (JPG, PNG, WEBP만 가능)',
      }
    }

    if (!validateFileSize(file)) {
      return {
        url: '',
        path: '',
        error: '파일 크기는 5MB를 초과할 수 없습니다.',
      }
    }

    // 파일명 생성
    const filename = generateUniqueFilename(file.name)
    const filePath = folder ? `${folder}/${filename}` : filename

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return {
        url: '',
        path: '',
        error: error.message,
      }
    }

    // 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKETS[bucket]).getPublicUrl(data.path)

    return {
      url: publicUrl,
      path: data.path,
    }
  } catch (err) {
    console.error('Upload exception:', err)
    return {
      url: '',
      path: '',
      error: err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.',
    }
  }
}

// ============================================================================
// 다중 파일 업로드
// ============================================================================

/**
 * 여러 이미지 파일 업로드 (최대 8개)
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: keyof typeof STORAGE_BUCKETS,
  folder?: string,
  maxFiles: number = 8
): Promise<UploadResult[]> {
  if (files.length > maxFiles) {
    return [
      {
        url: '',
        path: '',
        error: `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`,
      },
    ]
  }

  // 모든 파일을 병렬로 업로드
  const uploadPromises = files.map((file) => uploadImage(file, bucket, folder))
  return Promise.all(uploadPromises)
}

// ============================================================================
// 파일 삭제
// ============================================================================

/**
 * Storage에서 파일 삭제
 */
export async function deleteImage(
  path: string,
  bucket: keyof typeof STORAGE_BUCKETS
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).remove([path])

    if (error) {
      console.error('Delete error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (err) {
    console.error('Delete exception:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 여러 파일 삭제
 */
export async function deleteMultipleImages(
  paths: string[],
  bucket: keyof typeof STORAGE_BUCKETS
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).remove(paths)

    if (error) {
      console.error('Delete multiple error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (err) {
    console.error('Delete multiple exception:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.',
    }
  }
}

// ============================================================================
// 매물 이미지 전용 함수
// ============================================================================

/**
 * 매물 이미지 업로드 (최대 8개)
 */
export async function uploadListingImages(files: File[], listingId: string) {
  return uploadMultipleImages(files, 'LISTINGS', listingId, 8)
}

/**
 * 매물 이미지 삭제
 */
export async function deleteListingImage(path: string) {
  return deleteImage(path, 'LISTINGS')
}

/**
 * 매물의 모든 이미지 삭제
 */
export async function deleteAllListingImages(listingId: string) {
  try {
    // 해당 폴더의 모든 파일 목록 가져오기
    const { data: files, error: listError } = await supabase.storage
      .from(STORAGE_BUCKETS.LISTINGS)
      .list(listingId)

    if (listError) {
      return {
        success: false,
        error: listError.message,
      }
    }

    if (!files || files.length === 0) {
      return { success: true }
    }

    // 전체 경로 생성
    const filePaths = files.map((file) => `${listingId}/${file.name}`)

    // 모든 파일 삭제
    return deleteMultipleImages(filePaths, 'LISTINGS')
  } catch (err) {
    console.error('Delete all listing images exception:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : '이미지 삭제 중 오류가 발생했습니다.',
    }
  }
}

// ============================================================================
// 아티클 이미지 전용 함수
// ============================================================================

/**
 * 아티클 썸네일 업로드
 */
export async function uploadArticleThumbnail(file: File, articleId: string) {
  return uploadImage(file, 'ARTICLES', articleId)
}

/**
 * 아티클 썸네일 삭제
 */
export async function deleteArticleThumbnail(path: string) {
  return deleteImage(path, 'ARTICLES')
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * URL에서 Storage 경로 추출
 */
export function extractPathFromUrl(url: string, bucket: keyof typeof STORAGE_BUCKETS): string {
  const bucketName = STORAGE_BUCKETS[bucket]
  const match = url.match(new RegExp(`${bucketName}/(.+)`))
  return match ? match[1] : ''
}

/**
 * 파일 미리보기 URL 생성 (업로드 전)
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * 미리보기 URL 해제 (메모리 관리)
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url)
}
