import { useState } from 'react'
import { submitContactForm, type ContactFormData, type ContactResponse } from '../routes/api/contact'

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ContactResponse | null>(null)
  const [showResponse, setShowResponse] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setShowResponse(false)

    try {
      const result = await submitContactForm(formData)
      setResponse(result)
      setShowResponse(true)

      if (result.success) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setResponse({
        success: false,
        message: 'An error occurred while submitting the form.',
        error: 'SUBMISSION_ERROR',
      })
      setShowResponse(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-slate-600">
            Have questions or want to collaborate? We'd love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Your name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="your@email.com"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="What is this about?"
            />
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Your message here..."
            />
          </div>

          {/* Response Alert */}
          {showResponse && response && (
            <div
              className={`p-4 rounded-lg ${
                response.success
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <p className="font-medium">{response.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
              <a
                href="mailto:mail@bimba.org.np"
                className="text-blue-600 hover:text-blue-700"
              >
                mail@bimba.org.np
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Facebook</h3>
              <a
                href="https://www.facebook.com/profile.php?id=61590730554027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                Bimba Nepal
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}