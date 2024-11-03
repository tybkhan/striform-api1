import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import FormView from './components/FormView'
import FormBuilder from './components/FormBuilder'
import SignupPage from './components/SignupPage'
import LandingPage from './components/LandingPage'
import CustomErrorBoundary from './components/CustomErrorBoundary'
import PricingPage from './components/PricingPage'
import ResponsesPage from './components/ResponsesPage'
import IntegrationsPage from './components/IntegrationsPage'
import { Form, User } from './types'

function App() {
  const [forms, setForms] = useState<Form[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem('forms') || '[]')
    setForms(storedForms)

    const loggedInStatus = localStorage.getItem('isLoggedIn')
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true)
      // Simulating user data, replace with actual user fetching logic
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        isPro: true // Set this based on the user's actual status
      })
    }
  }, [])

  const createNewForm = () => {
    const newForm: Form = {
      id: Date.now().toString(),
      title: 'Untitled Form',
      questions: [],
      responseCount: 0,
      capturePartialSubmissions: false,
    }
    const updatedForms = [...forms, newForm]
    setForms(updatedForms)
    localStorage.setItem('forms', JSON.stringify(updatedForms))
    return newForm
  }

  const updateForm = (updatedForm: Form) => {
    const updatedForms = forms.map(f => f.id === updatedForm.id ? updatedForm : f)
    setForms(updatedForms)
    localStorage.setItem('forms', JSON.stringify(updatedForms))
  }

  const deleteForm = (formId: string) => {
    const updatedForms = forms.filter(f => f.id !== formId)
    setForms(updatedForms)
    localStorage.setItem('forms', JSON.stringify(updatedForms))
    localStorage.removeItem(`responses_${formId}`)
  }

  const handleSignup = () => {
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
    // Simulating user data, replace with actual user creation logic
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      isPro: true // Set this based on the user's actual status
    })
  }

  const updateResponseCount = (formId: string) => {
    const responses = JSON.parse(localStorage.getItem(`responses_${formId}`) || '[]')
    const updatedForms = forms.map(f => f.id === formId ? { ...f, responseCount: responses.length } : f)
    setForms(updatedForms)
    localStorage.setItem('forms', JSON.stringify(updatedForms))
  }

  return (
    <CustomErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
            <Route path="/dashboard" element={
              isLoggedIn ? (
                <Dashboard
                  forms={forms}
                  onCreateForm={createNewForm}
                  onDeleteForm={deleteForm}
                  updateResponseCount={updateResponseCount}
                />
              ) : (
                <Navigate to="/signup" />
              )
            } />
            <Route path="/form/:formId" element={<FormView user={user || undefined} />} />
            <Route path="/builder/:formId" element={
              isLoggedIn ? (
                <FormBuilder
                  forms={forms}
                  onUpdateForm={updateForm}
                  onCreateForm={createNewForm}
                  user={user || undefined}
                />
              ) : (
                <Navigate to="/signup" />
              )
            } />
            <Route path="/responses/:formId" element={
              isLoggedIn ? (
                <ResponsesPage user={user || { isPro: false }} />
              ) : (
                <Navigate to="/signup" />
              )
            } />
            <Route path="/integrations/:formId" element={
              isLoggedIn ? (
                <IntegrationsPage />
              ) : (
                <Navigate to="/signup" />
              )
            } />
          </Routes>
        </div>
      </Router>
    </CustomErrorBoundary>
  )
}

export default App