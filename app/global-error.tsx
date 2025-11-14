'use client'

// ============================================
// Global Error Boundary Component
// ============================================
// Purpose: Catch errors in root layout
// Note: This file MUST be a Client Component

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to console
    console.error('Global error boundary caught:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })

    // TODO: Send to error tracking service (e.g., Sentry)
    // trackError(error, { level: 'fatal' })
  }, [error])

  return (
    <html lang="ko">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            padding: '1rem',
          }}
        >
          <div
            style={{
              maxWidth: '28rem',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* Error Message */}
            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem',
              }}
            >
              치명적인 오류가 발생했습니다
            </h1>
            <p
              style={{
                fontSize: '1rem',
                color: '#6b7280',
                marginBottom: '2rem',
                lineHeight: '1.6',
              }}
            >
              애플리케이션을 로드하는 중 문제가 발생했습니다.
              <br />
              페이지를 새로고침하거나 나중에 다시 시도해 주세요.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <summary
                  style={{
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                  }}
                >
                  개발자 정보 보기
                </summary>
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'monospace',
                      color: '#dc2626',
                      wordBreak: 'break-all',
                    }}
                  >
                    {error.message}
                  </p>
                  {error.digest && (
                    <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                      <span style={{ fontWeight: '600' }}>Digest:</span> {error.digest}
                    </p>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#0064FF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = '#0050cc')
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = '#0064FF')
                }
              >
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb')
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor = 'white')
                }
              >
                홈으로 이동
              </button>
            </div>

            {/* Support Information */}
            <div style={{ marginTop: '2rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                문제가 계속되면{' '}
                <a
                  href="mailto:support@sharezone.com"
                  style={{
                    color: '#0064FF',
                    textDecoration: 'none',
                  }}
                  onMouseOver={(e) =>
                    ((e.target as HTMLAnchorElement).style.textDecoration = 'underline')
                  }
                  onMouseOut={(e) =>
                    ((e.target as HTMLAnchorElement).style.textDecoration = 'none')
                  }
                >
                  고객지원
                </a>
                으로 문의해 주세요.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
