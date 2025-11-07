'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface SellInquiryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SellInquiryModal({ isOpen, onClose }: SellInquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    area: '',
    message: '',
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 실제 제출 로직 구현
    console.log('Form submitted:', formData)
    alert('매각 상담 신청이 접수되었습니다. 곧 연락드리겠습니다.')
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-grey-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-main-lg font-bold text-grey-900">매각 상담</h2>
            <p className="text-body text-grey-600 mt-1">공유오피스 전문가와 상담하세요</p>
          </div>
          <button
            onClick={onClose}
            className="text-grey-400 hover:text-grey-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* 신청인 성함 */}
            <div>
              <Input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="신청인 성함을 입력해주세요"
                className="h-12 text-body"
              />
            </div>

            {/* 연락처 */}
            <div>
              <Input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="연락처를 입력해주세요"
                className="h-12 text-body"
              />
            </div>

            {/* 매각할 사업장 위치 */}
            <div>
              <Input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="매각할 사업장 위치를 입력해주세요"
                className="h-12 text-body"
              />
            </div>

            {/* 실면적 */}
            <div>
              <Input
                type="text"
                name="area"
                required
                value={formData.area}
                onChange={handleChange}
                placeholder="실면적을 입력해주세요 (예: 100㎡)"
                className="h-12 text-body"
              />
            </div>

            {/* 상담 신청 */}
            <div>
              <Textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="상담 신청 내용을 입력해주세요"
                className="text-body resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1 h-12 text-body font-bold"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-body font-bold"
            >
              상담 신청하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
