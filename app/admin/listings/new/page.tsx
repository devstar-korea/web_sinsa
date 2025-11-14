'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'

// 폼 스키마
const listingFormSchema = z.object({
  // 기본정보
  title: z.string().min(5, '제목은 최소 5자 이상이어야 합니다'),
  province: z.string().min(1, '지역을 선택해주세요'),
  locationKey: z.string().optional(),
  squareMeter: z.number().min(1, '면적을 입력해주세요'),
  totalRooms: z.number().min(1, '룸 개수를 입력해주세요'),
  openedAt: z.string().min(1, '오픈일을 선택해주세요'),

  // 주차 정보
  parkingFreeSpaces: z.string().optional(),      // 무료주차 대수
  parkingMonthlyMethod: z.string().optional(),   // 입주사 월주차 방식
  parkingMonthlyFee: z.string().optional(),      // 입주사 월주차 요금

  // 매매 정보
  priceAmount: z.number().min(0, '가격을 입력해주세요'),
  isNegotiable: z.boolean(),
  premiumAmount: z.number().min(0, '권리금을 입력해주세요'),
  depositAmount: z.number().min(0, '보증금을 입력해주세요'),
  monthlyProfit: z.number().min(0, '월수익을 입력해주세요'),

  // 이미지
  thumbnailUrl: z.string().url('올바른 URL을 입력해주세요').optional(),

  // 설명
  shortDescription: z.string().min(10, '간단 설명은 최소 10자 이상이어야 합니다'),
  description: z.string().optional(),

  // 상태
  status: z.enum(['active', 'pending', 'hidden', 'sold']),
  isPremium: z.boolean(),
})

type ListingFormValues = z.infer<typeof listingFormSchema>

export default function NewListingPage() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<any[]>([])

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: '',
      province: '',
      locationKey: '',
      squareMeter: 0,
      totalRooms: 0,
      openedAt: new Date().toISOString().split('T')[0],
      parkingFreeSpaces: '',
      parkingMonthlyMethod: '',
      parkingMonthlyFee: '',
      priceAmount: 0,
      isNegotiable: false,
      premiumAmount: 0,
      depositAmount: 0,
      monthlyProfit: 0,
      thumbnailUrl: '',
      shortDescription: '',
      description: '',
      status: 'pending',
      isPremium: false,
    },
  })

  const onSubmit = async (data: ListingFormValues) => {
    setIsSubmitting(true)

    try {
      // TODO: Supabase에 데이터 저장
      console.log('Form data:', data)

      // 평수 계산
      const pyeong = Math.round((data.squareMeter / 3.3058) * 10) / 10

      // 총 투자비용 계산
      const totalInvestment = data.premiumAmount + data.depositAmount

      // 가격 표시 텍스트
      const priceDisplayText = data.isNegotiable
        ? `${(data.priceAmount / 10000).toFixed(0)}억원 (협의가능)`
        : `${(data.priceAmount / 10000).toFixed(0)}억원`

      // slug 생성 (간단한 예시)
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      const listingData = {
        title: data.title,
        slug,
        location: {
          province: data.province,
          locationKey: data.locationKey,
        },
        price: {
          amount: data.priceAmount,
          displayText: priceDisplayText,
          isNegotiable: data.isNegotiable,
        },
        premiumAmount: data.premiumAmount,
        totalInvestment,
        monthlyProfit: data.monthlyProfit,
        area: {
          squareMeter: data.squareMeter,
          pyeong,
        },
        totalRooms: data.totalRooms,
        parkingInfo: data.parkingFreeSpaces || data.parkingMonthlyMethod || data.parkingMonthlyFee ? {
          freeSpaces: data.parkingFreeSpaces || '',
          monthlyMethod: data.parkingMonthlyMethod || '',
          monthlyFee: data.parkingMonthlyFee || '',
        } : undefined,
        thumbnail: {
          url: data.thumbnailUrl || '/images/placeholder.jpg',
          alt: data.title,
        },
        shortDescription: data.shortDescription,
        description: data.description,
        status: data.status,
        operatingStatus: 'operating' as const,  // 운영중만 등록 가능
        openedAt: data.openedAt,
        viewCount: 0,
        isPremium: data.isPremium,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log('Listing data to save:', listingData)

      // API 호출 성공 후
      alert('매물이 등록되었습니다')
      router.push('/admin/listings')
    } catch (error) {
      console.error('Error saving listing:', error)
      alert('매물 등록 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  const provinces = [
    '서울',
    '경기',
    '인천',
    '부산',
    '대구',
    '대전',
    '광주',
    '울산',
    '세종',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/listings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </Link>
          <div>
            <h1 className="text-main-xl font-bold text-grey-900">매물 등록</h1>
            <p className="text-body-sm text-grey-600 mt-1">
              새로운 공유오피스 매물을 등록합니다
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">기본정보</TabsTrigger>
              <TabsTrigger value="finance">매매 정보</TabsTrigger>
              <TabsTrigger value="images">이미지</TabsTrigger>
              <TabsTrigger value="description">설명</TabsTrigger>
            </TabsList>

            {/* 기본정보 탭 */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>기본정보</CardTitle>
                  <CardDescription>
                    매물의 기본 정보를 입력해주세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 제목 */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>매물 제목 *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: 강남 프리미엄 공유오피스"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 지역 */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>지역 *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="지역 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem key={province} value={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>상세 지역</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="예: 강남구 역삼동"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            구/동 단위로 입력해주세요
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 공간 정보 */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="squareMeter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>면적 (㎡) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            평수: {((field.value || 0) / 3.3058).toFixed(1)}평
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalRooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>룸 개수 *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 오픈일 */}
                  <FormField
                    control={form.control}
                    name="openedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>오픈일 *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          운영중인 매장만 등록 가능합니다
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 주차 정보 */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-grey-900">주차 정보</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="parkingFreeSpaces"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>무료주차 대수</FormLabel>
                            <FormControl>
                              <Input placeholder="예: 2대" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parkingMonthlyMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>입주사 월주차 방식</FormLabel>
                            <FormControl>
                              <Input placeholder="예: 선착순 배정" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parkingMonthlyFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>입주사 월주차 요금</FormLabel>
                            <FormControl>
                              <Input placeholder="예: 월 10만원" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => setCurrentTab('finance')}
                    >
                      다음: 매매 정보
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 매매 정보 탭 */}
            <TabsContent value="finance">
              <Card>
                <CardHeader>
                  <CardTitle>매매 정보</CardTitle>
                  <CardDescription>
                    매물의 재정 정보를 입력해주세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 가격 */}
                  <FormField
                    control={form.control}
                    name="priceAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>매매가 (원) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value > 0
                            ? `${(field.value / 10000).toFixed(0)}억원`
                            : ''}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isNegotiable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>협의가능</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* 권리금 및 보증금 */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="premiumAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>권리금 (원) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value > 0
                              ? `${(field.value / 10000).toFixed(0)}억원`
                              : ''}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="depositAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>보증금 (원) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value > 0
                              ? `${(field.value / 10000).toFixed(0)}억원`
                              : ''}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 총 투자비용 표시 */}
                  <div className="p-4 bg-grey-50 rounded-lg">
                    <p className="text-sm text-grey-600">총 투자비용</p>
                    <p className="text-main-lg font-bold text-grey-900 mt-1">
                      {(
                        (form.watch('premiumAmount') +
                          form.watch('depositAmount')) /
                        10000
                      ).toFixed(0)}
                      억원
                    </p>
                  </div>

                  {/* 월수익 */}
                  <FormField
                    control={form.control}
                    name="monthlyProfit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>월수익 (원) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value > 0
                            ? `${(field.value / 10000).toFixed(0)}만원`
                            : ''}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab('basic')}
                    >
                      이전
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentTab('images')}
                    >
                      다음: 이미지
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 이미지 탭 */}
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>이미지</CardTitle>
                  <CardDescription>
                    매물 이미지를 업로드해주세요 (최대 8장)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUploader
                    maxImages={8}
                    onImagesChange={setImages}
                    initialImages={images}
                  />

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 <strong>이미지 관리 가이드</strong>
                    </p>
                    <ul className="text-sm text-blue-600 mt-2 space-y-1 list-disc list-inside">
                      <li>첫 번째 이미지가 자동으로 대표 이미지로 설정됩니다</li>
                      <li>이미지를 드래그하여 순서를 변경할 수 있습니다</li>
                      <li>별 아이콘을 클릭하여 대표 이미지를 변경할 수 있습니다</li>
                      <li>최대 8장까지 업로드 가능합니다</li>
                    </ul>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab('finance')}
                    >
                      이전
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentTab('description')}
                    >
                      다음: 설명
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 설명 탭 */}
            <TabsContent value="description">
              <Card>
                <CardHeader>
                  <CardTitle>설명</CardTitle>
                  <CardDescription>
                    매물의 상세 설명을 작성해주세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 간단 설명 */}
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>간단 설명 *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="매물을 한 문장으로 설명해주세요"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/200자
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 상세 설명 */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상세 설명</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="매물의 특징, 장점, 주변 환경 등을 자세히 작성해주세요"
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 상태 및 옵션 */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>공개 상태 *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">판매중</SelectItem>
                              <SelectItem value="pending">대기</SelectItem>
                              <SelectItem value="hidden">숨김</SelectItem>
                              <SelectItem value="sold">거래완료</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isPremium"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>프리미엄 매물로 표시</FormLabel>
                          <FormDescription>
                            홈페이지에서 상단에 노출됩니다
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab('images')}
                    >
                      이전
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="outline"
                        disabled={isSubmitting}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        미리보기
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? '저장 중...' : '매물 등록'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
