import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Toss Brand Colors
        primary: {
          50: '#e6f0ff',
          100: '#b3d7ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8dff',
          500: '#0064FF', // Toss Blue
          600: '#0050cc',
          700: '#003d99',
          800: '#002966',
          900: '#001633',
        },
        tossBlue: '#0064FF',
        // Grey Scale for backgrounds and text
        grey: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        error: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        // 본문: 18pt
        'body': ['18px', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        // 서브: Medium 크기
        'sub': ['20px', { lineHeight: '1.5', letterSpacing: '-0.01em', fontWeight: '500' }],
        // 메인: Bold 크기
        'main': ['24px', { lineHeight: '1.4', letterSpacing: '-0.02em', fontWeight: '700' }],
        'main-lg': ['32px', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '700' }],
        'main-xl': ['40px', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '700' }],
      },
      maxWidth: {
        '7xl': '1280px',
      },
    },
  },
  plugins: [],
}

export default config
