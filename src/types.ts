import React from 'react'

export interface FormQuestion {
  id: string
  type: 'text' | 'longText' | 'number' | 'multipleChoice' | 'checkbox' | 'date' | 'email' | 'signature' | 'statement' | 'url' | 'singleSelect' | 'fileUpload'
  question: string
  options?: string[]
  statement?: string
  image?: {
    url: string
    placement: 'stack' | 'split' | 'wallpaper'
    position?: 'left' | 'right' // Only used for 'split' placement
  }
  fileUploadConfig?: {
    maxFiles?: number
    acceptedFileTypes?: string[]
    maxFileSize?: number // in bytes
  }
}

export interface Form {
  id: string
  title: string
  description?: string
  questions: FormQuestion[]
  responseCount: number
  buttonText?: string
  textAlign?: 'left' | 'center' | 'right'
  submitButtonColor?: string
  titleColor?: string
  questionColor?: string
  descriptionColor?: string
  redirectUrl?: string
  capturePartialSubmissions?: boolean // New field for partial submissions feature
}

export interface Response {
  id: string
  formId: string
  answers: Record<string, string | string[] | File[]>
  submittedAt: string
  isPartial: boolean // New field to indicate if it's a partial submission
  lastQuestionAnswered: number // New field to track the last answered question
}

export interface User {
  id: string
  name: string
  email: string
  isPro: boolean
}