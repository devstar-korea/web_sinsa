# Claude Code 세션 가이드

다음 세션 시작 시 아래 파일들을 확인하세요:

## 📄 필수 확인 파일

### 1. **[PROGRESS.md](../PROGRESS.md)** ⭐ 가장 중요!
- 현재까지 완료된 모든 작업
- 다음 단계 옵션 (A, B, C)
- 기술 스택 및 프로젝트 구조
- 중요 결정 사항
- 알려진 이슈

### 2. **[README.md](../README.md)**
- 프로젝트 개요
- 설치 및 실행 방법
- 디자인 시스템 요약

### 3. **커밋 히스토리**
```bash
git log --oneline -5
```

## 🚀 빠른 시작

### 세션 시작 시 실행할 명령어
```bash
# 1. 진행 상황 확인
cat PROGRESS.md

# 2. 개발 서버 실행 (아직 안 돌아가고 있다면)
npm run dev

# 3. Git 상태 확인
git status
git log --oneline -5
```

## 📋 현재 상태 (2025-11-06 기준)

**완료**:
- ✅ 홈페이지
- ✅ 매물 목록 페이지
- ✅ 매물 상세 페이지

**다음 작업**:
- Option A: 정보 콘텐츠 페이지 (추천)
- Option B: 상담 신청 폼
- Option C: Vercel 배포

**라이브 서버**: https://bookish-space-yodel-jjg6pqx6j6g7h5gxg-3000.app.github.dev

## 💡 유용한 명령어

```bash
# PROGRESS 파일 열기
cat PROGRESS.md
code PROGRESS.md

# 프로젝트 구조 확인
tree -L 2 -I 'node_modules|.next'

# 전체 타입 정의 확인
cat lib/types.ts

# 더미 데이터 확인
cat lib/dummy-data.ts

# 최근 변경사항
git diff HEAD~1
```

---

**작성일**: 2025-11-06
