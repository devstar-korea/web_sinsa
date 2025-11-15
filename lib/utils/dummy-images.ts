/**
 * 더미 이미지 유틸리티
 * Unsplash API를 사용하여 카테고리별 고품질 이미지 제공
 */

export type ArticleCategory = 'guide' | 'tips' | 'market'

/**
 * 카테고리별 Unsplash 이미지 매핑
 * 공유오피스, 비즈니스, 부동산 관련 고품질 이미지
 */
const CATEGORY_IMAGES: Record<ArticleCategory, string[]> = {
  guide: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', // Modern office space
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop', // Coworking space
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop', // Open office
  ],
  tips: [
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop', // Business meeting
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop', // Team collaboration
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop', // Office teamwork
  ],
  market: [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop', // Business analytics
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Business charts
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', // Data analysis
  ],
}

/**
 * 아티클 ID를 기반으로 일관된 더미 이미지 URL 반환
 * @param articleId - 아티클 고유 ID
 * @param category - 아티클 카테고리
 * @returns Unsplash 이미지 URL
 */
export function getDummyImageUrl(
  articleId: string,
  category: ArticleCategory
): string {
  const images = CATEGORY_IMAGES[category]

  // 카테고리가 유효하지 않으면 기본 이미지 사용
  if (!images || images.length === 0) {
    return CATEGORY_IMAGES.guide[0]
  }

  // articleId를 숫자로 변환하여 이미지 선택 (일관성 유지)
  const hash = articleId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)

  const index = hash % images.length
  return images[index]
}

/**
 * 카테고리별 랜덤 더미 이미지 URL 반환
 * @param category - 아티클 카테고리
 * @returns Unsplash 이미지 URL
 */
export function getRandomDummyImageUrl(category: ArticleCategory): string {
  const images = CATEGORY_IMAGES[category]
  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex]
}

/**
 * 모든 카테고리의 더미 이미지 URL 배열 반환
 * @returns 모든 더미 이미지 URL 배열
 */
export function getAllDummyImages(): string[] {
  return Object.values(CATEGORY_IMAGES).flat()
}
