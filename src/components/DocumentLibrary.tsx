import { useEffect, useState, Suspense } from 'react'
import { createServerFn } from '@tanstack/start'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Document {
  id: string
  title: string
  category: 'notice' | 'report' | 'newsletter'
  file_url?: string
  published: boolean
  created_at: string
}

export const fetchDocuments = createServerFn(
  { method: 'GET' },
  async (): Promise<Document[]> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching documents:', error)
        return []
      }

      return data || []
    } catch (err) {
      console.error('Error in fetchDocuments:', err)
      return []
    }
  }
)

function DocumentCard({ doc }: { doc: Document }) {
  const categoryColors: Record<string, string> = {
    notice: 'bg-blue-100 text-blue-800',
    report: 'bg-purple-100 text-purple-800',
    newsletter: 'bg-green-100 text-green-800',
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex-1">{doc.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            categoryColors[doc.category]
          }`}
        >
          {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
        </span>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        {new Date(doc.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      {doc.file_url && (
        <a
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          View Document
        </a>
      )}
    </div>
  )
}

function DocumentSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
      <div className="h-4 bg-slate-200 rounded w-full" />
    </div>
  )
}

export function DocumentLibrary() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true)
        const docs = await fetchDocuments()
        setDocuments(docs)
      } catch (err) {
        console.error('Error loading documents:', err)
        setError('Failed to load documents')
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()

    // Set up real-time subscription
    const subscription = supabase
      .channel('documents-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        (payload) => {
          loadDocuments()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Notice Board
          </h2>
          <p className="text-lg text-slate-600">
            Stay updated with our latest notices, reports, and newsletters.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <DocumentSkeleton key={i} />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
            <svg
              className="w-16 h-16 text-slate-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Documents Yet
            </h3>
            <p className="text-slate-600">
              Documents will appear here once they are published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}