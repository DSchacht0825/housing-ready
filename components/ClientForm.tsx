'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface ClientData {
  name: string
  clarityId?: string
  outreachWorker?: string
  phase1Id: boolean
  phase2SocialSecurity: boolean
  phase3BirthCert: boolean
  phase4ProofOfIncome: boolean
  housingPaperworkCompleted: boolean
  housed: boolean
  hasBankAccount: boolean
  hasSavings: boolean
  hasChime: boolean
  needsDetox: boolean
  detoxReferralMadeTo?: string
  needsMentalHealth: boolean
  mentalHealthReferralMadeTo?: string
  notes?: string
}

export default function ClientForm({ client, onSuccess }: { client?: any, onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ClientData>({
    defaultValues: client || {}
  })

  const needsDetox = watch('needsDetox')
  const needsMentalHealth = watch('needsMentalHealth')

  const onSubmit = async (data: ClientData) => {
    setLoading(true)
    try {
      const url = client ? `/api/clients/${client.id}` : '/api/clients'
      const method = client ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error()

      toast.success(client ? 'Client updated!' : 'Client created!')
      onSuccess?.()
    } catch {
      toast.error('Failed to save client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">{client ? 'Edit Client' : 'New Client'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Client Name *</label>
            <input
              {...register('name', { required: 'Name required' })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Clarity ID</label>
            <input
              {...register('clarityId')}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Outreach Worker</label>
            <input
              {...register('outreachWorker')}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Documentation Phases</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('phase1Id')} />
              <span>Phase 1: ID</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('phase2SocialSecurity')} />
              <span>Phase 2: Social Security</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('phase3BirthCert')} />
              <span>Phase 3: Birth Cert</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('phase4ProofOfIncome')} />
              <span>Phase 4: Income Proof</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Housing Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('housingPaperworkCompleted')} />
              <span>Housing Paperwork Completed</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('housed')} />
              <span>Housed</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('hasBankAccount')} />
              <span>Has Bank Account</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('hasSavings')} />
              <span>Has Savings</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('hasChime')} />
              <span>Has Chime</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Support Needs</h3>
          <div className="space-y-3">
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register('needsDetox')} />
                <span>Needs Detox</span>
              </label>
              {needsDetox && (
                <input
                  {...register('detoxReferralMadeTo')}
                  placeholder="Referral made to..."
                  className="mt-2 w-full p-2 border rounded"
                />
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register('needsMentalHealth')} />
                <span>Needs Mental Health Support</span>
              </label>
              {needsMentalHealth && (
                <input
                  {...register('mentalHealthReferralMadeTo')}
                  placeholder="Referral made to..."
                  className="mt-2 w-full p-2 border rounded"
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : (client ? 'Update' : 'Create')}
          </button>
          {onSuccess && (
            <button
              type="button"
              onClick={onSuccess}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}