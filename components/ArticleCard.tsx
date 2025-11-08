'use client'

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
          <img
            src={article.thumbnail.url}
            alt={article.thumbnail.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
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
              {article.author.avatar && (
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {article.viewCount.toLocaleString()}
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
