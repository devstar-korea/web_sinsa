'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BuyInquiryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BuyInquiryModal({ isOpen, onClose }: BuyInquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    desiredLocation: '',
    residenceLocation: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 실제 제출 로직 구현
    console.log('Form submitted:', formData)
    alert('인수 상담 신청이 접수되었습니다. 곧 연락드리겠습니다.')
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-main-lg font-bold text-grey-900">
            매물 인수 상담
          </DialogTitle>
          <DialogDescription className="text-body text-grey-600">
            공유오피스 전문가와 상담하세요
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* 이메일 */}
            <div>
              <Input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력해주세요"
                className="h-12 text-body"
              />
            </div>

            {/* 창업희망지역 */}
            <div>
              <Input
                type="text"
                name="desiredLocation"
                required
                value={formData.desiredLocation}
                onChange={handleChange}
                placeholder="창업희망지역을 입력해주세요"
                className="h-12 text-body"
              />
            </div>

            {/* 거주지역 */}
            <div>
              <Input
                type="text"
                name="residenceLocation"
                required
                value={formData.residenceLocation}
                onChange={handleChange}
                placeholder="거주지역을 입력해주세요"
                className="h-12 text-body"
              />
            </div>

            {/* 상담신청내용 */}
            <div>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="상담 내용을 기재해주세요 (선택)"
                className="text-body resize-none"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
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
      </DialogContent>
    </Dialog>
  )
}
