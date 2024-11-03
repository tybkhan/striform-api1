import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Form, Response } from '../types'

interface ResponsesPageProps {
  user: { isPro: boolean }
}

const ResponsesPage: React.FC<ResponsesPageProps> = ({ user }) => {
  const { formId } = useParams<{ formId: string }>()
  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [showPartial, setShowPartial] = useState(false)

  useEffect(() => {
    // Fetch form data
    const storedForms = JSON.parse(localStorage.getItem('forms') || '[]')
    const currentForm = storedForms.find((f: Form) => f.id === formId)
    setForm(currentForm || null)

    // Fetch responses
    const storedResponses = JSON.parse(localStorage.getItem(`responses_${formId}`) || '[]')
    setResponses(storedResponses)
  }, [formId])

  if (!form) {
    return <div>Loading...</div>
  }

  const filteredResponses = showPartial
    ? responses
    : responses.filter(response => !response.isPartial)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-purple-600 hover:text-purple-800 mr-4">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Responses for {form.title}</h1>
          </div>
          {user.isPro && form.capturePartialSubmissions && (
            <div className="flex items-center">
              <label htmlFor="showPartial" className="mr-2">Show Partial Submissions</label>
              <input
                type="checkbox"
                id="showPartial"
                checked={showPartial}
                onChange={(e) => setShowPartial(e.target.checked)}
                className="form-checkbox h-5 w-5 text-purple-600"
              />
            </div>
          )}
        </div>
        {responses.length === 0 ? (
          <p className="text-gray-600">No responses yet.</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {form.questions.map((question) => (
                    <th key={question.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {question.question}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResponses.map((response) => (
                  <tr key={response.id} className={response.isPartial ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(response.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {response.isPartial ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Partial
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Complete
                        </span>
                      )}
                    </td>
                    {form.questions.map((question, index) => (
                      <td key={question.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index <= response.lastQuestionAnswered
                          ? Array.isArray(response.answers[question.id])
                            ? (response.answers[question.id] as string[]).join(', ')
                            : response.answers[question.id] as string
                          : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!user.isPro && (
          <div className="mt-8 bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4" role="alert">
            <p className="font-bold">Pro Feature</p>
            <p>Upgrade to Pro to access partial submissions and more advanced features!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResponsesPage