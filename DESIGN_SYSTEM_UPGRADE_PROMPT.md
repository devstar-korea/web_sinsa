# 공유오피스 웹사이트 디자인 시스템 고도화 프롬프트

## 🎯 목표
SHAREZONE 공유오피스 웹사이트의 디자인 시스템을 프로덕션 수준으로 고도화합니다. **기존 텍스트, 문구, 기능은 절대 수정하지 않고**, 오직 시각적 디자인 요소만 개선합니다.

---

## 📋 핵심 제약사항

### ⛔ 절대 금지사항
1. **텍스트 내용 수정 금지**: 모든 한글/영문 문구, 버튼 텍스트, 설명문 등 일체의 내용 변경 불가
2. **기능 수정 금지**: 기존 기능, 라우팅, 비즈니스 로직 등 변경 불가
3. **구조 변경 최소화**: 컴포넌트 계층 구조, 파일 구조는 최대한 유지

### ✅ 허용되는 작업
- 색상, 타이포그래피, 간격, 그림자, 테두리 등 시각적 디자인 요소만 수정
- CSS/Tailwind 클래스 변경
- 디자인 토큰 및 테마 설정 개선

---

## 🎨 디자인 시스템 고도화 요구사항

### 1. 타이포그래피 시스템 강화

#### 1.1 한글 폰트 시스템
```css
/* 주 폰트: Pretendard (현재 사용 중, 유지) */
font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'system-ui', sans-serif;

/* 보조 폰트 (선택적 추가 가능):
   - Spoqa Han Sans Neo (네이버, 카카오 등 사용)
   - SUIT (토스 등 사용)
   현재 Pretendard가 적용되어 있으므로 유지하되, 필요시 fallback 추가 */
```

#### 1.2 최소 텍스트 크기 18pt 준수
**중요**: 모든 텍스트는 최소 18px(약 13.5pt) 이상이어야 하며, 가독성을 위해 18pt(24px) 이상을 권장합니다.

```typescript
// tailwind.config.ts의 fontSize 설정 강화
fontSize: {
  // 최소 크기 - 18px 이상
  'xs': ['18px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],     // 기존 xs 제거, 18px로 상향
  'sm': ['20px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],     // 작은 텍스트
  'base': ['22px', { lineHeight: '1.6', letterSpacing: '-0.01em' }],   // 기본 텍스트
  'body': ['24px', { lineHeight: '1.6', letterSpacing: '-0.01em' }],   // 본문 (18pt = 24px)

  // 중간 크기
  'sub': ['26px', { lineHeight: '1.5', letterSpacing: '-0.01em', fontWeight: '600' }],
  'lg': ['28px', { lineHeight: '1.5', letterSpacing: '-0.015em' }],
  'xl': ['32px', { lineHeight: '1.4', letterSpacing: '-0.015em' }],

  // 헤딩 크기
  'main': ['36px', { lineHeight: '1.4', letterSpacing: '-0.02em', fontWeight: '700' }],
  'main-lg': ['42px', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '700' }],
  'main-xl': ['52px', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '700' }],
  '2xl': ['56px', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
  '3xl': ['64px', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
  '4xl': ['72px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
}
```

#### 1.3 타이포그래피 적용 규칙
- **본문**: `text-body` (24px) 사용
- **작은 본문**: `text-sm` (20px) 최소 사용
- **서브 헤딩**: `text-sub` (26px)
- **메인 헤딩**: `text-main` (36px) ~ `text-main-xl` (52px)
- **영웅 섹션 헤딩**: `text-3xl` (64px) ~ `text-4xl` (72px)

### 2. 반응형 타이포그래피

모든 텍스트 크기에 반응형 적용:

```typescript
// 예시: 반응형 타이포그래피 클래스 사용
className="text-xl md:text-2xl lg:text-3xl"  // 모바일→태블릿→데스크톱

// 모바일 기준 최소 크기 유지
className="text-body md:text-lg lg:text-xl"  // 모든 기기에서 18px 이상
```

### 3. 색상 시스템 고도화

#### 3.1 Primary 색상 (Toss Blue 유지)
```typescript
primary: {
  '50': '#e6f0ff',   // 매우 밝은 파란색 (배경용)
  '100': '#b3d7ff',  // 밝은 파란색
  '200': '#80bfff',
  '300': '#4da6ff',
  '400': '#1a8dff',
  '500': '#0064FF',  // Toss Blue (메인)
  '600': '#0050cc',  // 호버 상태
  '700': '#003d99',  // 어두운 상태
  '800': '#002966',
  '900': '#001633',  // 매우 어두운 상태
}
```

#### 3.2 그레이 스케일 세밀화
```typescript
grey: {
  '25': '#fcfcfd',   // 추가: 매우 밝은 배경
  '50': '#f9fafb',
  '100': '#f3f4f6',
  '150': '#ebedef',  // 추가: 카드 배경
  '200': '#e5e7eb',
  '300': '#d1d5db',
  '400': '#9ca3af',
  '500': '#6b7280',
  '600': '#4b5563',
  '700': '#374151',
  '800': '#1f2937',
  '900': '#111827',
  '950': '#09090b',  // 추가: 최대 대비
}
```

#### 3.3 시맨틱 컬러 확장
```typescript
// 성공 (현재 유지 + 보완)
success: {
  '50': '#ecfdf5',
  '100': '#d1fae5',
  '500': '#10b981',
  '600': '#059669',
  '700': '#047857',
}

// 경고 (현재 유지 + 보완)
warning: {
  '50': '#fffbeb',
  '100': '#fef3c7',
  '500': '#f59e0b',
  '600': '#d97706',
  '700': '#b45309',
}

// 오류 (현재 유지 + 보완)
error: {
  '50': '#fef2f2',
  '100': '#fee2e2',
  '500': '#ef4444',
  '600': '#dc2626',
  '700': '#b91c1c',
}

// 정보 (추가)
info: {
  '50': '#f0f9ff',
  '100': '#e0f2fe',
  '500': '#0ea5e9',
  '600': '#0284c7',
  '700': '#0369a1',
}
```

### 4. 간격 시스템 (Spacing Scale)

```typescript
spacing: {
  'px': '1px',
  '0': '0',
  '0.5': '0.125rem',  // 2px
  '1': '0.25rem',     // 4px
  '1.5': '0.375rem',  // 6px
  '2': '0.5rem',      // 8px
  '2.5': '0.625rem',  // 10px
  '3': '0.75rem',     // 12px
  '3.5': '0.875rem',  // 14px
  '4': '1rem',        // 16px
  '5': '1.25rem',     // 20px
  '6': '1.5rem',      // 24px
  '7': '1.75rem',     // 28px
  '8': '2rem',        // 32px
  '9': '2.25rem',     // 36px
  '10': '2.5rem',     // 40px
  '11': '2.75rem',    // 44px
  '12': '3rem',       // 48px
  '14': '3.5rem',     // 56px
  '16': '4rem',       // 64px
  '20': '5rem',       // 80px
  '24': '6rem',       // 96px
  '28': '7rem',       // 112px
  '32': '8rem',       // 128px
  '36': '9rem',       // 144px
  '40': '10rem',      // 160px
  '44': '11rem',      // 176px
  '48': '12rem',      // 192px
  '52': '13rem',      // 208px
  '56': '14rem',      // 224px
  '60': '15rem',      // 240px
  '64': '16rem',      // 256px
  '72': '18rem',      // 288px
  '80': '20rem',      // 320px
  '96': '24rem',      // 384px
}
```

### 5. 그림자 시스템 (Elevation)

프로덕션 수준의 그림자 정의:

```typescript
boxShadow: {
  'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  'md': '0 6px 12px -2px rgba(0, 0, 0, 0.12), 0 3px 6px -3px rgba(0, 0, 0, 0.08)',
  'lg': '0 10px 20px -3px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.08)',
  'xl': '0 20px 30px -5px rgba(0, 0, 0, 0.12), 0 8px 12px -6px rgba(0, 0, 0, 0.08)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',

  // 컬러별 그림자 (선택적)
  'primary': '0 4px 14px 0 rgba(0, 100, 255, 0.25)',
  'primary-lg': '0 8px 24px 0 rgba(0, 100, 255, 0.3)',
}
```

### 6. Border Radius 시스템

```typescript
borderRadius: {
  'none': '0',
  'sm': '0.25rem',    // 4px - 작은 요소
  'DEFAULT': '0.375rem', // 6px - 기본
  'md': '0.5rem',     // 8px - 카드, 버튼
  'lg': '0.75rem',    // 12px - 큰 카드
  'xl': '1rem',       // 16px - 모달, 큰 컨테이너
  '2xl': '1.5rem',    // 24px - 영웅 섹션
  '3xl': '2rem',      // 32px - 특별한 요소
  'full': '9999px',   // 완전한 원형
}
```

### 7. 모바일 최적화

#### 7.1 반응형 브레이크포인트
```typescript
screens: {
  'xs': '375px',   // 추가: 작은 모바일
  'sm': '640px',   // 모바일
  'md': '768px',   // 태블릿
  'lg': '1024px',  // 작은 데스크톱
  'xl': '1280px',  // 데스크톱
  '2xl': '1536px', // 큰 데스크톱
}
```

#### 7.2 모바일 터치 영역 최소 크기
- 모든 클릭 가능한 요소는 최소 44×44px 확보
- 버튼 높이: 최소 `h-11` (44px) ~ `h-14` (56px)
- 입력 필드: 최소 `h-12` (48px) ~ `h-14` (56px)

#### 7.3 모바일 여백 시스템
```typescript
// 모바일 기본 패딩
className="px-4 md:px-6 lg:px-8"  // 좌우 여백
className="py-8 md:py-12 lg:py-16" // 상하 여백

// 컨테이너 최대 너비
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

### 8. 애니메이션 및 트랜지션

#### 8.1 Transition Duration
```typescript
transitionDuration: {
  '75': '75ms',
  '100': '100ms',
  '150': '150ms',
  '200': '200ms',
  '250': '250ms',   // 추가
  '300': '300ms',
  '400': '400ms',   // 추가
  '500': '500ms',
  '700': '700ms',
  '1000': '1000ms',
}
```

#### 8.2 애니메이션 이징
```typescript
transitionTimingFunction: {
  'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
}
```

#### 8.3 공통 트랜지션 클래스
```typescript
// hover, focus 등에 적용
className="transition-all duration-200 ease-smooth"
className="transition-colors duration-150"
className="transition-transform duration-250"
```

### 9. 컴포넌트별 디자인 가이드

#### 9.1 버튼 (Button)
```typescript
// 기본 버튼
<Button className="h-12 px-6 text-body font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200">

// 큰 버튼 (주요 CTA)
<Button size="lg" className="h-14 px-8 text-lg font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200">

// 모바일: 전체 너비 버튼
<Button className="w-full md:w-auto h-14 px-8 text-lg">
```

#### 9.2 카드 (Card)
```typescript
<Card className="p-6 rounded-xl border border-grey-200 bg-white shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-250">

// 큰 카드
<Card className="p-8 md:p-10 rounded-2xl shadow-md hover:shadow-lg">
```

#### 9.3 입력 필드 (Input, Textarea)
```typescript
<Input className="h-12 px-4 text-body rounded-lg border-grey-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all">

// 큰 입력 필드
<Input className="h-14 px-5 text-lg rounded-xl">
```

#### 9.4 모달 (Dialog)
```typescript
<DialogContent className="max-w-lg p-8 rounded-2xl shadow-2xl">
  <DialogTitle className="text-main-lg font-bold mb-6">
  <DialogDescription className="text-body text-grey-600">
```

### 10. 섹션별 패딩/마진 표준

```typescript
// Hero Section
className="py-16 md:py-24 lg:py-32"

// Content Section
className="py-12 md:py-16 lg:py-20"

// 작은 Section
className="py-8 md:py-12 lg:py-14"

// 섹션 간 구분선
<div className="border-t border-grey-200 my-12 md:my-16 lg:my-20" />
```

### 11. 접근성 (Accessibility) 강화

```typescript
// 포커스 링
focus:ring-2 focus:ring-primary-500 focus:ring-offset-2

// 다크모드 대비 (선택적)
dark:bg-grey-900 dark:text-grey-100

