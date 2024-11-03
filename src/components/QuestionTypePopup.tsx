import React, { useState } from 'react'
import { FormQuestion } from '../types'
import { X, Type, AlignLeft, Hash, List, CheckSquare, Calendar, Mail, Edit, MessageSquare, Globe, CheckCircle, Upload } from 'lucide-react'

interface QuestionTypePopupProps {
  onClose: () => void
  onAddQuestion: (question: FormQuestion) => void
}

const QuestionTypePopup: React.FC<QuestionTypePopupProps> = ({ onClose, onAddQuestion }) => {
  const [selectedType, setSelectedType] = useState<FormQuestion['type']>('text')
  const [questionText, setQuestionText] = useState('')
  const [statementText, setStatementText] = useState('')

  const questionTypes = [
    { type: 'text', label: 'Short Text', icon: Type },
    { type: 'longText', label: 'Long Text', icon: AlignLeft },
    { type: 'number', label: 'Number', icon: Hash },
    { type: 'singleSelect', label: 'Single Select', icon: CheckCircle },
    { type: 'multipleChoice', label: 'Multiple Choice', icon: List },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { type: 'date', label: 'Date', icon: Calendar },
    { type: 'email', label: 'Email', icon: Mail },
    { type: 'signature', label: 'Signature', icon: Edit },
    { type: 'statement', label: 'Statement Block', icon: MessageSquare },
    { type: 'url', label: 'Website URL', icon: Globe },
    { type: 'fileUpload', label: 'File Upload', icon: Upload },
  ]

  const handleAddQuestion = () => {
    const newQuestion: FormQuestion = {
      id: Date.now().toString(),
      type: selectedType,
      question: questionText || 'New Question',
      statement: selectedType === 'statement' ? statementText : undefined,
      options: ['Option 1', 'Option 2', 'Option 3'],
      fileUploadConfig: selectedType === 'fileUpload' ? {
        maxFiles: 1,
        acceptedFileTypes: ['application/pdf', 'image/*'],
        maxFileSize: 5 * 1024 * 1024 // 5MB
      } : undefined,
    }
    onAddQuestion(newQuestion)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Question</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Question Type</h3>
            <div className="space-y-2">
              {questionTypes.map((type) => (
                <button
                  key={type.type}
                  className={`w-full p-2 flex items-center text-left rounded transition-colors duration-200 ${
                    selectedType === type.type ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedType(type.type as FormQuestion['type'])}
                >
                  <type.icon size={18} className="mr-2" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              {selectedType === 'statement' ? (
                <textarea
                  value={statementText}
                  onChange={(e) => setStatementText(e.target.value)}
                  placeholder="Enter your statement"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  rows={5}
                />
              ) : (
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter your question"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
              )}
              {selectedType === 'text' && (
                <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Short answer text" disabled />
              )}
              {selectedType === 'longText' && (
                <textarea className="w-full p-2 border border-gray-300 rounded" rows={3} placeholder="Long answer text" disabled />
              )}
              {selectedType === 'number' && (
                <input type="number" className="w-full p-2 border border-gray-300 rounded" placeholder="0" disabled />
              )}
              {selectedType === 'singleSelect' && (
                <div className="space-y-2">
                  {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input type="radio" className="mr-2" disabled />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
              {selectedType === 'multipleChoice' && (
                <div className="space-y-2">
                  {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input type="radio" className="mr-2" disabled />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
              {selectedType === 'checkbox' && (
                <div className="space-y-2">
                  {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input type="checkbox" className="mr-2" disabled />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
              {selectedType === 'date' && (
                <input type="date" className="w-full p-2 border border-gray-300 rounded" disabled />
              )}
              {selectedType === 'email' && (
                <input type="email" className="w-full p-2 border border-gray-300 rounded" placeholder="email@example.com" disabled />
              )}
              {selectedType === 'signature' && (
                <div className="w-full h-32 border border-gray-300 rounded bg-white flex items-center justify-center text-gray-400">
                  Signature Pad
                </div>
              )}
              {selectedType === 'statement' && (
                <div className="w-full p-4 bg-white border border-gray-300 rounded">
                  <p className="text-gray-700">{statementText || 'Your statement will appear here'}</p>
                </div>
              )}
              {selectedType === 'url' && (
                <input type="url" className="w-full p-2 border border-gray-300 rounded" placeholder="https://example.com" disabled />
              )}
              {selectedType === 'fileUpload' && (
                <div className="w-full p-4 border border-gray-300 rounded bg-white flex items-center justify-center text-gray-400">
                  <Upload size={24} className="mr-2" />
                  <span>Click or drag file to upload</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionTypePopup