'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Eye } from 'lucide-react'
import { getAllBlogArticles } from '@/lib/dummy-data'

// TODO: 실제 데이터로 교체 (Supabase API 연동)
const categoryLabels = {
  guide: '가이드',
  tips: '노하우',
  market: '트렌드',
}

const BLOG_URL = 'https://blog.naver.com/sharezone_'

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'guide' | 'tips' | 'market'>('all')
  const articles = getAllBlogArticles()

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((article) => article.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-grey-900 mb-4">
              비즈니스 인사이트
            </h1>
            <p className="text-xl text-grey-600">
              공유오피스 창업·운영·매각 노하우를 확인하세요
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Filter + Blog Link */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                >
                  전체
                </Button>
                <Button
                  variant={selectedCategory === 'guide' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('guide')}
                >
                  가이드
                </Button>
                <Button
                  variant={selectedCategory === 'tips' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('tips')}
                >
                  노하우
                </Button>
                <Button
                  variant={selectedCategory === 'market' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('market')}
                >
                  트렌드
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => window.open(BLOG_URL, '_blank')}
                className="gap-2"
              >
                블로그 바로가기
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="hover:border-primary transition-all duration-300 hover:shadow-lg cursor-pointer group"
                >
                  <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className="relative w-full h-48 bg-grey-100 overflow-hidden">
                      <img
                        src={article.thumbnail.url}
                        alt={article.thumbnail.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-grey-900 border-0">
                          {categoryLabels[article.category]}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-main font-bold text-grey-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-grey-600 line-clamp-3">{article.excerpt}</p>

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-3 text-xs text-grey-500">
                          <span>{new Date(article.publishedAt).toLocaleDateString('ko-KR')}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.viewCount}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:text-primary/80 gap-1 p-0 h-auto"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (article.externalUrl) {
                              window.open(article.externalUrl, '_blank')
                            }
                          }}
                        >
                          자세히 보기
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-grey-500 text-lg">해당 카테고리의 콘텐츠가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-grey-50 py-16 mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-grey-900 mb-4">
              더 많은 콘텐츠를 보고 싶으신가요?
            </h2>
            <p className="text-grey-600 mb-6">
              SHAREZONE 블로그에서 더 다양한 정보를 확인하세요
            </p>
            <Button
              size="lg"
              onClick={() => window.open(BLOG_URL, '_blank')}
              className="gap-2"
            >
              블로그 방문하기
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
