'use client'

import { useState } from 'react'
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
import { ExternalLink, Plus, Edit, Trash2 } from 'lucide-react'
import { getAllBlogArticles } from '@/lib/dummy-data'
import type { Article } from '@/lib/types'

// TODO: 실제 데이터로 교체 (Supabase API 연동)
const categoryLabels = {
  guide: '가이드',
  tips: '노하우',
  market: '트렌드',
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(getAllBlogArticles())
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'guide' | 'tips' | 'market'>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  // 추가 폼 상태
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    thumbnailUrl: '',
    externalUrl: '',
    category: 'guide' as 'guide' | 'tips' | 'market',
  })

  // 수정 폼 상태
  const [editArticle, setEditArticle] = useState({
    title: '',
    excerpt: '',
    thumbnailUrl: '',
    externalUrl: '',
    category: 'guide' as 'guide' | 'tips' | 'market',
  })

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((article) => article.category === selectedCategory)

  const handleOpenAddModal = () => {
    setNewArticle({
      title: '',
      excerpt: '',
      thumbnailUrl: '',
      externalUrl: '',
      category: 'guide',
    })
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleAddArticle = () => {
    // TODO: Supabase API 호출하여 저장
    console.log('Add Article:', newArticle)

    // 임시로 목록에 추가
    const article: Article = {
      id: `blog-article-${Date.now()}`,
      title: newArticle.title,
      slug: newArticle.title.toLowerCase().replace(/\s+/g, '-'),
      category: newArticle.category,
      excerpt: newArticle.excerpt,
      thumbnail: {
        url: newArticle.thumbnailUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        alt: newArticle.title,
      },
      author: {
        name: 'SHAREZONE',
      },
      viewCount: 0,
      isFeatured: false,
      isImported: true,
      blogPlatform: 'naver',
      externalUrl: newArticle.externalUrl,
      importedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setArticles([article, ...articles])
    handleCloseAddModal()
  }

  const handleOpenEditModal = (article: Article) => {
    setSelectedArticle(article)
    setEditArticle({
      title: article.title,
      excerpt: article.excerpt,
      thumbnailUrl: article.thumbnail.url,
      externalUrl: article.externalUrl || '',
      category: article.category,
    })
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedArticle(null)
  }

  const handleUpdateArticle = () => {
    if (!selectedArticle) return

    // TODO: Supabase API 호출하여 업데이트
    console.log('Update Article:', { id: selectedArticle.id, ...editArticle })

    // 임시로 목록 업데이트
    setArticles(
      articles.map((a) =>
        a.id === selectedArticle.id
          ? {
              ...a,
              title: editArticle.title,
              excerpt: editArticle.excerpt,
              thumbnail: {
                ...a.thumbnail,
                url: editArticle.thumbnailUrl,
              },
              externalUrl: editArticle.externalUrl,
              category: editArticle.category,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    )

    handleCloseEditModal()
  }

  const handleDeleteArticle = (id: string) => {
    if (!confirm('이 콘텐츠를 삭제하시겠습니까?')) return

    // TODO: Supabase API 호출하여 삭제
    console.log('Delete Article:', id)

    // 임시로 목록에서 제거
    setArticles(articles.filter((a) => a.id !== id))
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
                    src={article.thumbnail.url}
                    alt={article.thumbnail.alt}
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
                      <span>{new Date(article.publishedAt).toLocaleDateString('ko-KR')}</span>
                      <span>조회 {article.viewCount}회</span>
                      {article.externalUrl && (
                        <a
                          href={article.externalUrl}
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
              <Label htmlFor="externalUrl" className="text-sm font-medium text-grey-900">
                블로그 URL *
              </Label>
              <Input
                id="externalUrl"
                value={newArticle.externalUrl}
                onChange={(e) => setNewArticle({ ...newArticle, externalUrl: e.target.value })}
                placeholder="https://blog.naver.com/..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="thumbnailUrl" className="text-sm font-medium text-grey-900">
                썸네일 URL (선택)
              </Label>
              <Input
                id="thumbnailUrl"
                value={newArticle.thumbnailUrl}
                onChange={(e) => setNewArticle({ ...newArticle, thumbnailUrl: e.target.value })}
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
              <Label htmlFor="edit-externalUrl" className="text-sm font-medium text-grey-900">
                블로그 URL *
              </Label>
              <Input
                id="edit-externalUrl"
                value={editArticle.externalUrl}
                onChange={(e) => setEditArticle({ ...editArticle, externalUrl: e.target.value })}
                placeholder="https://blog.naver.com/..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-thumbnailUrl" className="text-sm font-medium text-grey-900">
                썸네일 URL (선택)
              </Label>
              <Input
                id="edit-thumbnailUrl"
                value={editArticle.thumbnailUrl}
                onChange={(e) =>
                  setEditArticle({ ...editArticle, thumbnailUrl: e.target.value })
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
