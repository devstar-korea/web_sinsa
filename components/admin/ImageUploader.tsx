'use client'

import { useState, useCallback, useRef, DragEvent } from 'react'
import { X, Upload, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ImageFile {
  id: string
  file: File
  preview: string
  isPrimary: boolean
}

interface ImageUploaderProps {
  maxImages?: number
  onImagesChange?: (images: ImageFile[]) => void
  initialImages?: ImageFile[]
}

export default function ImageUploader({
  maxImages = 8,
  onImagesChange,
  initialImages = [],
}: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>(initialImages)
  const [dragOver, setDragOver] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateImages = useCallback(
    (newImages: ImageFile[]) => {
      setImages(newImages)
      onImagesChange?.(newImages)
    },
    [onImagesChange]
  )

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newImages: ImageFile[] = []
      const remainingSlots = maxImages - images.length

      Array.from(files)
        .slice(0, remainingSlots)
        .forEach((file) => {
          if (file.type.startsWith('image/')) {
            const id = `${Date.now()}-${Math.random()}`
            const preview = URL.createObjectURL(file)
            newImages.push({
              id,
              file,
              preview,
              isPrimary: images.length === 0 && newImages.length === 0,
            })
          }
        })

      if (newImages.length > 0) {
        updateImages([...images, ...newImages])
      }
    },
    [images, maxImages, updateImages]
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    },
    [handleFiles]
  )

  const removeImage = useCallback(
    (id: string) => {
      const imageToRemove = images.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }

      const newImages = images.filter((img) => img.id !== id)

      // 대표 이미지가 삭제된 경우 첫 번째 이미지를 대표로 설정
      if (imageToRemove?.isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true
      }

      updateImages(newImages)
    },
    [images, updateImages]
  )

  const setPrimaryImage = useCallback(
    (id: string) => {
      const newImages = images.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
      updateImages(newImages)
    },
    [images, updateImages]
  )

  // 이미지 순서 변경 - Drag & Drop
  const handleImageDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  const handleImageDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault()
      if (draggedIndex === null || draggedIndex === index) return

      const newImages = [...images]
      const draggedImage = newImages[draggedIndex]
      newImages.splice(draggedIndex, 1)
      newImages.splice(index, 0, draggedImage)

      setDraggedIndex(index)
      updateImages(newImages)
    },
    [draggedIndex, images, updateImages]
  )

  const handleImageDragEnd = useCallback(() => {
    setDraggedIndex(null)
  }, [])

  return (
    <div className="space-y-4">
      {/* 드래그앤드롭 영역 */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-grey-300 hover:border-primary hover:bg-grey-50'
            }
          `}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-grey-400" />
          <p className="text-body text-grey-700 mb-2">
            이미지를 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-caption text-grey-500">
            최대 {maxImages}장까지 업로드 가능 (남은 슬롯: {maxImages - images.length}
            개)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* 업로드된 이미지 목록 */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-grey-700">
              업로드된 이미지 ({images.length}/{maxImages})
            </p>
            <p className="text-caption text-grey-500">
              드래그하여 순서 변경 가능
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card
                key={image.id}
                draggable
                onDragStart={() => handleImageDragStart(index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragEnd={handleImageDragEnd}
                className={`
                  relative group cursor-move overflow-hidden
                  ${draggedIndex === index ? 'opacity-50' : ''}
                  ${image.isPrimary ? 'ring-2 ring-primary' : ''}
                `}
              >
                {/* 대표 이미지 배지 */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      대표
                    </div>
                  </div>
                )}

                {/* 이미지 미리보기 */}
                <div className="aspect-square bg-grey-100">
                  <img
                    src={image.preview}
                    alt={`업로드 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 액션 버튼들 */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isPrimary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPrimaryImage(image.id)
                      }}
                      className="h-8 text-xs"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      대표 설정
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(image.id)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* 순서 표시 */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 안내 메시지 */}
      {images.length === 0 && (
        <p className="text-caption text-grey-500 text-center py-4">
          아직 업로드된 이미지가 없습니다
        </p>
      )}
    </div>
  )
}
