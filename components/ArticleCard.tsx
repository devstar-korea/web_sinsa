'use client'

import Image from 'next/image'
import { Eye } from 'lucide-react'
import { ArticleCard as ArticleCardType } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ArticleCardProps {
  article: ArticleCardType
}

const categoryLabels = {
  guide: '가이드',
  tips: '팁',
  market: '시장분석',
}

const categoryColors = {
  guide: 'bg-primary-100 text-primary-700',
  tips: 'bg-success-light text-success-dark',
  market: 'bg-warning-light text-warning-dark',
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const handleCardClick = () => {
    if (article.externalUrl) {
      window.open(article.externalUrl, '_blank')
    }
  }

  return (
    <div onClick={handleCardClick} className="group cursor-pointer">
      <Card className="overflow-hidden border-slate-200 hover:border-primary-300 transition-all hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative h-48 bg-slate-100 overflow-hidden">
          <Image
            src={article.thumbnail?.url || "/images/article-placeholder.svg"}
            alt={article.thumbnail?.alt || article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant="secondary"
              className={`rounded-full ${categoryColors[article.category]}`}
            >
              {categoryLabels[article.category]}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-slate-600 mb-4 line-clamp-3">{article.excerpt}</p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              {article.author?.avatar && (
                <img
                  src={article.author.avatar!}
                  alt={article.author?.name || "작성자"}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span>{article.author?.name || "작성자"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {(article.viewCount || 0).toLocaleString()}
              </span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
