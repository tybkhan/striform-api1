import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileSpreadsheet, MessageSquare, Zap, Check, X, ExternalLink, Globe } from 'lucide-react'
import { Form } from '../types'

interface Integration {
  id: string
  name: string
  icon: React.ElementType
  connected: boolean
  instructions: string
  url: string
  color: string
}

const IntegrationsPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>()
  const [form, setForm] = useState<Form | null>(null)
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      icon: FileSpreadsheet,
      connected: false,
      instructions: 'Connect to automatically send form responses to a Google Sheets spreadsheet.',
      url: '',
      color: '#0F9D58'
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: MessageSquare,
      connected: false,
      instructions: 'Get notified in Slack when you receive new form submissions.',
      url: '',
      color: '#4A154B'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      icon: Zap,
      connected: false,
      instructions: 'Connect your form to 3000+ apps with automated workflows.',
      url: '',
      color: '#FF4A00'
    },
    {
      id: 'webhook',
      name: 'Webhook',
      icon: Globe,
      connected: false,
      instructions: 'Send form data to a specified URL in real-time upon submission.',
      url: '',
      color: '#3B82F6'
    }
  ])

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem('forms') || '[]')
    const currentForm = storedForms.find((f: Form) => f.id === formId)
    setForm(currentForm || null)

    // Load saved integrations
    const savedIntegrations = JSON.parse(localStorage.getItem(`integrations_${formId}`) || '{}')
    setIntegrations(prevIntegrations => 
      prevIntegrations.map(integration => ({
        ...integration,
        connected: !!savedIntegrations[integration.id],
        url: savedIntegrations[integration.id] || ''
      }))
    )
  }, [formId])

  const toggleIntegration = (integrationId: string, url: string = '') => {
    setIntegrations(prevIntegrations =>
      prevIntegrations.map(integration =>
        integration.id === integrationId
          ? { ...integration, connected: !integration.connected, url: integration.connected ? '' : url }
          : integration
      )
    )

    // Save integrations state
    const updatedIntegrations = integrations.reduce((acc, integration) => {
      if (integration.id === integrationId) {
        if (!integration.connected && url) {
          acc[integration.id] = url
        }
      } else if (integration.connected) {
        acc[integration.id] = integration.url
      }
      return acc
    }, {} as Record<string, string>)
    
    localStorage.setItem(`integrations_${formId}`, JSON.stringify(updatedIntegrations))
  }

  const handleUrlChange = (integrationId: string, url: string) => {
    setIntegrations(prevIntegrations =>
      prevIntegrations.map(integration =>
        integration.id === integrationId
          ? { ...integration, url }
          : integration
      )
    )
  }

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center">
          <Link to="/dashboard" className="text-purple-600 hover:text-purple-800 mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 bg-purple-600 text-white">
            <h2 className="text-2xl font-semibold">Connect Your Form: {form.title}</h2>
            <p className="mt-2 text-purple-100">Enhance your form's capabilities by integrating with powerful tools.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                <div key={integration.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: integration.color }}>
                          <integration.icon size={24} className="text-white" />
                        </div>
                        <h2 className="text-xl font-semibold ml-3">{integration.name}</h2>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        integration.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {integration.connected ? 'Connected' : 'Not Connected'}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{integration.instructions}</p>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={integration.url}
                        onChange={(e) => handleUrlChange(integration.id, e.target.value)}
                        placeholder={`Enter ${integration.name} URL`}
                        className={`w-full p-2 border border-gray-300 rounded-md ${
                          integration.connected ? 'bg-gray-100' : ''
                        }`}
                        disabled={integration.connected}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => toggleIntegration(integration.id, integration.url)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                          integration.connected
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {integration.connected ? (
                          <>
                            <X size={16} className="inline mr-1" />
                            Disconnect
                          </>
                        ) : (
                          'Connect'
                        )}
                      </button>
                      <a
                        href="#"
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                      >
                        Learn More
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntegrationsPage