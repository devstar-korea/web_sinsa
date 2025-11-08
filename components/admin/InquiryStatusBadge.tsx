import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type InquiryStatus = 'pending' | 'contacted' | 'qualified' | 'converted' | 'rejected'

interface InquiryStatusBadgeProps {
  status: InquiryStatus
  className?: string
}

const statusConfig = {
  pending: {
    label: '대기',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  contacted: {
    label: '연락완료',
    className: 'bg-success/10 text-success border-success/20',
  },
  qualified: {
    label: '검증완료',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  converted: {
    label: '전환',
    className: 'bg-success/10 text-success border-success/20',
  },
  rejected: {
    label: '거부',
    className: 'bg-red-50 text-red-600 border-red-200',
  },
}

export default function InquiryStatusBadge({ status, className }: InquiryStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge
      variant="outline"
      className={cn(config.className, 'font-medium', className)}
    >
      {config.label}
    </Badge>
  )
}
