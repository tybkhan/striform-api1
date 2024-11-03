import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, FormQuestion, Response, User } from '../types'
import { ArrowRight, Check, BarChart2, Upload, AlertCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import SignatureCanvas from 'react-signature-canvas'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

interface FormViewerProps {
  form: Form
  isPreview?: boolean
  onComplete?: (formId: string, answers: Record<string, string | string[] | File[]>) => void
  user?: User
}

const FormViewer: React.FC<FormViewerProps> = ({ form, isPreview = false, onComplete, user }) => {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[] | File[]>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const signatureRef = useRef<SignatureCanvas>(null)
  const questionRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentQuestion = form.questions[currentQuestionIndex]

  const handleAnswer = (answer: string | string[] | File[]) => {
    if (currentQuestion) {
      setAnswers({ ...answers, [currentQuestion.id]: answer })
      if (form.capturePartialSubmissions && user?.isPro && !isPreview) {
        savePartialSubmission()
      }
    }
  }

  const savePartialSubmission = () => {
    const partialSubmission: Response = {
      id: Date.now().toString(),
      formId: form.id,
      answers: answers,
      submittedAt: new Date().toISOString(),
      isPartial: true,
      lastQuestionAnswered: currentQuestionIndex
    }
    const responses = JSON.parse(localStorage.getItem(`responses_${form.id}`) || '[]')
    responses.push(partialSubmission)
    localStorage.setItem(`responses_${form.id}`, JSON.stringify(responses))
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < form.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (!isPreview) {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!isPreview && onComplete) {
      onComplete(form.id, answers)

      // Send webhook if connected
      const integrations = JSON.parse(localStorage.getItem(`integrations_${form.id}`) || '{}')
      if (integrations.webhook) {
        try {
          const response = await fetch(integrations.webhook, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              formId: form.id,
              formTitle: form.title,
              answers: answers,
              submittedAt: new Date().toISOString(),
            }),
          })
          if (!response.ok) {
            console.error('Failed to send webhook')
          }
        } catch (error) {
          console.error('Error sending webhook:', error)
        }
      }

      // Save complete submission
      const completeSubmission: Response = {
        id: Date.now().toString(),
        formId: form.id,
        answers: answers,
        submittedAt: new Date().toISOString(),
        isPartial: false,
        lastQuestionAnswered: form.questions.length - 1
      }
      const responses = JSON.parse(localStorage.getItem(`responses_${form.id}`) || '[]')
      responses.push(completeSubmission)
      localStorage.setItem(`responses_${form.id}`, JSON.stringify(responses))
      setIsSubmitted(true)

      // Redirect if a redirect URL is set
      if (form.redirectUrl) {
        window.location.href = form.redirectUrl
      }
    }
  }

  const renderQuestion = (question: FormQuestion) => {
    const answer = answers[question.id] || ''

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answer as string}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your answer"
          />
        )
      case 'longText':
        return (
          <textarea
            value={answer as string}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Enter your answer"
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={answer as string}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter a number"
          />
        )
      case 'singleSelect':
      case 'multipleChoice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type={question.type === 'singleSelect' ? 'radio' : 'checkbox'}
                  checked={
                    question.type === 'singleSelect'
                      ? answer === option
                      : (answer as string[])?.includes(option)
                  }
                  onChange={() => {
                    if (question.type === 'singleSelect') {
                      handleAnswer(option)
                    } else {
                      const newAnswer = answer as string[]
                      if (newAnswer?.includes(option)) {
                        handleAnswer(newAnswer.filter((a) => a !== option))
                      } else {
                        handleAnswer([...(newAnswer || []), option])
                      }
                    }
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(answer as string[])?.includes(option)}
                  onChange={() => {
                    const newAnswer = answer as string[]
                    if (newAnswer?.includes(option)) {
                      handleAnswer(newAnswer.filter((a) => a !== option))
                    } else {
                      handleAnswer([...(newAnswer || []), option])
                    }
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        )
      case 'date':
        return (
          <input
            type="date"
            value={answer as string}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        )
      case 'email':
        return (
          <input
            type="email"
            value={answer as string}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your email"
          />
        )
      case 'url':
        return (
          <input
            type="url"
            value={answer as string}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter a URL"
          />
        )
      case 'signature':
        return (
          <div className="border border-gray-300 rounded-md">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: 'w-full h-40',
              }}
              onEnd={() => {
                if (signatureRef.current) {
                  handleAnswer(signatureRef.current.toDataURL())
                }
              }}
            />
            <button
              onClick={() => {
                if (signatureRef.current) {
                  signatureRef.current.clear()
                  handleAnswer('')
                }
              }}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear Signature
            </button>
          </div>
        )
      case 'statement':
        return (
          <div className="p-4 bg-gray-100 rounded-md">
            <ReactMarkdown>{question.statement || ''}</ReactMarkdown>
          </div>
        )
      case 'fileUpload':
        return (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) {
                  handleAnswer(Array.from(e.target.files))
                }
              }}
              multiple={question.fileUploadConfig?.maxFiles !== 1}
              accept={question.fileUploadConfig?.acceptedFileTypes?.join(',')}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Upload File(s)
            </button>
            {answer && Array.isArray(answer) && (
              <ul className="mt-2">
                {(answer as File[]).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        )
      default:
        return null
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
          <Check size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-xl text-gray-600 mb-8">Your form has been submitted successfully.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      {isPreview && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-yellow-900 text-center py-2 px-4">
          <AlertCircle className="inline-block mr-2" size={20} />
          Preview Mode: Form submissions are disabled
        </div>
      )}
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: form.titleColor || 'inherit' }}>
          {form.title}
        </h1>
        {form.description && (
          <p className="text-gray-600 mb-8 text-center" style={{ color: form.descriptionColor || 'inherit' }}>
            <ReactMarkdown>{form.description}</ReactMarkdown>
          </p>
        )}
        <TransitionGroup>
          <CSSTransition
            key={currentQuestionIndex}
            timeout={300}
            classNames="fade"
            nodeRef={questionRef}
          >
            <div ref={questionRef}>
              {currentQuestion && (
                <div className="mb-6" style={{ textAlign: form.textAlign || 'left' }}>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: form.questionColor || 'inherit' }}>
                    {currentQuestion.question}
                  </h2>
                  {renderQuestion(currentQuestion)}
                </div>
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
        <div className="flex justify-between items-center mt-8">
          <div className="text-gray-500">
            Question {currentQuestionIndex + 1} of {form.questions.length}
          </div>
          <button
            onClick={goToNextQuestion}
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors duration-300 flex items-center"
            style={{ backgroundColor: form.submitButtonColor || '#6366F1' }}
          >
            {currentQuestionIndex === form.questions.length - 1 ? (
              form.buttonText || 'Submit'
            ) : (
              'Next'
            )}
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormViewer