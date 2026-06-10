"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"

interface Asset {
  id: string
  name: string
  category: string
  description: string
  location: string
  condition: string
  quantity: number
  acquisition_date: string
  status: string
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    condition: 'Good',
    quantity: '1',
    acquisition_date: '',
    status: 'Active',
  })

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets')
      if (!response.ok) {
        throw new Error('Failed to load assets')
      }
      const data = await response.json()
      setAssets(data || [])
    } catch (error) {
      console.error('Error fetching assets:', error)
      toast.error('Failed to load assets')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Asset name is required')
      return
    }

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        condition: formData.condition,
        quantity: parseInt(formData.quantity) || 1,
        acquisition_date: formData.acquisition_date,
        status: formData.status,
      }

      const url = editingId ? `/api/assets?id=${encodeURIComponent(editingId)}` : '/api/assets'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Failed to save asset')
      }

      toast.success(editingId ? 'Asset updated' : 'Asset created')
      setFormData({ name: '', category: '', description: '', location: '', condition: 'Good', quantity: '1', acquisition_date: '', status: 'Active' })
      setFormOpen(false)
      setEditingId(null)
      await fetchAssets()
    } catch (error) {
      console.error('Error saving asset:', error)
      toast.error('Failed to save asset')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this asset?')) return

    try {
      const response = await fetch(`/api/assets?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Failed to delete asset')
      }

      toast.success('Asset deleted')
      await fetchAssets()
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('Failed to delete asset')
    }
  }

  const handleEdit = (asset: Asset) => {
    setFormData({
      name: asset.name,
      category: asset.category || '',
      description: asset.description || '',
      location: asset.location || '',
      condition: asset.condition,
      quantity: asset.quantity?.toString() || '1',
      acquisition_date: asset.acquisition_date,
      status: asset.status,
    })
    setEditingId(asset.id)
    setFormOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assets</h1>
          <p className="text-slate-600 mt-1">Manage barangay assets and equipment</p>
        </div>
        <Button onClick={() => { setFormOpen(true); setEditingId(null); setFormData({ name: '', category: '', description: '', location: '', condition: 'Good', quantity: '1', acquisition_date: '', status: 'Active' }) }}>
          <Plus className="mr-2 h-4 w-4" />
          New Asset
        </Button>
      </div>

      {formOpen && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Asset Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <Input placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              <div className="grid grid-cols-3 gap-4">
                <Input placeholder="Condition" value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} />
                <Input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                <Input type="date" value={formData.acquisition_date} onChange={(e) => setFormData({ ...formData, acquisition_date: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button variant="outline" onClick={() => { setFormOpen(false); setEditingId(null) }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {assets.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-500">
              No assets yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          assets.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{asset.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{asset.description}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{asset.category}</span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">{asset.condition}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Qty: {asset.quantity}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{asset.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Location: {asset.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(asset)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(asset.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
