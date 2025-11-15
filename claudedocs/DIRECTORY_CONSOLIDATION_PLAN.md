# 디렉토리 통합 계획 (Directory Consolidation Plan)

**작성일**: 2025-11-15
**목적**: 중복 디렉토리 정리 및 프로젝트 구조 최적화
**프로젝트**: SHAREZONE (web_sinsa) + cursor-dev-environment

---

## 🔍 현재 상황 분석

### 발견된 중복 디렉토리

프로젝트 루트에 **2개의 `web_sinsa` 디렉토리**가 존재:

```
/c/Users/jy121/.cursor/cursor.project/
├── web_sinsa/                              # ✅ 메인 프로젝트 (실제 코드)
│   ├── .git/                               # Git: devstar-korea/web_sinsa.git
│   ├── app/ (70+ TypeScript 파일)
│   ├── components/
│   ├── lib/
│   ├── package.json (Next.js 16, React 19)
│   └── ... (전체 SHAREZONE 프로젝트)
│
└── cursor-dev-environment/
    ├── .git/                               # Git: devstar-korea/cursor-dev-environment.git
    ├── app/
    ├── components/
    ├── lib/
    ├── package.json (다른 프로젝트)
    └── web_sinsa/                          # ⚠️ 빈 디렉토리 (2개 파일만)
        ├── .
        └── ..
```

### Git 저장소 정보

| 디렉토리 | Git Remote | 상태 | 용도 |
|---------|-----------|------|------|
| `/web_sinsa` | `devstar-korea/web_sinsa.git` | ✅ 활성 | SHAREZONE 메인 프로젝트 |
| `/cursor-dev-environment` | `devstar-korea/cursor-dev-environment.git` | ✅ 활성 | 개발 환경 설정 프로젝트 |
| `/cursor-dev-environment/web_sinsa` | (부모 저장소에 포함) | ⚠️ 거의 빈 폴더 | 용도 불명 |

### 크기 비교

```bash
# 실제 프로젝트 (메인)
/web_sinsa                              # 수백 MB (node_modules 포함)
├── 70+ TypeScript 파일
├── node_modules/ (대용량)
├── .next/ (빌드 결과)
└── package.json, etc.

# 빈 디렉토리 (서브)
/cursor-dev-environment/web_sinsa       # 거의 0 KB
└── (빈 폴더)
```

---

## 🎯 문제점 및 리스크

### 현재 문제점

1. **혼란 유발** 🔴
   - 어느 디렉토리에서 작업해야 하는지 불명확
   - 파일 수정 시 잘못된 디렉토리 선택 가능
   - 경로 혼동으로 인한 작업 오류

2. **디스크 공간 낭비** 🟡
   - cursor-dev-environment는 별도의 대형 프로젝트
   - 중복된 node_modules, .next 폴더 가능성

3. **Git 관리 복잡성** 🟡
   - 2개의 독립적인 Git 저장소
   - 커밋/푸시 시 저장소 혼동 가능

4. **개발 환경 일관성** 🟢
   - 빈 web_sinsa 폴더의 용도 불명확
   - cursor-dev-environment와의 관계 불명확

### 잠재적 리스크

- ❌ **잘못된 디렉토리에서 코드 수정**
- ❌ **Git 커밋을 잘못된 저장소에 푸시**
- ❌ **경로 참조 오류로 빌드 실패**
- ❌ **IDE 인덱싱 중복으로 성능 저하**

---

## 📋 통합 계획 (Consolidation Strategy)

### 전략: 빈 디렉토리 제거 + 독립 프로젝트 유지

**목표**: 혼란 제거, 명확한 프로젝트 분리

#### 선택 1: 빈 디렉토리 제거 (권장) ✅

**개요**:
- `/web_sinsa` → **메인 프로젝트로 유지** (변경 없음)
- `/cursor-dev-environment/web_sinsa` → **제거**
- `/cursor-dev-environment` → 독립 프로젝트로 유지

**장점**:
- ✅ 가장 간단하고 안전
- ✅ 기존 작업 영향 없음
- ✅ 명확한 프로젝트 분리
- ✅ Git 저장소 독립성 유지

**단점**:
- ⚠️ cursor-dev-environment에서 web_sinsa 참조 시 경로 수정 필요 (있다면)

#### 선택 2: cursor-dev-environment 내 서브모듈화 (고급)

**개요**:
- `/cursor-dev-environment/web_sinsa` → Git Submodule로 전환
- `/web_sinsa` → Submodule 원본

