'use client'

// ============================================
// Error Boundary Component
// ============================================
// Purpose: Catch and handle React errors gracefully
// Supports: React 19 error handling patterns

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console (production: send to error tracking service)
    console.error('Error boundary caught:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })

    // TODO: Send to error tracking service (e.g., Sentry)
    // trackError(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-50 px-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-error-light rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-error-dark" />
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-8">
          <h1 className="text-main-lg text-grey-900 mb-3">문제가 발생했습니다</h1>
          <p className="text-body text-grey-600 mb-4">
            일시적인 오류로 페이지를 표시할 수 없습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-body text-grey-500 hover:text-grey-700">
                개발자 정보 보기
              </summary>
              <div className="mt-2 p-4 bg-grey-100 rounded-lg text-sm">
                <p className="font-mono text-error-dark break-all">{error.message}</p>
                {error.digest && (
                  <p className="mt-2 text-grey-600">
                    <span className="font-semibold">Digest:</span> {error.digest}
                  </p>
                )}
              </div>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={reset}
            className="flex-1 bg-tossBlue text-white hover:bg-primary-600"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="flex-1 border-grey-300 text-grey-700 hover:bg-grey-50"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            홈으로 이동
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center">
          <p className="text-body text-grey-500">
            문제가 계속되면{' '}
            <a
              href="mailto:support@sharezone.com"
              className="text-tossBlue hover:underline"
            >
              고객지원
            </a>
            으로 문의해 주세요.
          </p>
        </div>
      </div>
    </div>
  )
}
