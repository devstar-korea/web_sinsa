// ============================================
// Purchase Inquiry API Route Handler
// ============================================
// Purpose: Handle purchase inquiry form submissions
// Security: Server-side validation and Supabase integration

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

/**
 * POST /api/inquiry/purchase
 * Submit a purchase inquiry form
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      phone,
      email,
      purpose,
      message,
      budget,
      preferredTime,
      hasExperience,
      listingId,
      deviceType
    } = body

    // Validate required fields
    if (!name || !phone || !email || !purpose || purpose.length === 0 || !message) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({
      cookies: async () => cookieStore
    })

    // Insert inquiry into database
    const { data, error } = await supabase
      .from('purchase_inquiries')
      .insert({
        listing_id: listingId || 'general',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        purpose: purpose,
        message: message.trim(),
        budget: budget || null,
        preferred_time: preferredTime || null,
        has_experience: hasExperience || false,
        status: 'pending',
        device_type: deviceType || 'desktop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to submit inquiry', details: error.message },
        { status: 500 }
      )
    }

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user

    return NextResponse.json({
      success: true,
      inquiry: data,
      message: '상담 신청이 성공적으로 접수되었습니다.',
    })

  } catch (error) {
    console.error('Purchase inquiry submission error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/inquiry/purchase
 * Not implemented - redirect to form page
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit inquiry.' },
    { status: 405 }
  )
}
