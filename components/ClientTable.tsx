'use client'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Edit2, Trash2, Download, Search, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import DocumentUpload from './DocumentUpload'

interface Client {
  id: string
  name: string
  clarityId?: string
  outreachWorker?: string
  dateOfEntry: string
  phase1Id: boolean
  phase2SocialSecurity: boolean
  phase3BirthCert: boolean
  phase4ProofOfIncome: boolean
  housingPaperworkCompleted: boolean
  housed: boolean
  hasBankAccount: boolean
  needsDetox: boolean
  needsMentalHealth: boolean
  notes?: string
}

export default function ClientTable({ onEdit, refreshTrigger }: { onEdit?: (client: Client) => void, refreshTrigger?: number }) {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterHoused, setFilterHoused] = useState<'all' | 'housed' | 'not-housed'>('all')
  const [selectedClientForDocs, setSelectedClientForDocs] = useState<Client | null>(null)

  useEffect(() => {
    fetchClients()
  }, [refreshTrigger])

  useEffect(() => {
    let filtered = clients

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.clarityId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.outreachWorker?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterHoused !== 'all') {
      filtered = filtered.filter(client =>
        filterHoused === 'housed' ? client.housed : !client.housed
      )
    }

    setFilteredClients(filtered)
  }, [searchTerm, filterHoused, clients])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
        setFilteredClients(data)
      }
    } catch (error) {
      toast.error('Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return

    try {
      const response = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error()
      toast.success('Client deleted')
      fetchClients()
    } catch {
      toast.error('Failed to delete client')
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Clarity ID', 'Worker', 'Date', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Housing Complete', 'Housed', 'Bank Account', 'Needs Detox', 'Needs MH', 'Notes']
    const csvContent = [
      headers.join(','),
      ...filteredClients.map(client => [
        client.name,
        client.clarityId || '',
        client.outreachWorker || '',
        format(new Date(client.dateOfEntry), 'MM/dd/yyyy'),
        client.phase1Id ? 'Yes' : 'No',
        client.phase2SocialSecurity ? 'Yes' : 'No',
        client.phase3BirthCert ? 'Yes' : 'No',
        client.phase4ProofOfIncome ? 'Yes' : 'No',
        client.housingPaperworkCompleted ? 'Yes' : 'No',
        client.housed ? 'Yes' : 'No',
        client.hasBankAccount ? 'Yes' : 'No',
        client.needsDetox ? 'Yes' : 'No',
        client.needsMentalHealth ? 'Yes' : 'No',
        `"${client.notes || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `housing-ready-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported!')
  }

  const getPhaseProgress = (client: Client) => {
    const phases = [client.phase1Id, client.phase2SocialSecurity, client.phase3BirthCert, client.phase4ProofOfIncome]
    return `${phases.filter(p => p).length}/4`
  }

  if (loading) return <div className="text-center p-8">Loading...</div>

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clients</h2>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded"
          />
        </div>
        <select
          value={filterHoused}
          onChange={(e) => setFilterHoused(e.target.value as any)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">All Clients</option>
          <option value="housed">Housed</option>
          <option value="not-housed">Not Housed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phases</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Housing</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Support</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-medium">{client.name}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{client.clarityId || '-'}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{client.outreachWorker || '-'}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {getPhaseProgress(client)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {client.housed ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Housed</span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">In Progress</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm">
                  <div className="flex gap-2">
                    {client.needsDetox && <span className="text-red-500" title="Needs Detox">D</span>}
                    {client.needsMentalHealth && <span className="text-purple-500" title="Needs MH">MH</span>}
                    {client.hasBankAccount && <span className="text-green-500" title="Has Bank">$</span>}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit?.(client)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSelectedClientForDocs(client)}
                      className="text-green-600 hover:text-green-900"
                      title="Documents"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredClients.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm || filterHoused !== 'all' ? 'No clients match your filters' : 'No clients yet. Add your first client!'}
        </div>
      )}

      {selectedClientForDocs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Document Management</h3>
              <button
                onClick={() => setSelectedClientForDocs(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <DocumentUpload
              clientId={selectedClientForDocs.id}
              clientName={selectedClientForDocs.name}
            />
          </div>
        </div>
      )}
    </div>
  )
}