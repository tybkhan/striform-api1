import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form } from '../types'
import FormViewer from './FormViewer'
import { AlertCircle } from 'lucide-react'

const FormView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadForm = async () => {
      try {
        // First try to fetch from API
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/forms/${formId}`)
          if (response.ok) {
            const formData = await response.json()
            setForm(formData)
            return
          }
        } catch (err) {
          console.warn('API fetch failed, falling back to localStorage')
        }

        // Fallback to localStorage
        const storedForms = JSON.parse(localStorage.getItem('forms') || '[]')
        const currentForm = storedForms.find((f: Form) => f.id === formId)
        
        if (currentForm) {
          setForm(currentForm)
        } else {
          setError('Form not found')
        }
      } catch (err) {
        setError('Error loading form')
        console.error('Error loading form:', err)
      } finally {
        setLoading(false)
      }
    }

    loadForm()
  }, [formId])

  const handleComplete = async (formId: string, answers: Record<string, string | string[]>) => {
    if (Object.keys(answers).length > 0) {
      const response = {
        id: Date.now().toString(),
        formId: formId,
        answers: answers,
        submittedAt: new Date().toISOString(),
      }

      // Try to submit to API first
      try {
        await fetch(`${import.meta.env.VITE_API_URL || ''}/api/responses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(response),
        })
      } catch (err) {
        console.warn('API submission failed, falling back to localStorage')
        // Fallback to localStorage
        const responses = JSON.parse(localStorage.getItem(`responses_${formId}`) || '[]')
        responses.push(response)
        localStorage.setItem(`responses_${formId}`, JSON.stringify(responses))
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  return <FormViewer form={form} onComplete={handleComplete} />
}

export default FormView