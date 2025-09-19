'use client'
import { useState } from 'react'
import { Upload, FileText, X, Download, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface Document {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedBy: string
  uploadedAt: string
}

interface DocumentUploadProps {
  clientId: string
  clientName: string
}

export default function DocumentUpload({ clientId, clientName }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [showDocuments, setShowDocuments] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/documents?clientId=${clientId}`)
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      toast.error('Failed to fetch documents')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('clientId', clientId)
    formData.append('uploadedBy', 'Staff')

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.success('Document uploaded successfully')
        fetchDocuments()
        event.target.value = ''
      } else {
        toast.error('Failed to upload document')
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Failed to download document')
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Document deleted successfully')
        setDocuments(documents.filter(doc => doc.id !== documentId))
      } else {
        toast.error('Failed to delete document')
      }
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              <Upload className="h-4 w-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Document'}</span>
            </div>
          </label>

          <button
            onClick={() => {
              setShowDocuments(!showDocuments)
              if (!showDocuments && documents.length === 0) {
                fetchDocuments()
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>View Documents</span>
          </button>
        </div>

        <span className="text-sm text-gray-500">
          Client: {clientName}
        </span>
      </div>

      {showDocuments && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Documents</h3>
            <button
              onClick={() => setShowDocuments(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-gray-500">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-white rounded border hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{doc.fileName}</span>
                      <span className="text-sm text-gray-500">
                        ({formatFileSize(doc.fileSize)})
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy')} by {doc.uploadedBy}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(doc.id, doc.fileName)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}