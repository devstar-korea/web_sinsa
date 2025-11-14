'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExternalLink, Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import {
  getAllArticlesAdmin,
  createArticle,
  updateArticle,
  deleteArticle,
} from '@/lib/api/articles'
import type { ArticleRaw } from '@/lib/types'

const categoryLabels = {
  guide: '가이드',
  tips: '노하우',
  market: '트렌드',
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleRaw[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'guide' | 'tips' | 'market'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<ArticleRaw | null>(null)

  // 추가 폼 상태
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    thumbnail_url: '',
    external_url: '',
    category: 'guide' as 'guide' | 'tips' | 'market',
  })

  // 수정 폼 상태
  const [editArticle, setEditArticle] = useState({
    title: '',
    excerpt: '',
    thumbnail_url: '',
    external_url: '',
    category: 'guide' as 'guide' | 'tips' | 'market',
  })

  // 데이터 로딩
  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setIsLoading(true)
      const data = await getAllArticlesAdmin()
      setArticles(data || [])
    } catch (err) {
      console.error('아티클 조회 실패:', err)
      alert('아티클을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((article) => article.category === selectedCategory)

  const handleOpenAddModal = () => {
    setNewArticle({
      title: '',
      excerpt: '',
      thumbnail_url: '',
      external_url: '',
      category: 'guide',
    })
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleAddArticle = async () => {
    if (!newArticle.title || !newArticle.excerpt || !newArticle.external_url) {
      alert('제목, 요약, 블로그 URL은 필수입니다.')
      return
    }

    try {
      await createArticle({
        title: newArticle.title,
        slug: newArticle.title.toLowerCase().replace(/\s+/g, '-'),
        category: newArticle.category,
        excerpt: newArticle.excerpt,
        thumbnail_url: newArticle.thumbnail_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        thumbnail_alt: newArticle.title,
        author_name: 'SHAREZONE',
        is_featured: false,
        is_imported: true,
        blog_platform: 'naver',
        external_url: newArticle.external_url,
        imported_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
      })

      await loadArticles()
      handleCloseAddModal()
    } catch (err) {
      console.error('아티클 추가 실패:', err)
      alert('아티클 추가에 실패했습니다.')
    }
  }

  const handleOpenEditModal = (article: ArticleRaw) => {
    setSelectedArticle(article)
    setEditArticle({
      title: article.title,
      excerpt: article.excerpt,
      thumbnail_url: article.thumbnail_url || '',
      external_url: article.external_url || '',
      category: article.category,
    })
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedArticle(null)
  }

  const handleUpdateArticle = async () => {
    if (!selectedArticle) return

    if (!editArticle.title || !editArticle.excerpt) {
      alert('제목과 요약은 필수입니다.')
      return
    }

    try {
      await updateArticle(selectedArticle.id, {
        title: editArticle.title,
        excerpt: editArticle.excerpt,
        thumbnail_url: editArticle.thumbnail_url,
        external_url: editArticle.external_url,
        category: editArticle.category,
      })

      await loadArticles()
      handleCloseEditModal()
    } catch (err) {
      console.error('아티클 수정 실패:', err)
      alert('아티클 수정에 실패했습니다.')
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('이 콘텐츠를 삭제하시겠습니까?')) return

    try {
      await deleteArticle(id)
      await loadArticles()
    } catch (err) {
      console.error('아티클 삭제 실패:', err)
      alert('아티클 삭제에 실패했습니다.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-main-xl font-bold text-grey-900">콘텐츠 관리</h1>
          <p className="text-body text-grey-600 mt-2">
            블로그 글을 가져와서 웹사이트에 표시합니다
          </p>
        </div>
        <Button onClick={handleOpenAddModal} className="gap-2">
          <Plus className="w-4 h-4" />
          블로그 글 추가
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          전체
          <Badge variant="secondary" className="ml-2 bg-white/20 text-inherit border-0">
            {articles.length}
          </Badge>
        </Button>
        <Button
          variant={selectedCategory === 'guide' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('guide')}
        >
          가이드
          <Badge variant="secondary" className="ml-2 bg-white/20 text-inherit border-0">
            {articles.filter((a) => a.category === 'guide').length}
          </Badge>
        </Button>
        <Button
          variant={selectedCategory === 'tips' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('tips')}
        >
          노하우
          <Badge variant="secondary" className="ml-2 bg-white/20 text-inherit border-0">
            {articles.filter((a) => a.category === 'tips').length}
          </Badge>
        </Button>
        <Button
          variant={selectedCategory === 'market' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('market')}
        >
          트렌드
          <Badge variant="secondary" className="ml-2 bg-white/20 text-inherit border-0">
            {articles.filter((a) => a.category === 'market').length}
          </Badge>
        </Button>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:border-primary transition-colors">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="w-32 h-24 flex-shrink-0 bg-grey-100 rounded-lg overflow-hidden">
                  <img
                    src={article.thumbnail_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'}
                    alt={article.thumbnail_alt || article.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {categoryLabels[article.category]}
                        </Badge>
                        <ExternalLink className="w-3 h-3 text-grey-500" />
                      </div>
                      <h3 className="text-main font-bold text-grey-900">{article.title}</h3>
                      <p className="text-sm text-grey-600 mt-1 line-clamp-2">{article.excerpt}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-grey-500">
                    <div className="flex items-center gap-4">
                      <span>{new Date(article.published_at || '').toLocaleDateString('ko-KR')}</span>
                      <span>조회 {article.view_count || 0}회</span>
                      {article.external_url && (
                        <a
                          href={article.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          원문 보기
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditModal(article)}
                        className="gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredArticles.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-grey-500">
              해당 카테고리의 콘텐츠가 없습니다
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={handleCloseAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-main-lg">블로그 글 추가</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-grey-900">
                제목 *
              </Label>
              <Input
                id="title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                placeholder="블로그 글 제목을 입력하세요"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="excerpt" className="text-sm font-medium text-grey-900">
                요약 *
              </Label>
              <Textarea
                id="excerpt"
                value={newArticle.excerpt}
                onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                placeholder="글의 요약을 입력하세요 (2-3줄)"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="external_url" className="text-sm font-medium text-grey-900">
                블로그 URL *
              </Label>
              <Input
                id="external_url"
                value={newArticle.external_url}
                onChange={(e) => setNewArticle({ ...newArticle, external_url: e.target.value })}
                placeholder="https://blog.naver.com/..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="thumbnail_url" className="text-sm font-medium text-grey-900">
                썸네일 URL (선택)
              </Label>
              <Input
                id="thumbnail_url"
                value={newArticle.thumbnail_url}
                onChange={(e) => setNewArticle({ ...newArticle, thumbnail_url: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
              <p className="text-xs text-grey-500 mt-1">
                입력하지 않으면 기본 이미지가 사용됩니다
              </p>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium text-grey-900">
                카테고리 *
              </Label>
              <Select
                value={newArticle.category}
                onValueChange={(value) =>
                  setNewArticle({ ...newArticle, category: value as any })
                }
              >
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guide">가이드</SelectItem>
                  <SelectItem value="tips">노하우</SelectItem>
                  <SelectItem value="market">트렌드</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddArticle} className="flex-1">
                추가
              </Button>
              <Button onClick={handleCloseAddModal} variant="outline" className="flex-1">
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-main-lg">콘텐츠 수정</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-title" className="text-sm font-medium text-grey-900">
                제목 *
              </Label>
              <Input
                id="edit-title"
                value={editArticle.title}
                onChange={(e) => setEditArticle({ ...editArticle, title: e.target.value })}
                placeholder="블로그 글 제목을 입력하세요"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-excerpt" className="text-sm font-medium text-grey-900">
                요약 *
              </Label>
              <Textarea
                id="edit-excerpt"
                value={editArticle.excerpt}
                onChange={(e) => setEditArticle({ ...editArticle, excerpt: e.target.value })}
                placeholder="글의 요약을 입력하세요 (2-3줄)"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="edit-external_url" className="text-sm font-medium text-grey-900">
                블로그 URL *
              </Label>
              <Input
                id="edit-external_url"
                value={editArticle.external_url}
                onChange={(e) => setEditArticle({ ...editArticle, external_url: e.target.value })}
                placeholder="https://blog.naver.com/..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-thumbnail_url" className="text-sm font-medium text-grey-900">
                썸네일 URL (선택)
              </Label>
              <Input
                id="edit-thumbnail_url"
                value={editArticle.thumbnail_url}
                onChange={(e) =>
                  setEditArticle({ ...editArticle, thumbnail_url: e.target.value })
                }
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-category" className="text-sm font-medium text-grey-900">
                카테고리 *
              </Label>
              <Select
                value={editArticle.category}
                onValueChange={(value) =>
                  setEditArticle({ ...editArticle, category: value as any })
                }
              >
                <SelectTrigger id="edit-category" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guide">가이드</SelectItem>
                  <SelectItem value="tips">노하우</SelectItem>
                  <SelectItem value="market">트렌드</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleUpdateArticle} className="flex-1">
                저장
              </Button>
              <Button onClick={handleCloseEditModal} variant="outline" className="flex-1">
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
