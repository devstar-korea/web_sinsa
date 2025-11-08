# Supabase 설정 가이드

## 1. Storage 버킷 생성

Supabase Dashboard에서 Storage 섹션으로 이동하여 다음 3개의 버킷을 생성합니다.

### 1.1 listing-images 버킷

**목적**: 매물 이미지 저장

1. Supabase Dashboard → Storage → "New bucket" 클릭
2. 버킷 설정:
   - Name: `listing-images`
   - Public bucket: ✅ (체크)
   - File size limit: 5 MB
   - Allowed MIME types: `image/png, image/jpeg, image/jpg, image/webp`

3. RLS (Row Level Security) 정책 설정:

```sql
-- 모든 사용자가 이미지를 볼 수 있도록 허용
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'listing-images' );

-- 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload listing images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images'
  AND auth.role() = 'authenticated'
);

-- 인증된 사용자만 삭제 가능
CREATE POLICY "Authenticated users can delete listing images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'listing-images'
  AND auth.role() = 'authenticated'
);
```

### 1.2 article-images 버킷

**목적**: 아티클 썸네일 이미지 저장

1. Supabase Dashboard → Storage → "New bucket" 클릭
2. 버킷 설정:
   - Name: `article-images`
   - Public bucket: ✅ (체크)
   - File size limit: 2 MB
   - Allowed MIME types: `image/png, image/jpeg, image/jpg, image/webp`

3. RLS 정책:

```sql
-- 모든 사용자가 이미지를 볼 수 있도록 허용
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'article-images' );

-- 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'article-images'
  AND auth.role() = 'authenticated'
);

-- 인증된 사용자만 삭제 가능
CREATE POLICY "Authenticated users can delete article images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'article-images'
  AND auth.role() = 'authenticated'
);
```

### 1.3 avatars 버킷

**목적**: 사용자 프로필 이미지 저장

1. Supabase Dashboard → Storage → "New bucket" 클릭
2. 버킷 설정:
   - Name: `avatars`
   - Public bucket: ✅ (체크)
   - File size limit: 1 MB
   - Allowed MIME types: `image/png, image/jpeg, image/jpg, image/webp`

3. RLS 정책:

```sql
-- 모든 사용자가 아바타를 볼 수 있도록 허용
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 인증된 사용자만 자신의 아바타 업로드 가능
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 인증된 사용자만 자신의 아바타 삭제 가능
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

## 2. 환경 변수 설정

프로젝트 루트의 `.env.local` 파일에 Supabase 자격 증명을 추가합니다:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 자격 증명 찾기:

1. Supabase Dashboard → Project Settings → API
2. **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`에 복사
3. **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 복사
4. **service_role**: `SUPABASE_SERVICE_ROLE_KEY`에 복사

⚠️ **중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

## 3. Storage URL 형식

업로드된 파일의 공개 URL 형식:

```
https://[project-id].supabase.co/storage/v1/object/public/[bucket-name]/[file-path]
```

예시:
```
https://abc123.supabase.co/storage/v1/object/public/listing-images/uuid-123/image1.jpg
https://abc123.supabase.co/storage/v1/object/public/article-images/uuid-456/thumbnail.jpg
https://abc123.supabase.co/storage/v1/object/public/avatars/user-uuid/avatar.jpg
```

## 4. 폴더 구조

### listing-images
```
listing-images/
├── [listing-uuid]/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── image3.jpg
```

### article-images
```
article-images/
├── [article-uuid]/
│   └── thumbnail.jpg
```

### avatars
```
avatars/
├── [user-uuid]/
│   └── avatar.jpg
```

## 5. 버킷 생성 확인

모든 버킷이 생성되었는지 확인:

```sql
SELECT
  name,
  public,
  created_at
FROM storage.buckets
WHERE name IN ('listing-images', 'article-images', 'avatars');
```

예상 결과:
```
name            | public | created_at
----------------|--------|---------------------------
listing-images  | true   | 2025-11-08 12:00:00+00
article-images  | true   | 2025-11-08 12:01:00+00
avatars         | true   | 2025-11-08 12:02:00+00
```

## 6. 테스트 업로드

버킷이 올바르게 설정되었는지 테스트:

```typescript
import { uploadImage } from '@/lib/api/upload'

// 테스트 이미지 업로드
const testUpload = async (file: File) => {
  const result = await uploadImage(file, 'LISTINGS', 'test-listing-id')

  if (result.error) {
    console.error('업로드 실패:', result.error)
  } else {
    console.log('업로드 성공!')
    console.log('URL:', result.url)
    console.log('Path:', result.path)
  }
}
```

## 7. 문제 해결

### 업로드 실패: "new row violates row-level security policy"

**원인**: RLS 정책이 올바르게 설정되지 않았습니다.

**해결**:
1. Supabase Dashboard → Storage → 해당 버킷 → Policies
2. 위의 RLS 정책 SQL을 다시 실행
3. 정책이 활성화되어 있는지 확인

### 이미지가 표시되지 않음

**원인**: 버킷이 public으로 설정되지 않았습니다.

**해결**:
1. Supabase Dashboard → Storage → 해당 버킷
2. "Make public" 클릭하여 공개 설정

### 파일 크기 초과 오류

**원인**: 업로드하려는 파일이 버킷의 크기 제한을 초과합니다.

**해결**:
1. 이미지 압축 또는 리사이즈
2. 또는 버킷 설정에서 크기 제한 증가

## 8. 다음 단계

Storage 버킷 설정이 완료되면:

1. ✅ 테스트 데이터 삽입 (claudedocs/TEST_DATA.md 참조)
2. ✅ 관리자 페이지에서 이미지 업로드 테스트
3. ✅ 사용자 페이지에서 이미지 표시 확인
