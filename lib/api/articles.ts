import { supabase } from '../supabase'
import type { Article, ArticleRaw } from '../types'
import { getDummyImageUrl, type ArticleCategory } from '../utils/dummy-images'

// ============================================================================
// 데이터 변환 함수
// ============================================================================

/**
 * Supabase 데이터를 TypeScript Article 타입으로 변환
 */
function transformArticleData(dbArticle: any): Article {
  // thumbnail_url이 없으면 카테고리별 더미 이미지 사용
  const thumbnailUrl = dbArticle.thumbnail_url || getDummyImageUrl(
    dbArticle.id,
    dbArticle.category as ArticleCategory
  )

  return {
    id: dbArticle.id,
    title: dbArticle.title,
    slug: dbArticle.slug,
    category: dbArticle.category,
    excerpt: dbArticle.excerpt || '',
    content: dbArticle.content,
    thumbnail: {
      url: thumbnailUrl,
      alt: dbArticle.title,
    },
    author: {
      name: 'SHAREZONE',
      avatar: undefined,
    },
    viewCount: dbArticle.view_count || 0,
    isFeatured: dbArticle.is_featured || false,
    tags: dbArticle.tags || [],
    isImported: dbArticle.is_imported || false,
    blogPlatform: dbArticle.is_imported ? 'naver' : undefined,
    externalId: undefined,
    externalUrl: dbArticle.external_url,
    importedAt: undefined,
    lastSyncedAt: dbArticle.last_synced_at,
    publishedAt: dbArticle.published_at,
    createdAt: dbArticle.created_at,
    updatedAt: dbArticle.updated_at,
  }
}

// ============================================================================
// 아티클 CRUD
// ============================================================================

/**
 * 모든 아티클 조회 (published만)
 */
export async function getAllArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })

  if (error) {
    console.error('getAllArticles 에러:', error)
    return null
  }
  return data ? data.map(transformArticleData) : null
}

/**
 * 관리자용: 모든 아티클 조회
 */
export async function getAllArticlesAdmin(): Promise<ArticleRaw[] | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllArticlesAdmin 에러:', error)
    return null
  }
  return data
}

/**
 * 카테고리별 아티클 조회
 */
export async function getArticlesByCategory(category: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })

  if (error) {
    console.error('getArticlesByCategory 에러:', error)
    return null
  }
  return data ? data.map(transformArticleData) : null
}

/**
 * Featured 아티클 조회
 */
export async function getFeaturedArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('getFeaturedArticles 에러:', error)
    return null
  }
  return data ? data.map(transformArticleData) : null
}

/**
 * 특정 아티클 조회 (ID)
 */
export async function getArticleById(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * 특정 아티클 조회 (slug)
 */
export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

/**
 * 아티클 생성
 */
export async function createArticle(article: Partial<ArticleRaw>) {
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...article,
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 아티클 수정
 */
export async function updateArticle(id: string, updates: Partial<ArticleRaw>) {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 아티클 삭제
 */
export async function deleteArticle(id: string) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * 조회수 증가
 */
export async function incrementArticleViewCount(id: string) {
  // RPC 함수 사용 시도
  const { error: rpcError } = await supabase.rpc('increment_article_view_count', {
    article_id: id,
  })

  if (rpcError) {
    // RPC 함수가 없으면 직접 업데이트
    const { data: article } = await supabase
      .from('articles')
      .select('view_count')
      .eq('id', id)
      .single()

    if (article) {
      const { error: updateError } = await supabase
        .from('articles')
        .update({ view_count: (article.view_count || 0) + 1 })
        .eq('id', id)

      if (updateError) throw updateError
    }
  }

  return { success: true }
}

/**
 * 블로그 동기화 (imported articles)
 */
export async function syncImportedArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_imported', true)
    .order('last_synced_at', { ascending: true, nullsFirst: true })
    .limit(10)

  if (error) throw error
  return data
}

/**
 * 아티클 동기화 상태 업데이트
 */
export async function updateArticleSyncStatus(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .update({
      last_synced_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
