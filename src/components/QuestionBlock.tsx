import React, { useState } from 'react'
import { FormQuestion } from '../types'
import { Trash2, GripVertical, Plus, Image, Upload } from 'lucide-react'

interface QuestionBlockProps {
  question: FormQuestion
  onUpdate: (updatedQuestion: FormQuestion) => void
  onRemove: () => void
  onAddBlock: (event: React.MouseEvent) => void
  dragHandleProps?: any
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({ 
  question, 
  onUpdate, 
  onRemove, 
  onAddBlock,
  dragHandleProps
}) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdate = (field: keyof FormQuestion, value: any) => {
    onUpdate({ ...question, [field]: value })
  }

  const handleImageUpdate = (field: keyof FormQuestion['image'], value: any) => {
    onUpdate({
      ...question,
      image: {
        ...question.image,
        [field]: value
      }
    })
  }

  const handleFileUploadConfigUpdate = (field: keyof FormQuestion['fileUploadConfig'], value: any) => {
    onUpdate({
      ...question,
      fileUploadConfig: {
        ...question.fileUploadConfig,
        [field]: value
      }
    })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center flex-grow">
          <div {...dragHandleProps}>
            <GripVertical size={20} className="text-gray-400 mr-2 cursor-move" />
          </div>
          {isEditing ? (
            <input
              type="text"
              value={question.question}
              onChange={(e) => handleUpdate('question', e.target.value)}
              className="text-lg font-semibold bg-gray-100 border border-gray-300 rounded px-2 py-1 flex-grow"
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          ) : (
            <h3
              className="text-lg font-semibold cursor-pointer flex-grow"
              onClick={() => setIsEditing(true)}
            >
              {question.question}
            </h3>
          )}
        </div>
        <div className="flex items-center">
          <button
            onClick={onAddBlock}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-300 mr-2"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 transition-colors duration-300"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <div className="mb-2">
        <select
          value={question.type}
          onChange={(e) => handleUpdate('type', e.target.value as FormQuestion['type'])}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="text">Text</option>
          <option value="longText">Long Text</option>
          <option value="number">Number</option>
          <option value="singleSelect">Single Select</option>
          <option value="multipleChoice">Multiple Choice</option>
          <option value="checkbox">Checkbox</option>
          <option value="date">Date</option>
          <option value="email">Email</option>
          <option value="signature">Signature</option>
          <option value="statement">Statement</option>
          <option value="url">URL</option>
          <option value="fileUpload">File Upload</option>
        </select>
      </div>
      {(question.type === 'multipleChoice' || question.type === 'checkbox' || question.type === 'singleSelect') && (
        <div className="space-y-2">
          {question.options?.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...(question.options || [])]
                newOptions[index] = e.target.value
                onUpdate({ ...question, options: newOptions })
              }}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={`Option ${index + 1}`}
            />
          ))}
          <button
            onClick={() => onUpdate({ ...question, options: [...(question.options || []), ''] })}
            className="w-full p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-300"
          >
            Add Option
          </button>
        </div>
      )}
      {question.type === 'statement' && (
        <div className="mt-2">
          <textarea
            value={question.statement || ''}
            onChange={(e) => handleUpdate('statement', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            placeholder="Enter your statement here..."
          />
        </div>
      )}
      {question.type === 'fileUpload' && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Max Files:</label>
            <input
              type="number"
              value={question.fileUploadConfig?.maxFiles || 1}
              onChange={(e) => handleFileUploadConfigUpdate('maxFiles', parseInt(e.target.value))}
              className="w-20 p-1 border border-gray-300 rounded"
              min="1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Accepted File Types:</label>
            <input
              type="text"
              value={question.fileUploadConfig?.acceptedFileTypes?.join(', ') || ''}
              onChange={(e) => handleFileUploadConfigUpdate('acceptedFileTypes', e.target.value.split(',').map(type => type.trim()))}
              className="w-full p-1 border border-gray-300 rounded mt-1"
              placeholder="e.g. .pdf, .doc, .docx"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Max File Size (MB):</label>
            <input
              type="number"
              value={(question.fileUploadConfig?.maxFileSize || 0) / (1024 * 1024)}
              onChange={(e) => handleFileUploadConfigUpdate('maxFileSize', parseInt(e.target.value) * 1024 * 1024)}
              className="w-20 p-1 border border-gray-300 rounded"
              min="1"
            />
          </div>
        </div>
      )}
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Image Cover</h4>
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={question.image?.url || ''}
            onChange={(e) => handleImageUpdate('url', e.target.value)}
            placeholder="Image URL"
            className="flex-grow p-2 border border-gray-300 rounded"
          />
          <button
            onClick={() => handleUpdate('image', undefined)}
            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {question.image?.url && (
          <div className="space-y-2">
            <select
              value={question.image.placement}
              onChange={(e) => handleImageUpdate('placement', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="stack">Stack</option>
              <option value="split">Split</option>
              <option value="wallpaper">Wallpaper</option>
            </select>
            {question.image.placement === 'split' && (
              <select
                value={question.image.position}
                onChange={(e) => handleImageUpdate('position', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionBlock