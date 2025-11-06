# 공유오피스 거래 플랫폼

공유오피스 운영자들이 사업장을 안전하고 효율적으로 매각할 수 있는 전문 거래 플랫폼

> **📌 중요**: [**PROGRESS.md**](./PROGRESS.md) 파일에서 현재까지 완료된 작업과 다음 단계를 확인하세요!

## 🚀 프로젝트 상태

**현재**: MVP 프로토타입 개발 중 (홈페이지, 매물 목록/상세 완료)

## 📋 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Deployment**: Vercel (예정)

## 🛠️ 개발 환경 설정

### 필수 요구사항

- Node.js 18.17 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인하실 수 있습니다.

## 📁 프로젝트 구조

```
web_sinsa/
├── app/                # Next.js App Router
│   ├── layout.tsx      # 루트 레이아웃
│   ├── page.tsx        # 홈페이지
│   └── globals.css     # 전역 스타일
├── components/         # React 컴포넌트
├── lib/                # 유틸리티 함수
├── public/             # 정적 파일
└── tailwind.config.ts  # Tailwind 설정
```

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: Blue (#2563eb)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### 타이포그래피

- **Font**: Pretendard Variable
- **Base Size**: 16px
- **Line Height**: 1.5

### 반응형 브레이크포인트

- **Mobile**: 0 ~ 767px
- **Tablet**: 768px ~ 1023px
- **Desktop**: 1024px+

## 📝 개발 문서

- [PRD (제품 요구사항)](./docs/PRD.md) - 예정
- [IA (정보 구조)](./docs/IA.md) - 예정
- [User Flow](./docs/USER_FLOW.md) - 예정
- [API 명세서](./docs/API.md) - 예정
- [DB 스키마](./docs/DB_SCHEMA.md) - 예정

## 🚀 배포

### Vercel 배포 (자동)

main 브랜치에 push하면 자동으로 배포됩니다.

```bash
git push origin main
```

### 수동 배포

```bash
npm run build
vercel --prod
```

## 📄 라이선스

ISC

## 👥 기여자

- 개발자: [Your Name]

---

**Last Updated**: 2025-11-06
