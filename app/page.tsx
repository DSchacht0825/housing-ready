'use client'
import { useState } from 'react'
import ClientForm from '@/components/ClientForm'
import ClientTable from '@/components/ClientTable'
import { Plus, Users, FileText, Home as HomeIcon } from 'lucide-react'

export default function Home() {
  const [view, setView] = useState<'list' | 'form' | 'edit'>('list')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleEdit = (client: any) => {
    setSelectedClient(client)
    setView('edit')
  }

  const handleFormSuccess = () => {
    setView('list')
    setRefreshTrigger(prev => prev + 1)
    setSelectedClient(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Housing Ready</h1>
                <p className="text-gray-600">Client Management System</p>
              </div>
            </div>
            <nav className="flex gap-3">
              <a
                href="https://www.sdrescueoutreach.com"
                className="px-4 py-2 rounded flex items-center gap-2 bg-gray-100 hover:bg-gray-200"
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </a>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FileText className="h-4 w-4" />
                Client List
              </button>
              <button
                onClick={() => {
                  setSelectedClient(null)
                  setView('form')
                }}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  view === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Plus className="h-4 w-4" />
                New Client
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {view === 'list' && (
          <ClientTable onEdit={handleEdit} refreshTrigger={refreshTrigger} />
        )}
        {view === 'form' && (
          <ClientForm onSuccess={handleFormSuccess} />
        )}
        {view === 'edit' && selectedClient && (
          <ClientForm client={selectedClient} onSuccess={handleFormSuccess} />
        )}
      </main>
    </div>
  )
}