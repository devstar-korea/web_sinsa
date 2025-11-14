// ============================================
// Environment Variable Validation
// ============================================
// Purpose: Runtime validation of environment variables
// Prevents deployment with missing/invalid configuration

import { z } from 'zod'

// ============================================
// Server-side Environment Variables
// ============================================

const serverSchema = z.object({
  // Supabase (server-side)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(), // Optional for now

  // Email
  EMAIL_FROM: z.string().email('Invalid EMAIL_FROM format'),

  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

// ============================================
// Client-side Environment Variables
// ============================================

const clientSchema = z.object({
  // Supabase (client-side)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),

  // Application
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('Invalid NEXT_PUBLIC_APP_URL')
    .default('http://localhost:3000'),
})

// ============================================
// Environment Variable Processing
// ============================================

const processEnv = {
  // Server-side variables
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  NODE_ENV: process.env.NODE_ENV,

  // Client-side variables (NEXT_PUBLIC_*)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
}

// ============================================
// Validation
// ============================================

// Validate server-side variables
const serverValidation = serverSchema.safeParse(processEnv)

if (!serverValidation.success) {
  console.error('❌ Invalid server environment variables:')
  console.error(JSON.stringify(serverValidation.error.flatten().fieldErrors, null, 2))
  throw new Error('Invalid server environment variables')
}

// Validate client-side variables
const clientValidation = clientSchema.safeParse(processEnv)

if (!clientValidation.success) {
  console.error('❌ Invalid client environment variables:')
  console.error(JSON.stringify(clientValidation.error.flatten().fieldErrors, null, 2))
  throw new Error('Invalid client environment variables')
}

// ============================================
// Export Validated Environment
// ============================================

/**
 * Type-safe, validated environment variables
 *
 * Usage:
 * ```typescript
 * import { env } from '@/lib/env'
 *
 * // Server-side
 * const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
 *
 * // Client-side (NEXT_PUBLIC_*)
 * const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
 * ```
 */
export const env = {
  ...serverValidation.data,
  ...clientValidation.data,
} as const

// ============================================
// Type Exports
// ============================================

export type ServerEnv = z.infer<typeof serverSchema>
export type ClientEnv = z.infer<typeof clientSchema>
export type Env = ServerEnv & ClientEnv

// ============================================
// Runtime Environment Checks
// ============================================

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === 'production'

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development'

/**
 * Check if running in test
 */
export const isTest = env.NODE_ENV === 'test'

/**
 * Check if running on server-side
 */
export const isServer = typeof window === 'undefined'

/**
 * Check if running on client-side
 */
export const isClient = typeof window !== 'undefined'

// ============================================
// Environment Information (for debugging)
// ============================================

if (isDevelopment && isServer) {
  console.log('✅ Environment variables validated successfully')
  console.log('📝 Environment:', env.NODE_ENV)
  console.log('🌐 App URL:', env.NEXT_PUBLIC_APP_URL)
  console.log('🗄️  Supabase URL:', env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('📧 Email from:', env.EMAIL_FROM)
}
