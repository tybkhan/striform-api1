import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, FileText, BarChart2, Trash2, Edit, Share2, Eye, Code, Link } from 'lucide-react'
import { Form } from '../types'
import EmbedCodeModal from './EmbedCodeModal'

interface DashboardProps {
  forms: Form[]
  onCreateForm: () => Form
  onDeleteForm: (formId: string) => void
  updateResponseCount: (formId: string) => void
}

const Dashboard: React.FC<DashboardProps> = ({ forms, onCreateForm, onDeleteForm, updateResponseCount }) => {
  const navigate = useNavigate()
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [embedModalOpen, setEmbedModalOpen] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)

  const handleCreateForm = async () => {
    const newForm = onCreateForm()
    
    // Try to save to API first
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newForm),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save form')
      }
    } catch (err) {
      console.warn('API save failed, using localStorage only')
    }

    navigate(`/builder/${newForm.id}`)
  }

  const handleViewForm = (formId: string) => {
    const formUrl = `${window.location.origin}/form/${formId}`
    window.open(formUrl, '_blank', 'noopener,noreferrer')
    updateResponseCount(formId)
  }

  const handleDeleteForm = async (formId: string) => {
    // Try to delete from API first
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/forms/${formId}`, {
        method: 'DELETE',
      })
    } catch (err) {
      console.warn('API delete failed, removing from localStorage only')
    }

    onDeleteForm(formId)
  }

  const handleShareForm = (formId: string) => {
    const url = `${window.location.origin}/form/${formId}`
    setShareUrl(url)
    navigator.clipboard.writeText(url)
  }

  const handleViewResponses = (formId: string) => {
    navigate(`/responses/${formId}`)
  }

  const handleEmbedForm = (formId: string) => {
    setSelectedFormId(formId)
    setEmbedModalOpen(true)
  }

  const handleIntegrations = (formId: string) => {
    navigate(`/integrations/${formId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <BarChart2 size={36} className="text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Striform</h1>
          </div>
          <button
            onClick={handleCreateForm}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300 flex items-center text-lg font-semibold shadow-md"
          >
            <PlusCircle size={24} className="mr-2" />
            Create New Form
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {shareUrl && (
          <div className="mb-8 p-4 bg-green-100 text-green-700 rounded-md flex items-center justify-between shadow-md">
            <span className="font-medium">Form URL copied to clipboard: {shareUrl}</span>
            <button
              onClick={() => setShareUrl(null)}
              className="text-green-700 hover:text-green-900 font-semibold"
            >
              Close
            </button>
          </div>
        )}
        {forms.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow-md p-12">
            <p className="text-2xl text-gray-600 mb-6">You don't have any forms created yet.</p>
            <button
              onClick={handleCreateForm}
              className="px-8 py-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300 inline-flex items-center text-lg font-semibold shadow-md"
            >
              <PlusCircle size={24} className="mr-2" />
              Create Your First Form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {forms.map(form => (
              <div key={form.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3 truncate">{form.title}</h2>
                  <p className="text-gray-600 mb-6">Responses: {form.responseCount}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => navigate(`/builder/${form.id}`)}
                      className="flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-300"
                    >
                      <Edit size={18} className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleViewForm(form.id)}
                      className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-300"
                    >
                      <FileText size={18} className="mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleShareForm(form.id)}
                      className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-300"
                    >
                      <Share2 size={18} className="mr-2" />
                      Share
                    </button>
                    <button
                      onClick={() => handleViewResponses(form.id)}
                      className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors duration-300"
                    >
                      <Eye size={18} className="mr-2" />
                      Responses
                    </button>
                    <button
                      onClick={() => handleEmbedForm(form.id)}
                      className="flex items-center justify-center px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors duration-300"
                    >
                      <Code size={18} className="mr-2" />
                      Embed
                    </button>
                    <button
                      onClick={() => handleIntegrations(form.id)}
                      className="flex items-center justify-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors duration-300"
                    >
                      <Link size={18} className="mr-2" />
                      Integrations
                    </button>
                    <button
                      onClick={() => handleDeleteForm(form.id)}
                      className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300"
                    >
                      <Trash2 size={18} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {embedModalOpen && selectedFormId && (
        <EmbedCodeModal
          formId={selectedFormId}
          onClose={() => setEmbedModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Dashboard