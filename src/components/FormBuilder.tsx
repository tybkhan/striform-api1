import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, FormQuestion, User } from '../types'
import { PlusCircle, Save, ArrowLeft } from 'lucide-react'
import QuestionBlock from './QuestionBlock'
import FormViewer from './FormViewer'
import CustomizationPanel from './CustomizationPanel'
import QuestionTypePopup from './QuestionTypePopup'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

interface FormBuilderProps {
  forms: Form[]
  onUpdateForm: (form: Form) => void
  onCreateForm: () => Form
  user: User | undefined
}

const FormBuilder: React.FC<FormBuilderProps> = ({ forms, onUpdateForm, onCreateForm, user }) => {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState<Form | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<FormQuestion | null>(null)
  const [showQuestionTypePopup, setShowQuestionTypePopup] = useState(false)

  useEffect(() => {
    if (formId === 'new') {
      const newForm = onCreateForm()
      setForm(newForm)
    } else {
      const existingForm = forms.find(f => f.id === formId)
      if (existingForm) {
        setForm(existingForm)
      } else {
        navigate('/dashboard')
      }
    }
  }, [formId, forms, onCreateForm, navigate])

  if (!form) {
    return <div>Loading...</div>
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedForm = { ...form, title: e.target.value }
    setForm(updatedForm)
    onUpdateForm(updatedForm)
  }

  const addQuestion = (newQuestion: FormQuestion) => {
    const updatedForm = { ...form, questions: [...form.questions, newQuestion] }
    setForm(updatedForm)
    onUpdateForm(updatedForm)
  }

  const updateQuestion = (updatedQuestion: FormQuestion) => {
    const updatedQuestions = form.questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    )
    const updatedForm = { ...form, questions: updatedQuestions }
    setForm(updatedForm)
    onUpdateForm(updatedForm)
  }

  const removeQuestion = (questionId: string) => {
    const updatedQuestions = form.questions.filter(q => q.id !== questionId)
    const updatedForm = { ...form, questions: updatedQuestions }
    setForm(updatedForm)
    onUpdateForm(updatedForm)
  }

  const handleSave = () => {
    if (form) {
      onUpdateForm(form)
      navigate('/dashboard')
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination || !form) return

    const questions = Array.from(form.questions)
    const [reorderedQuestion] = questions.splice(result.source.index, 1)
    questions.splice(result.destination.index, 0, reorderedQuestion)

    const updatedForm = { ...form, questions }
    setForm(updatedForm)
    onUpdateForm(updatedForm)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col h-screen">
        <div className="bg-white shadow-md p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300 flex items-center"
            >
              <Save size={20} className="mr-2" />
              Save
            </button>
          </div>
        </div>
        <div className="flex-grow flex overflow-hidden">
          {/* Questions Panel */}
          <div className="w-1/4 p-4 overflow-y-auto bg-white shadow-md">
            <input
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              className="w-full text-2xl font-bold mb-6 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Form Title"
            />
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {form.questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={question.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <QuestionBlock
                              question={question}
                              onUpdate={updateQuestion}
                              onRemove={() => removeQuestion(question.id)}
                              onAddBlock={() => setShowQuestionTypePopup(true)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <button
              onClick={() => setShowQuestionTypePopup(true)}
              className="w-full mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-300 flex items-center justify-center"
            >
              <PlusCircle size={20} className="mr-2" />
              Add Question
            </button>
          </div>

          {/* Form Preview */}
          <div className="w-1/2 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
              <FormViewer form={form} isPreview={true} user={user} />
            </div>
          </div>

          {/* Customization Panel */}
          <div className="w-1/4 p-4 overflow-y-auto bg-white shadow-md">
            <CustomizationPanel
              form={form}
              selectedQuestion={selectedQuestion}
              onUpdateForm={(updatedForm) => {
                setForm(updatedForm)
                onUpdateForm(updatedForm)
              }}
              onUpdateQuestion={updateQuestion}
              user={user}
            />
          </div>
        </div>
      </div>

      {showQuestionTypePopup && (
        <QuestionTypePopup
          onClose={() => setShowQuestionTypePopup(false)}
          onAddQuestion={addQuestion}
        />
      )}
    </div>
  )
}

export default FormBuilder