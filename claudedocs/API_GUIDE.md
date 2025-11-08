# ShareZone API 가이드

## 개요

이 문서는 ShareZone 프로젝트의 Supabase API 헬퍼 함수 사용법을 설명합니다.

## 파일 구조

```
lib/
├── supabase.ts           # Supabase 클라이언트 설정
└── api/
    ├── listings.ts       # 매물 CRUD
    ├── articles.ts       # 아티클 CRUD
    ├── inquiries.ts      # 상담 신청 CRUD
    └── upload.ts         # 이미지 업로드
```

## 1. Supabase 클라이언트 (lib/supabase.ts)

### 기본 클라이언트

```typescript
import { supabase } from '@/lib/supabase'

// 모든 클라이언트 작업에 사용
const { data, error } = await supabase.from('listings').select('*')
```

### 관리자 클라이언트 (서버 사이드 전용)

```typescript
import { createAdminClient } from '@/lib/supabase'

// 서버 컴포넌트나 API 라우트에서만 사용
const adminClient = createAdminClient()
const { data } = await adminClient.from('listings').select('*')
```

## 2. 매물 API (lib/api/listings.ts)

### 매물 조회

```typescript
import {
  getAllListings,
  getAllListingsAdmin,
  getListingById,
  getListingBySlug,
  getListingsByProvince,
} from '@/lib/api/listings'

// 활성 매물만 조회 (사용자용)
const listings = await getAllListings()

// 모든 매물 조회 (관리자용)
const allListings = await getAllListingsAdmin()

// 특정 매물 조회
const listing = await getListingById('uuid')
const listing = await getListingBySlug('gangnam-office-space')

// 지역별 매물 조회
const seoulListings = await getListingsByProvince('서울')
```

### 매물 생성/수정/삭제

```typescript
import {
  createListing,
  updateListing,
  deleteListing,
  permanentDeleteListing,
} from '@/lib/api/listings'

// 매물 생성
const newListing = await createListing({
  title: '강남 공유오피스',
  slug: 'gangnam-office-space',
  province: '서울',
  total_rooms: 20,
  area_square_meter: 100.5,
  area_pyeong: 30.4,
  price_amount: 500000000,
  premium_amount: 50000000,
  total_investment: 550000000,
  monthly_profit: 10000000,
  // ... 기타 필드
})

// 매물 수정
const updated = await updateListing('uuid', {
  price_amount: 480000000,
  status: 'sold',
})

// 소프트 삭제 (복구 가능)
await deleteListing('uuid')

// 영구 삭제 (관리자 전용, 복구 불가)
await permanentDeleteListing('uuid')
```

### 매물 이미지 관리

```typescript
import {
  getListingImages,
  addListingImage,
  deleteListingImage,
  reorderListingImages,
} from '@/lib/api/listings'

// 이미지 조회
const images = await getListingImages('listing-uuid')

// 이미지 추가
await addListingImage({
  listing_id: 'listing-uuid',
  url: 'https://...',
  alt: '사무실 내부',
  display_order: 0,
  is_primary: true,
})

// 이미지 삭제
await deleteListingImage('image-uuid')

// 이미지 순서 변경
await reorderListingImages([
  { id: 'uuid1', display_order: 0 },
  { id: 'uuid2', display_order: 1 },
])
```

### 조회수 증가

```typescript
import { incrementViewCount } from '@/lib/api/listings'

// 매물 상세 페이지에서 호출
await incrementViewCount('listing-uuid')
```

## 3. 아티클 API (lib/api/articles.ts)

### 아티클 조회

```typescript
import {
  getAllArticles,
  getAllArticlesAdmin,
  getArticlesByCategory,
  getFeaturedArticles,
  getArticleById,
  getArticleBySlug,
} from '@/lib/api/articles'

// 공개된 아티클만 조회 (사용자용)
const articles = await getAllArticles()

// 모든 아티클 조회 (관리자용)
const allArticles = await getAllArticlesAdmin()

// 카테고리별 조회
const guides = await getArticlesByCategory('guide')
const tips = await getArticlesByCategory('tips')
const market = await getArticlesByCategory('market')

// Featured 아티클 조회 (최대 6개)
const featured = await getFeaturedArticles()

// 특정 아티클 조회
const article = await getArticleById('uuid')
const article = await getArticleBySlug('article-slug')
```

### 아티클 생성/수정/삭제

```typescript
import { createArticle, updateArticle, deleteArticle } from '@/lib/api/articles'

// 아티클 생성
const newArticle = await createArticle({
  title: '공유오피스 창업 가이드',
  slug: 'startup-guide',
  category: 'guide',
  excerpt: '공유오피스 창업을 위한 완벽 가이드',
  thumbnail_url: 'https://...',
  author_name: '홍길동',
  is_featured: true,
  published_at: new Date().toISOString(),
})

// 아티클 수정
await updateArticle('uuid', {
  title: '수정된 제목',
  is_featured: false,
})

// 아티클 삭제
await deleteArticle('uuid')
```

### 조회수 증가

```typescript
import { incrementArticleViewCount } from '@/lib/api/articles'

// 아티클 상세 페이지에서 호출
await incrementArticleViewCount('article-uuid')
```

### 블로그 동기화

```typescript
import { syncImportedArticles, updateArticleSyncStatus } from '@/lib/api/articles'

// 동기화가 필요한 아티클 조회 (최대 10개)
const articlesToSync = await syncImportedArticles()

// 동기화 후 상태 업데이트
for (const article of articlesToSync) {
  // ... RSS 데이터 가져오기 및 업데이트
  await updateArticleSyncStatus(article.id)
}
```

## 4. 상담 신청 API (lib/api/inquiries.ts)

### 인수 상담 (Purchase Inquiries)

```typescript
import {
  getAllPurchaseInquiries,
  getPurchaseInquiriesByStatus,
  getPurchaseInquiryById,
  createPurchaseInquiry,
  updatePurchaseInquiry,
  deletePurchaseInquiry,
} from '@/lib/api/inquiries'

// 모든 인수 상담 조회 (관리자용)
const inquiries = await getAllPurchaseInquiries()

// 상태별 조회
const pending = await getPurchaseInquiriesByStatus('pending')
const contacted = await getPurchaseInquiriesByStatus('contacted')

// 특정 상담 조회
const inquiry = await getPurchaseInquiryById('uuid')

// 상담 신청 생성 (사용자용)
await createPurchaseInquiry({
  listing_id: 'listing-uuid',
  name: '홍길동',
  phone: '010-1234-5678',
  email: 'hong@example.com',
  purpose: 'investment',
  message: '매물에 관심이 있습니다.',
})

// 상담 상태 업데이트 (관리자용)
await updatePurchaseInquiry('uuid', {
  status: 'contacted',
  assigned_to: 'admin-uuid',
  admin_notes: '전화 상담 완료',
})

// 상담 삭제
await deletePurchaseInquiry('uuid')
```

### 매각 상담 (Register Inquiries)

```typescript
import {
  getAllRegisterInquiries,
  getRegisterInquiriesByStatus,
  getRegisterInquiryById,
  createRegisterInquiry,
  updateRegisterInquiry,
  deleteRegisterInquiry,
} from '@/lib/api/inquiries'

// 사용법은 인수 상담과 동일

// 매각 상담 신청 생성 예시
await createRegisterInquiry({
  name: '김철수',
  phone: '010-9876-5432',
  email: 'kim@example.com',
  location: '서울 강남구',
  area_range: '50-100평',
  price_range: '3-5억',
  message: '매각을 희망합니다.',
})
```

### 통계 및 최근 상담

```typescript
import { getInquiryStats, getRecentInquiries } from '@/lib/api/inquiries'

// 상담 통계 조회
const stats = await getInquiryStats()
// {
//   purchase: 15,
//   register: 8,
//   total: 23
// }

// 최근 상담 조회 (양쪽 통합, 최대 10개)
const recent = await getRecentInquiries(10)
// [
//   { ...inquiry, type: 'purchase' },
//   { ...inquiry, type: 'register' },
// ]
```

## 5. 이미지 업로드 API (lib/api/upload.ts)

### 스토리지 버킷

```typescript
import { STORAGE_BUCKETS } from '@/lib/api/upload'

// 사용 가능한 버킷
STORAGE_BUCKETS.LISTINGS // 'listing-images'
STORAGE_BUCKETS.ARTICLES // 'article-images'
STORAGE_BUCKETS.AVATARS // 'avatars'
```

### 단일 파일 업로드

```typescript
import { uploadImage } from '@/lib/api/upload'

// 매물 이미지 업로드
const result = await uploadImage(file, 'LISTINGS', 'listing-uuid')

if (result.error) {
  console.error('업로드 실패:', result.error)
} else {
  console.log('업로드 성공:', result.url)
  console.log('파일 경로:', result.path)
}
```

### 다중 파일 업로드

```typescript
import { uploadMultipleImages } from '@/lib/api/upload'

// 최대 8개 파일 업로드
const results = await uploadMultipleImages(files, 'LISTINGS', 'listing-uuid', 8)

results.forEach((result, index) => {
  if (result.error) {
    console.error(`파일 ${index} 업로드 실패:`, result.error)
  } else {
    console.log(`파일 ${index} 업로드 성공:`, result.url)
  }
})
```

### 매물 이미지 전용 함수

```typescript
import {
  uploadListingImages,
  deleteListingImage,
  deleteAllListingImages,
} from '@/lib/api/upload'

// 매물 이미지 업로드 (최대 8개)
const results = await uploadListingImages(files, 'listing-uuid')

// 특정 이미지 삭제
await deleteListingImage('path/to/image.jpg')

// 매물의 모든 이미지 삭제
await deleteAllListingImages('listing-uuid')
```

### 아티클 이미지 전용 함수

```typescript
import { uploadArticleThumbnail, deleteArticleThumbnail } from '@/lib/api/upload'

// 썸네일 업로드
const result = await uploadArticleThumbnail(file, 'article-uuid')

// 썸네일 삭제
await deleteArticleThumbnail('path/to/thumbnail.jpg')
```

### 유틸리티 함수

```typescript
import {
  extractPathFromUrl,
  createPreviewUrl,
  revokePreviewUrl,
} from '@/lib/api/upload'

// URL에서 Storage 경로 추출
const path = extractPathFromUrl(
  'https://...supabase.co/storage/v1/object/public/listing-images/uuid/image.jpg',
  'LISTINGS'
)
// 'uuid/image.jpg'

// 업로드 전 미리보기 URL 생성
const previewUrl = createPreviewUrl(file)

// 메모리 관리를 위해 미리보기 URL 해제
revokePreviewUrl(previewUrl)
```

## 사용 예시

### 관리자 대시보드에서 매물 목록 표시

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getAllListingsAdmin } from '@/lib/api/listings'

export default function AdminListingsPage() {
  const [listings, setListings] = useState([])

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await getAllListingsAdmin()
        setListings(data)
      } catch (error) {
        console.error('매물 조회 실패:', error)
      }
    }

    fetchListings()
  }, [])

  return (
    <div>
      {listings.map((listing) => (
        <div key={listing.id}>{listing.title}</div>
      ))}
    </div>
  )
}
```

### 사용자 상담 신청 폼

```typescript
'use client'

import { useState } from 'react'
import { createPurchaseInquiry } from '@/lib/api/inquiries'

export default function InquiryForm({ listingId }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    purpose: 'investment',
    message: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await createPurchaseInquiry({
        ...formData,
        listing_id: listingId,
      })
      alert('상담 신청이 완료되었습니다!')
    } catch (error) {
      console.error('상담 신청 실패:', error)
      alert('상담 신청에 실패했습니다.')
    }
  }

  return <form onSubmit={handleSubmit}>{/* 폼 필드 */}</form>
}
```

### 이미지 업로드 및 매물 생성

```typescript
'use client'

import { useState } from 'react'
import { createListing } from '@/lib/api/listings'
import { uploadListingImages } from '@/lib/api/upload'
import { addListingImage } from '@/lib/api/listings'

export default function CreateListingForm() {
  const [files, setFiles] = useState([])

  const handleSubmit = async (formData) => {
    try {
      // 1. 매물 생성
      const listing = await createListing(formData)

      // 2. 이미지 업로드
      const uploadResults = await uploadListingImages(files, listing.id)

      // 3. 이미지 정보를 DB에 저장
      for (let i = 0; i < uploadResults.length; i++) {
        const result = uploadResults[i]
        if (!result.error) {
          await addListingImage({
            listing_id: listing.id,
            url: result.url,
            display_order: i,
            is_primary: i === 0,
          })
        }
      }

      alert('매물 등록 완료!')
    } catch (error) {
      console.error('매물 등록 실패:', error)
    }
  }

  return <form onSubmit={handleSubmit}>{/* 폼 필드 */}</form>
}
```

## 에러 처리

모든 API 함수는 에러 발생 시 예외를 던집니다. try-catch로 처리하세요:

```typescript
try {
  const listing = await getListingById('invalid-id')
} catch (error) {
  console.error('에러 발생:', error)
  // 사용자에게 에러 메시지 표시
}
```

## 타입 정의

모든 API 함수는 TypeScript 타입을 제공합니다:

```typescript
import type { Listing, ListingImage } from '@/lib/types'
import type { PurchaseInquiry, RegisterInquiry } from '@/lib/api/inquiries'
import type { UploadResult } from '@/lib/api/upload'
```

## 다음 단계

1. **Supabase Storage 버킷 생성**: Supabase Dashboard에서 `listing-images`, `article-images`, `avatars` 버킷 생성
2. **관리자 페이지 연동**: 더미 데이터 대신 실제 Supabase 데이터 사용
3. **테스트 데이터 삽입**: 몇 개의 샘플 매물/아티클 추가
4. **이미지 업로드 UI**: 드래그 앤 드롭 이미지 업로드 컴포넌트 구현