**장점**:
- ✅ cursor-dev-environment와 연동 유지
- ✅ 버전 관리 동기화

**단점**:
- ❌ 복잡한 Git 관리
- ❌ Submodule 학습 곡선
- ❌ 불필요한 복잡성 추가

---

## 🚀 실행 계획 (Phase 0: Directory Cleanup)

### Phase 0.1: 사전 조사 및 백업 (30분)

#### Step 0.1.1: cursor-dev-environment 프로젝트 분석
**시간**: 15분

```bash
# cursor-dev-environment 프로젝트 상태 확인
cd /c/Users/jy121/.cursor/cursor.project/cursor-dev-environment

# web_sinsa 참조 검색
grep -r "web_sinsa" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next

# 설정 파일 확인
cat package.json | grep -i web_sinsa
cat next.config.ts | grep -i web_sinsa
cat tsconfig.json | grep -i web_sinsa

# README 확인
cat README.md | grep -i web_sinsa
cat CLAUDE.md | grep -i web_sinsa 2>/dev/null
```

**검증**:
- [ ] cursor-dev-environment가 web_sinsa 폴더를 참조하는지 확인
- [ ] 참조가 있다면 용도 파악
- [ ] 참조가 없다면 안전하게 제거 가능

#### Step 0.1.2: 백업 생성
**시간**: 10분

```bash
# 현재 상태 백업 (안전장치)
cd /c/Users/jy121/.cursor/cursor.project

# cursor-dev-environment 전체 백업 (선택)
# zip -r cursor-dev-environment-backup-$(date +%Y%m%d).zip cursor-dev-environment/

# 또는 Git으로 현재 상태 커밋
cd cursor-dev-environment
git add .
git commit -m "chore: backup before web_sinsa directory cleanup"
```

**검증**:
- [ ] 백업 파일 생성 확인
- [ ] 또는 Git 커밋 확인

#### Step 0.1.3: web_sinsa 프로젝트 상태 확인
**시간**: 5분

```bash
# 메인 web_sinsa 프로젝트 상태 확인
cd /c/Users/jy121/.cursor/cursor.project/web_sinsa

# Git 상태 확인
git status
git log --oneline -5

# 미커밋 변경사항 확인
git diff
```

**검증**:
- [ ] web_sinsa 프로젝트 정상 상태
- [ ] 중요한 미커밋 변경사항 있는지 확인

---

### Phase 0.2: 빈 디렉토리 제거 (15분)

#### Step 0.2.1: cursor-dev-environment/web_sinsa 제거
**시간**: 5분

**방법 A: Git을 통한 제거** (권장)

```bash
cd /c/Users/jy121/.cursor/cursor.project/cursor-dev-environment

# web_sinsa 디렉토리가 Git에 추적되는지 확인
git status web_sinsa/

# 추적되는 경우
git rm -r web_sinsa/
git commit -m "chore: remove empty web_sinsa directory

- Remove unused web_sinsa subdirectory
- Main web_sinsa project remains at /web_sinsa

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 추적되지 않는 경우
rm -rf web_sinsa/
```

**방법 B: 수동 제거** (Git 미추적 시)

```bash
# 단순 삭제
cd /c/Users/jy121/.cursor/cursor.project/cursor-dev-environment
rm -rf web_sinsa/
```

**검증**:
- [ ] web_sinsa 디렉토리 삭제 확인
- [ ] `ls -la` 출력에 web_sinsa 없음
- [ ] Git 상태 정상

#### Step 0.2.2: .gitignore 업데이트 (선택)
**시간**: 5분

혹시 향후 web_sinsa 폴더가 다시 생성되는 것을 방지하려면:

```bash
cd /c/Users/jy121/.cursor/cursor.project/cursor-dev-environment

# .gitignore에 추가
echo "web_sinsa/" >> .gitignore

# 커밋
git add .gitignore
git commit -m "chore: add web_sinsa to gitignore"
```

**검증**:
- [ ] .gitignore에 web_sinsa/ 추가됨
- [ ] Git 커밋 성공

#### Step 0.2.3: 문서 업데이트
**시간**: 5분

cursor-dev-environment 프로젝트 문서에 변경 사항 반영:

```bash
# README.md 업데이트 (필요 시)
# - web_sinsa 참조 제거
# - 프로젝트 구조 도표 수정
```

**업데이트 대상 문서**:
- [ ] README.md
- [ ] CLAUDE.md
- [ ] PROJECT_CONTEXT.md
- [ ] FOLDER_STRUCTURE.md

---

### Phase 0.3: 검증 및 문서화 (15분)

#### Step 0.3.1: 통합 검증
**시간**: 10분

```bash
# 1. 디렉토리 구조 확인
cd /c/Users/jy121/.cursor/cursor.project
find . -maxdepth 2 -name "web_sinsa" -type d
# 결과: ./web_sinsa (1개만 나와야 함)

# 2. web_sinsa 프로젝트 정상 작동 확인
cd web_sinsa
npm run dev
# 개발 서버 정상 실행 확인

# 3. cursor-dev-environment 프로젝트 정상 작동 확인
cd ../cursor-dev-environment
npm run dev
# 개발 서버 정상 실행 확인 (web_sinsa 없어도 정상)
```

**검증 체크리스트**:
- [ ] `find` 결과 web_sinsa 디렉토리 1개만 존재
- [ ] web_sinsa 프로젝트 개발 서버 정상 실행
- [ ] cursor-dev-environment 프로젝트 정상 작동
- [ ] 양쪽 프로젝트 빌드 성공

#### Step 0.3.2: 문서화
**시간**: 5분

**생성할 문서**:
1. **DIRECTORY_CONSOLIDATION_PLAN.md** ✅ (이 문서)
2. **cursor-dev-environment/CHANGELOG.md** (업데이트)

```markdown
# CHANGELOG.md (cursor-dev-environment)

## [2025-11-15] Directory Cleanup

### Removed
- `web_sinsa/` - Removed empty subdirectory
  - Main web_sinsa project remains at `/web_sinsa`
  - No functionality impact

### Changed
- Updated .gitignore to prevent future web_sinsa directory creation
```

**검증**:
- [ ] DIRECTORY_CONSOLIDATION_PLAN.md 작성 완료
- [ ] CHANGELOG.md 업데이트 완료

---

## ✅ 성공 기준

### Phase 0.1: 사전 조사 및 백업
- [ ] cursor-dev-environment의 web_sinsa 참조 여부 확인
- [ ] 백업 생성 또는 Git 커밋 완료
- [ ] 메인 web_sinsa 프로젝트 정상 상태 확인

### Phase 0.2: 빈 디렉토리 제거
- [ ] cursor-dev-environment/web_sinsa 디렉토리 삭제
- [ ] .gitignore 업데이트 (선택)
- [ ] 관련 문서 업데이트

### Phase 0.3: 검증 및 문서화
- [ ] `find` 명령어로 web_sinsa 1개만 존재 확인
- [ ] 양쪽 프로젝트 개발 서버 정상 작동
- [ ] 문서화 완료

---

## 🎯 최종 프로젝트 구조

### 정리 후 (목표)

```
/c/Users/jy121/.cursor/cursor.project/
│
├── web_sinsa/                              # ✅ SHAREZONE 메인 프로젝트
│   ├── .git/ (devstar-korea/web_sinsa.git)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   ├── MODERNIZATION_PLAN.md              # 최신화 계획
│   └── ... (전체 프로젝트 파일)
│
└── cursor-dev-environment/                 # ✅ 개발 환경 프로젝트
    ├── .git/ (devstar-korea/cursor-dev-environment.git)
    ├── app/
    ├── components/
    ├── lib/
    ├── package.json
    ├── CLAUDE.md
    └── ... (독립 프로젝트)
    # web_sinsa/ 디렉토리 제거됨 ✅
```

### 프로젝트 관계

```
┌─────────────────────────────────────────────────────────┐
│  /cursor-dev-environment                                │
│  - 개발 환경 설정 프로젝트                              │
│  - Git: devstar-korea/cursor-dev-environment.git        │
│  - 독립적으로 운영                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  /web_sinsa                                             │
│  - SHAREZONE 메인 프로젝트                              │
│  - Git: devstar-korea/web_sinsa.git                     │
│  - 독립적으로 운영                                      │
└─────────────────────────────────────────────────────────┘

       ↑                              ↑
       └──────────────────────────────┘
              독립적인 2개 프로젝트
          (상호 참조 또는 의존성 없음)
```

---

## ⚠️ 주의사항

### 실행 전 확인사항

1. **백업 필수**
   - cursor-dev-environment Git 커밋 또는 백업 파일 생성
   - web_sinsa 프로젝트 현재 상태 확인

2. **참조 확인 필수**
   - cursor-dev-environment가 web_sinsa 폴더 참조하는지 확인
   - 참조가 있다면 제거 전 대체 방안 마련