// ARIA 레이블 필수
aria-label="메뉴 열기"
aria-labelledby="dialog-title"
```

---

## 🎯 적용 우선순위

### Phase 1: 기본 타이포그래피 (필수)
1. `tailwind.config.ts` - fontSize 시스템 업데이트 (최소 18px)
2. `globals.css` - 기본 body 폰트 크기 24px 적용
3. 모든 컴포넌트의 텍스트 크기 검토 및 조정

### Phase 2: 색상 및 간격 시스템
4. 색상 팔레트 확장 (grey 25, 150, 950 추가)
5. 시맨틱 컬러 확장 (info 추가)
6. 간격 시스템 세밀화

### Phase 3: 시각적 고도화
7. 그림자 시스템 적용
8. Border Radius 통일
9. 애니메이션 및 트랜지션 개선

### Phase 4: 반응형 최적화
10. 모바일 여백 조정
11. 터치 영역 최적화
12. 반응형 타이포그래피 적용

---

## ✅ 검증 체크리스트

완료 후 다음 사항을 반드시 확인:

- [ ] 모든 텍스트가 최소 18px(권장 24px) 이상인가?
- [ ] 모바일에서 모든 텍스트가 읽기 쉬운가?
- [ ] 터치 가능한 요소가 최소 44×44px인가?
- [ ] 색상 대비가 WCAG AA 기준을 충족하는가?
- [ ] 모든 페이지가 모바일/태블릿/데스크톱에서 정상 작동하는가?
- [ ] 기존 텍스트 내용이 전혀 변경되지 않았는가?
- [ ] 기존 기능이 정상 작동하는가?
- [ ] 호버/포커스 상태가 명확히 표시되는가?
- [ ] 로딩 상태 및 에러 상태가 적절히 표시되는가?
- [ ] 다크모드(선택적)가 적용된 경우 정상 작동하는가?

---

## 📝 작업 예시

### Before (기존)
```tsx
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  매각 상담
</button>
```

### After (디자인 시스템 적용)
```tsx
<Button className="h-14 px-8 text-lg font-semibold rounded-xl bg-primary-500 text-white shadow-md hover:shadow-lg hover:bg-primary-600 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  매각 상담
</Button>
```

---

## 🚀 실행 지침

이 프롬프트를 LLM에 제공할 때:

```
위 "공유오피스 웹사이트 디자인 시스템 고도화 프롬프트"를 참고하여,
현재 /home/user/web_sinsa 프로젝트의 디자인 시스템을 고도화해주세요.

반드시 지켜야 할 사항:
1. 기존 텍스트, 문구, 내용은 절대 변경하지 마세요
2. 기존 기능과 라우팅은 그대로 유지하세요
3. 오직 시각적 디자인 요소(색상, 타이포그래피, 간격, 그림자 등)만 개선하세요
4. 모든 텍스트는 최소 18px, 권장 24px 이상으로 설정하세요
5. 모바일 최적화와 반응형 디자인을 적용하세요

작업 순서:
1. tailwind.config.ts 업데이트
2. globals.css 업데이트
3. 주요 컴포넌트 (Button, Card, Input 등) 디자인 개선
4. 페이지 컴포넌트 디자인 적용
5. 반응형 확인 및 조정

작업을 시작하기 전에 변경 계획을 먼저 설명해주세요.
```

---

## 📚 참고 자료

### 한국 기업 디자인 시스템 참고
- **토스**: Toss Blue (#0064FF), SUIT 폰트
- **카카오**: Kakao Yellow, Spoqa Han Sans Neo
- **네이버**: Naver Green, Spoqa Han Sans Neo
- **우아한형제들**: Baemin, Baemin Jua
- **라인**: Line Green, Line Seed

### 타이포그래피 가이드
- 최소 본문 크기: 18px (모바일), 20-24px (데스크톱)
- 줄 간격: 1.5-1.7 (본문), 1.2-1.4 (제목)
- 자간: -0.01em ~ -0.03em (한글 최적화)

### 접근성 기준
- WCAG 2.1 Level AA 준수
- 색상 대비비: 최소 4.5:1 (본문), 3:1 (큰 텍스트)
- 터치 영역: 최소 44×44px

---

**버전**: 1.0
**최종 수정일**: 2025-11-14
**적용 대상**: SHAREZONE (공유오피스 M&A 플랫폼)
