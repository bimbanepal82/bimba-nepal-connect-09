import { json } from '@tanstack/start'
import { createServerFn } from '@tanstack/start'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase credentials in environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactResponse {
  success: boolean
  message: string
  id?: string
  error?: string
}

export const submitContactForm = createServerFn(
  { method: 'POST' },
  async (data: ContactFormData): Promise<ContactResponse> => {
    try {
      // Validate input
      if (!data.name || !data.email || !data.subject || !data.message) {
        return {
          success: false,
          message: 'All fields are required',
          error: 'VALIDATION_ERROR',
        }
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        return {
          success: false,
          message: 'Please provide a valid email address',
          error: 'INVALID_EMAIL',
        }
      }

      // Insert into Supabase
      const { data: submission, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            created_at: new Date().toISOString(),
          },
        ])
        .select('id')
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        return {
          success: false,
          message: 'Failed to submit contact form. Please try again later.',
          error: 'DATABASE_ERROR',
        }
      }

      return {
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
        id: submission.id,
      }
    } catch (err) {
      console.error('Contact form error:', err)
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        error: 'SERVER_ERROR',
      }
    }
  }
)