3. **실행 중인 프로세스 종료**
   - 개발 서버 중지
   - IDE 종료 (파일 잠금 방지)

### 롤백 계획

문제 발생 시:

```bash
# 방법 1: Git 롤백 (Git으로 제거한 경우)
cd /c/Users/jy121/.cursor/cursor.project/cursor-dev-environment
git reset --hard HEAD~1

# 방법 2: 백업 복원 (수동 삭제한 경우)
# - 백업 파일에서 web_sinsa 폴더 복원
```

---

## 📅 실행 타임라인

### 전체 소요 시간: **1시간**

| Phase | 작업 | 시간 | 누적 |
|-------|------|------|------|
| 0.1.1 | cursor-dev-environment 분석 | 15분 | 15분 |
| 0.1.2 | 백업 생성 | 10분 | 25분 |
| 0.1.3 | web_sinsa 상태 확인 | 5분 | 30분 |
| 0.2.1 | web_sinsa 디렉토리 제거 | 5분 | 35분 |
| 0.2.2 | .gitignore 업데이트 | 5분 | 40분 |
| 0.2.3 | 문서 업데이트 | 5분 | 45분 |
| 0.3.1 | 통합 검증 | 10분 | 55분 |
| 0.3.2 | 문서화 | 5분 | 60분 |

---

## 🔗 통합 순서 (전체 최신화 계획과의 관계)

### 전체 실행 순서 (권장)

```
Phase 0: Directory Cleanup (이 문서)          ← 🎯 지금 여기
    ↓
Phase 1: Critical Updates (MODERNIZATION_PLAN.md)
    ↓
Phase 2: Tailwind v4 Migration (MODERNIZATION_PLAN.md)
    ↓
Phase 3: Ecosystem Optimization (MODERNIZATION_PLAN.md)
```

**이유**:
- Phase 0를 먼저 실행하면 프로젝트 구조가 명확해짐
- 이후 최신화 작업 시 혼란 방지
- Git 커밋 히스토리 정리

---

## 📝 다음 단계

### 즉시 실행 가능

```bash
# Phase 0.1.1 시작
cd /c/Users/jy121/.cursor/cursor.project/cursor-dev-environment
grep -r "web_sinsa" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next
```

### 사용자 확인 필요

- [ ] cursor-dev-environment에서 web_sinsa 참조가 발견되었는가?
  - **YES** → 참조 용도 파악 후 대체 방안 수립
  - **NO** → 안전하게 제거 진행

- [ ] 빈 디렉토리 제거를 진행할 것인가?
  - **YES** → Phase 0.2 실행
  - **NO** → 현재 구조 유지 (혼란 지속)

---

## 📚 참고 자료

### 관련 문서
- [MODERNIZATION_PLAN.md](./MODERNIZATION_PLAN.md) - 전체 최신화 계획
- [cursor-dev-environment/CLAUDE.md](../cursor-dev-environment/CLAUDE.md) - 개발 환경 가이드
- [web_sinsa/README.md](../README.md) - SHAREZONE 프로젝트 개요

### Git 관련
- [Git: 디렉토리 제거](https://git-scm.com/docs/git-rm)
- [Git: .gitignore](https://git-scm.com/docs/gitignore)
- [Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) (고급)

---

**최종 업데이트**: 2025-11-15
**다음 리뷰**: Phase 0 실행 후
**담당자**: 개발팀
**우선순위**: 🟡 Medium (혼란 방지용)

---

## 🎯 요약

### 핵심 포인트
1. **2개의 web_sinsa 디렉토리 발견**: 메인 프로젝트 + 빈 서브디렉토리
2. **독립적인 Git 저장소**: 2개의 프로젝트가 우연히 같은 이름 사용
3. **권장 조치**: 빈 서브디렉토리 제거 (안전하고 간단)
4. **소요 시간**: 1시간 (조사 + 제거 + 검증)
5. **리스크**: 🟢 Low (빈 폴더이므로 안전)

### 즉시 확인 필요
```bash
# cursor-dev-environment가 web_sinsa 참조하는지 확인
cd /c/Users/jy121/.cursor/cursor.project/cursor-dev-environment
grep -r "web_sinsa" . --exclude-dir=node_modules --exclude-dir=.git
```

**결과**:
- **출력 없음** → 안전하게 제거 가능 ✅
- **출력 있음** → 참조 용도 파악 후 진행 ⚠️
