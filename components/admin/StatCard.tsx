import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-grey-600">{title}</p>
            <p className="text-3xl font-bold text-grey-900 mt-2">{value}</p>
            {change && (
              <p
                className={cn(
                  'text-sm mt-2 flex items-center gap-1',
                  trend === 'up' && 'text-green-600',
                  trend === 'down' && 'text-red-600',
                  trend === 'neutral' && 'text-grey-600'
                )}
              >
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {change}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
