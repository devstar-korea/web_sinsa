// ============================================
// Session Check API Route
// ============================================
// Purpose: Server-side session validation for admin pages
// Replaces: Vulnerable middleware authentication (CVE-2025-29927)

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * GET /api/auth/session
 *
 * Returns current session status
 * Used by Server Components to validate authentication
 *
 * @returns {Object} { authenticated: boolean, user?: User }
 */
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get current user session
    // Using getUser() instead of getSession() for better security
    // Reference: https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Session check error:', error)
      return NextResponse.json(
        { authenticated: false, error: error.message },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json(
      { authenticated: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
