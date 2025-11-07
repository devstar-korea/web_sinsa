'use client'

import { useState } from 'react'

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'sell' | 'buy'
}

export default function InquiryModal({ isOpen, onClose, defaultTab = 'sell' }: InquiryModalProps) {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>(defaultTab)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    // 매각상담 필드
    depositRent: '',
    location: '',
    area: '',
    rooms: '',
    // 인수상담 필드
    desiredLocation: '',
    residenceLocation: '',
    // 공통
    message: '',
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 실제 제출 로직 구현
    console.log('Form submitted:', { type: activeTab, ...formData })
    alert('상담 신청이 접수되었습니다. 곧 연락드리겠습니다.')
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
            <h2 className="text-main-lg font-bold text-grey-900">SHARE ZONE</h2>
            <p className="text-body text-grey-600 mt-1">공유오피스 전문가와 상담하세요</p>
            <p className="text-body text-grey-500 text-sm mt-1">입력한 정보를 바탕으로 전문가를 매칭해 드립니다.</p>
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

        {/* Tabs */}
        <div className="flex border-b border-grey-200">
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 px-6 py-4 text-body font-bold transition-colors ${
              activeTab === 'sell'
                ? 'text-tossBlue border-b-2 border-tossBlue'
                : 'text-grey-500 hover:text-grey-700'
            }`}
          >
            매각상담
          </button>
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 px-6 py-4 text-body font-bold transition-colors ${
              activeTab === 'buy'
                ? 'text-tossBlue border-b-2 border-tossBlue'
                : 'text-grey-500 hover:text-grey-700'
            }`}
          >
            인수상담
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* 공통 필드: 신청인 성함 */}
            <div>
              <label className="block text-body font-medium text-grey-900 mb-2">
                신청인 성함 <span className="text-tossBlue">필수</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="성함을 입력해주세요 (필수)"
                className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tossBlue focus:border-transparent text-body"
              />
            </div>

            {/* 매각상담 전용 필드 */}
            {activeTab === 'sell' && (
              <>
                <div>
                  <label className="block text-body font-medium text-grey-900 mb-2">
                    보증금 및 월세 <span className="text-tossBlue">필수</span>
                  </label>
                  <input
                    type="text"
                    name="depositRent"
                    required
                    value={formData.depositRent}
                    onChange={handleChange}
                    placeholder="보증금 및 월세를 입력해주세요 (필수)"
                    className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tossBlue focus:border-transparent text-body"
                  />
                </div>
              </>
            )}

            {/* 공통 필드: 연락처 */}
            <div>
              <label className="block text-body font-medium text-grey-900 mb-2">
                연락처 <span className="text-tossBlue">필수</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="연락처를 입력해주세요 (필수)"
                className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tossBlue focus:border-transparent text-body"
              />
            </div>

            {/* 매각상담: 매각할 사업장이 속한 지역 */}
            {activeTab === 'sell' && (
              <div>
                <label className="block text-body font-medium text-grey-900 mb-2">
                  매각할 사업장이 속한 지역 <span className="text-tossBlue">필수</span>
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="매각할 사업장 소재 지역을 입력해주세요 (필수)"
                  className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tossBlue focus:border-transparent text-body"
                />
              </div>
            )}

            {/* 공통 필드: 이메일 */}
            <div>
              <label className="block text-body font-medium text-grey-900 mb-2">
                이메일 <span className="text-tossBlue">필수</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력해주세요 (필수)"
                className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tossBlue focus:border-transparent text-body"
              />
            </div>

            {/* 매각상담: 사업장 실 면적 */}
            {activeTab === 'sell' && (
              <>
                <div>
                  <label className="block text-body font-medium text-grey-900 mb-2">
                    사업장 실 면적 <span className="text-tossBlue">필수</span>
                  </label>
                  <input
                    type="text"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="매각할 사업장의 실제 면적을 입력해주세요 (필수)"
                    className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tossBlue focus:border-transparent text-body"
                  />
                </div>

                <div>
                  <label className="block text-body font-medium text-grey-900 mb-2">
                    상주 독립룸 <span className="text-tossBlue">필수</span>
                  </label>
                  <input
                    type="text"
                    name="rooms"
                    required
                    value={formData.rooms}
                    onChange={handleChange}
                    placeholder="매각할 사업장의 룸 갯수를 입력해주세요 (필수)"
                    className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tossBlue focus:border-transparent text-body"
                  />
                </div>
              </>
            )}

            {/* 인수상담 전용 필드 */}
            {activeTab === 'buy' && (
              <>
                <div>
                  <label className="block text-body font-medium text-grey-900 mb-2">
                    창업희망지역 <span className="text-tossBlue">필수</span>
                  </label>
                  <input
                    type="text"
                    name="desiredLocation"
                    required
                    value={formData.desiredLocation}
                    onChange={handleChange}
                    placeholder="창업희망지역을 입력해주세요 (필수)"
                    className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tossBlue focus:border-transparent text-body"
                  />
                </div>

                <div>
                  <label className="block text-body font-medium text-grey-900 mb-2">
                    거주지역 <span className="text-tossBlue">필수</span>
                  </label>
                  <input
                    type="text"
                    name="residenceLocation"
                    required
                    value={formData.residenceLocation}
                    onChange={handleChange}
                    placeholder="거주지역을 입력해주세요 (필수)"
                    className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tossBlue focus:border-transparent text-body"
                  />
                </div>
              </>
            )}

            {/* 상담신청내용 */}
            <div>
              <label className="block text-body font-medium text-grey-900 mb-2">
                상담신청내용 {activeTab === 'sell' ? <span className="text-tossBlue">필수</span> : <span className="text-grey-500">선택</span>}
              </label>
              <textarea
                name="message"
                required={activeTab === 'sell'}
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder={activeTab === 'sell' ? '상담신청내용을 입력해주세요 (필수)' : '상담내용을 기재해주세요 (선택)'}
                className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tossBlue focus:border-transparent text-body resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-grey-100 text-grey-700 rounded-lg font-bold hover:bg-grey-200 transition-colors text-body"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-tossBlue text-white rounded-lg font-bold hover:bg-primary-600 transition-colors text-body"
            >
              상담 신청하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
