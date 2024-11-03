import React, { useState, useEffect } from 'react'
import { Form, FormQuestion, User } from '../types'
import { Bold, Italic, Link, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface CustomizationPanelProps {
  form: Form
  selectedQuestion: FormQuestion | null
  onUpdateForm: (updatedForm: Form) => void
  onUpdateQuestion: (updatedQuestion: FormQuestion) => void
  user: User | undefined
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  form,
  selectedQuestion,
  onUpdateForm,
  onUpdateQuestion,
  user,
}) => {
  const [descriptionText, setDescriptionText] = useState(form.description || '')

  useEffect(() => {
    setDescriptionText(form.description || '')
  }, [form.description])

  const handleTextStyle = (style: 'bold' | 'italic' | 'link') => {
    const textarea = document.getElementById('description-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    let newText = ''
    switch (style) {
      case 'bold':
        newText = `**${selectedText}**`
        break
      case 'italic':
        newText = `*${selectedText}*`
        break
      case 'link':
        newText = `[${selectedText}](url)`
        break
    }

    const updatedText = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
    setDescriptionText(updatedText)
    onUpdateForm({ ...form, description: updatedText })
  }

  const handleColorChange = (field: 'titleColor' | 'questionColor' | 'descriptionColor' | 'submitButtonColor', color: string) => {
    onUpdateForm({ ...form, [field]: color })
  }

  const handleTextAlign = (align: 'left' | 'center' | 'right') => {
    onUpdateForm({ ...form, textAlign: align })
  }

  return (
    <div className="mt-6 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Customize</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onUpdateForm({ ...form, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <div className="flex space-x-2 mb-2">
            <button onClick={() => handleTextStyle('bold')} className="p-1 border border-gray-300 rounded">
              <Bold size={16} />
            </button>
            <button onClick={() => handleTextStyle('italic')} className="p-1 border border-gray-300 rounded">
              <Italic size={16} />
            </button>
            <button onClick={() => handleTextStyle('link')} className="p-1 border border-gray-300 rounded">
              <Link size={16} />
            </button>
          </div>
          <textarea
            id="description-textarea"
            value={descriptionText}
            onChange={(e) => {
              setDescriptionText(e.target.value)
              onUpdateForm({ ...form, description: e.target.value })
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
          <div className="mt-2">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Preview:</h3>
            <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
              <ReactMarkdown>{descriptionText}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleTextAlign('left')}
              className={`p-1 border border-gray-300 rounded ${form.textAlign === 'left' ? 'bg-purple-100' : ''}`}
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => handleTextAlign('center')}
              className={`p-1 border border-gray-300 rounded ${form.textAlign === 'center' ? 'bg-purple-100' : ''}`}
            >
              <AlignCenter size={16} />
            </button>
            <button
              onClick={() => handleTextAlign('right')}
              className={`p-1 border border-gray-300 rounded ${form.textAlign === 'right' ? 'bg-purple-100' : ''}`}
            >
              <AlignRight size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-24 text-sm">Title:</span>
              <input
                type="color"
                value={form.titleColor || '#000000'}
                onChange={(e) => handleColorChange('titleColor', e.target.value)}
                className="p-1 border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">Questions:</span>
              <input
                type="color"
                value={form.questionColor || '#000000'}
                onChange={(e) => handleColorChange('questionColor', e.target.value)}
                className="p-1 border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">Description:</span>
              <input
                type="color"
                value={form.descriptionColor || '#000000'}
                onChange={(e) => handleColorChange('descriptionColor', e.target.value)}
                className="p-1 border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">Submit Button:</span>
              <input
                type="color"
                value={form.submitButtonColor || '#6366F1'}
                onChange={(e) => handleColorChange('submitButtonColor', e.target.value)}
                className="p-1 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Text</label>
          <input
            type="text"
            value={form.buttonText || 'Submit'}
            onChange={(e) => onUpdateForm({ ...form, buttonText: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Redirect URL</label>
          <input
            type="url"
            value={form.redirectUrl || ''}
            onChange={(e) => onUpdateForm({ ...form, redirectUrl: e.target.value })}
            placeholder="https://example.com"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter a URL to redirect respondents after form submission. Leave blank for no redirect.
          </p>
        </div>

        {user?.isPro && (
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={form.capturePartialSubmissions || false}
                onChange={(e) => onUpdateForm({ ...form, capturePartialSubmissions: e.target.checked })}
                className="form-checkbox h-5 w-5 text-purple-600"
              />
              <span className="text-sm font-medium text-gray-700">Capture Partial Submissions</span>
            </label>
            <p className="mt-1 text-sm text-gray-500 ml-8">
              Enable this to capture and view partially completed form data.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomizationPanel