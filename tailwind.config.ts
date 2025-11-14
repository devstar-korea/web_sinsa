import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					'50': '#e6f0ff',
					'100': '#b3d7ff',
					'200': '#80bfff',
					'300': '#4da6ff',
					'400': '#1a8dff',
					'500': '#0064FF',
					'600': '#0050cc',
					'700': '#003d99',
					'800': '#002966',
					'900': '#001633',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				tossBlue: '#0064FF',
				grey: {
					'50': '#f9fafb',
					'100': '#f3f4f6',
					'200': '#e5e7eb',
					'300': '#d1d5db',
					'400': '#9ca3af',
					'500': '#6b7280',
					'600': '#4b5563',
					'700': '#374151',
					'800': '#1f2937',
					'900': '#111827'
				},
				success: {
					light: '#d1fae5',
					DEFAULT: '#10b981',
					dark: '#059669'
				},
				warning: {
					light: '#fef3c7',
					DEFAULT: '#f59e0b',
					dark: '#d97706'
				},
				error: {
					light: '#fee2e2',
					DEFAULT: '#ef4444',
					dark: '#dc2626'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				sans: [
					'Pretendard Variable',
					'Pretendard',
					'-apple-system',
					'BlinkMacSystemFont',
					'system-ui',
					'sans-serif'
				]
			},
			fontSize: {
				// ===== 기존 크기 상향 조정 (전략 B) =====
				body: [
					'24px',
					{
						lineHeight: '1.6',
						letterSpacing: '-0.01em'
					}
				],
				sub: [
					'28px',
					{
						lineHeight: '1.5',
						letterSpacing: '-0.01em',
						fontWeight: '500'
					}
				],
				main: [
					'32px',
					{
						lineHeight: '1.4',
						letterSpacing: '-0.02em',
						fontWeight: '700'
					}
				],
				'main-lg': [
					'40px',
					{
						lineHeight: '1.3',
						letterSpacing: '-0.02em',
						fontWeight: '700'
					}
				],
				'main-xl': [
					'48px',
					{
						lineHeight: '1.2',
						letterSpacing: '-0.03em',
						fontWeight: '700'
					}
				],

				// ===== 21st.dev Display Typography =====
				'display-md': [
					'56px',
					{
						lineHeight: '1.2',
						letterSpacing: '-0.02em',
						fontWeight: '700'
					}
				],
				'display-lg': [
					'64px',
					{
						lineHeight: '1.1',
						letterSpacing: '-0.02em',
						fontWeight: '700'
					}
				],
				'display-xl': [
					'72px',
					{
						lineHeight: '1.1',
						letterSpacing: '-0.02em',
						fontWeight: '700'
					}
				],

				// ===== 특수 케이스 (레이아웃 깨짐 방지) =====
				'body-sm': [
					'20px',
					{
						lineHeight: '1.6',
						letterSpacing: '-0.01em'
					}
				],
				caption: [
					'18px',
					{
						lineHeight: '1.5',
						letterSpacing: '0em'
					}
				],
				badge: [
					'16px',
					{
						lineHeight: '1.4',
						letterSpacing: '0em',
						fontWeight: '500'
					}
				]
			},
			spacing: {
				18: '4.5rem',
				88: '22rem',
				128: '32rem',
			},
			maxWidth: {
				'7xl': '1280px',
				'8xl': '88rem',
				'9xl': '96rem',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'fade-out': 'fadeOut 0.5s ease-in-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.5s ease-out',
				'slide-left': 'slideLeft 0.5s ease-out',
				'slide-right': 'slideRight 0.5s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'spin-slow': 'spin 3s linear infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideLeft: {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				slideRight: {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
}

export default config
