"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { printElementById } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { getErrorMessage } from '@/lib/utils'
import { formatResidentName } from '@/lib/document-request-profile'

import { 
  Search, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Printer,
  Settings,
  Loader2,
  Plus,
  Edit2,
  Trash2
} from "lucide-react"

type DocumentType = {
  id: string
  name: string
  requirements: string[]
  fee: string
  isActive?: boolean
}

type DocumentRequest = {
  id: string
  request_number: string
  control_number?: string
  type: string
  purpose: string
  requester_id: string | null
  resident_id?: string | null
  requester_name: string
  requester_email: string
  purok: string
  requester_first_name?: string | null
  requester_middle_name?: string | null
  requester_last_name?: string | null
  requester_suffix?: string | null
  requester_purok?: string | null
  requester_civil_status?: string | null
  status: string
  fee: string
  pickup_time: string | null
  release_date: string | null
  rejection_reason?: string | null
  documents_uploaded: boolean
  missing_documents: string[] | null
  document_path?: Array<{ requirement?: string; name?: string; url?: string }>
  created_at: string
}

const defaultDocumentTypes: DocumentType[] = []

const REQUIREMENT_CHOICES = [
  "Valid ID",
  "Proof of Residency",
  "Proof of Address",
  "Income Statement",
  "Business Registration",
  "Barangay Clearance Form",
  "Photo ID",
  "Letter of Intent",
]

const REQUIREMENT_FALLBACKS: Record<string, string[]> = {
  barangay_clearance: ['Valid ID', 'Letter of Intent'],
  certificate_of_residency: ['Valid ID', 'Proof of Residency'],
  certificate_of_indigency: ['Valid ID', 'Proof of Low Income'],
  barangay_business_clearance: ['Valid ID', 'Business Registration', 'Barangay Clearance Form'],
  certificate_of_solo_parent: ['Valid ID', 'Proof of Solo Parent'],
  certificate_of_business_closure: ['Valid ID', 'Business Registration'],
  certificate_to_file_action: ['Valid ID', 'Letter of Intent'],
  medical_assistance_certificate: ['Valid ID', 'Medical Certificate'],
  blotter_report: ['Valid ID', 'Letter of Intent'],
  settlement_agreement: ['Valid ID', 'Letter of Intent'],
}

function getDocumentPreviewTemplate(type: string, issuedDate: Date) {
  const normalizedType = (type || '').toLowerCase()

  if (normalizedType.includes('business') || normalizedType.includes('barangay_business_clearance')) {
    return {
      title: 'BARANGAY BUSINESS CLEARANCE',
      paragraphs: [
        <p key="business-1">This is to certify that <strong>[OWNER NAME]</strong>, owner/proprietor of <strong>[BUSINESS NAME]</strong>, located at <strong>[BUSINESS ADDRESS]</strong>, Barangay Santiago, San Antonio, Zambales, has complied with the requirements of this Barangay and is hereby granted a Barangay Business Clearance.</p>,
        <p key="business-2">This clearance is issued to support the application/renewal of a Business Permit and for whatever lawful purpose it may serve.</p>,
        <p key="business-3">Issued this <strong>{issuedDate.getDate()}</strong> day of <strong>{issuedDate.toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>{issuedDate.getFullYear()}</strong> at Barangay Santiago, San Antonio, Zambales.</p>,
      ],
    }
  }

  if (normalizedType.includes('residency') || normalizedType.includes('certificate_of_residency')) {
    return {
      title: 'CERTIFICATE OF RESIDENCY',
      paragraphs: [
        <p key="residency-1">This is to certify that <strong>[NAME]</strong> is a bona fide resident of Barangay Santiago, San Antonio, Zambales and is residing at <strong>[PUROK/ADDRESS]</strong>.</p>,
        <p key="residency-2">This certification is issued upon request for whatever lawful purpose it may serve.</p>,
        <p key="residency-3">Issued this <strong>{issuedDate.getDate()}</strong> day of <strong>{issuedDate.toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>{issuedDate.getFullYear()}</strong> at Barangay Santiago, San Antonio, Zambales.</p>,
      ],
    }
  }

  if (normalizedType.includes('indigency') || normalizedType.includes('certificate_of_indigency')) {
    return {
      title: 'CERTIFICATE OF INDIGENCY',
      paragraphs: [
        <p key="indigency-1">This is to certify that <strong>[NAME]</strong> belongs to an indigent family and is financially incapable of meeting the expenses related to <strong>[PURPOSE]</strong>.</p>,
        <p key="indigency-2">This certification is issued upon request for whatever lawful purpose it may serve.</p>,
        <p key="indigency-3">Issued this <strong>{issuedDate.getDate()}</strong> day of <strong>{issuedDate.toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>{issuedDate.getFullYear()}</strong> at Barangay Santiago, San Antonio, Zambales.</p>,
      ],
    }
  }

  if (normalizedType.includes('clearance') || normalizedType.includes('barangay_clearance')) {
    return {
      title: 'BARANGAY CLEARANCE',
      paragraphs: [
        <p key="clearance-1">This is to certify that <strong>[NAME]</strong> is a resident of Barangay Santiago and has no pending derogatory record on file in this office.</p>,
        <p key="clearance-2">This clearance is issued upon request for whatever lawful purpose it may serve.</p>,
        <p key="clearance-3">Issued this <strong>{issuedDate.getDate()}</strong> day of <strong>{issuedDate.toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>{issuedDate.getFullYear()}</strong> at Barangay Santiago, San Antonio, Zambales.</p>,
      ],
    }
  }

  if (normalizedType.includes('building')) {
    return {
      title: 'BUILDING PERMIT CLEARANCE',
      paragraphs: [
        <p key="building-1">This is to certify that the Barangay has no objection to the proposed construction of <strong>[STRUCTURE TYPE]</strong> located at <strong>[PROPERTY ADDRESS]</strong>, subject to existing laws and regulations.</p>,
        <p key="building-2">This certification is issued upon request for whatever lawful purpose it may serve.</p>,
        <p key="building-3">Issued this <strong>{issuedDate.getDate()}</strong> day of <strong>{issuedDate.toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>{issuedDate.getFullYear()}</strong> at Barangay Santiago, San Antonio, Zambales.</p>,
      ],
    }
  }

  return {
    title: type || 'Resident Request',
    paragraphs: [
      <p key="default-1">This is to certify that <strong>[NAME]</strong>, a bonafide resident of Barangay Santiago, San Antonio, Zambales, is residing at <strong>[ADDRESS]</strong>.</p>,
      <p key="default-2">This certification is issued upon the request of the above-mentioned person for the purpose of <strong>[PURPOSE]</strong>.</p>,
      <p key="default-3">Issued this <strong>{issuedDate.getDate()}</strong> day of <strong>{issuedDate.toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>{issuedDate.getFullYear()}</strong>.</p>,
    ],
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] md:text-xs">
          <CheckCircle2 className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Approved</span>
          <span className="sm:hidden">OK</span>
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] md:text-xs">
          <Clock className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Pending</span>
          <span className="sm:hidden">Wait</span>
        </Badge>
      )
    case "declined":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] md:text-xs">
          <XCircle className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Declined</span>
          <span className="sm:hidden">No</span>
        </Badge>
      )
    case "ready_to_print":
      return (
        <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100 text-[10px] md:text-xs">
          <Printer className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Ready to Print</span>
          <span className="sm:hidden">Print</span>
        </Badge>
      )
    case "released":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] md:text-xs">
          <CheckCircle2 className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Released</span>
          <span className="sm:hidden">Done</span>
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function OfficialDocumentHeader({ printOnly = false }: { printOnly?: boolean }) {
  return (
    <div className={`w-full flex items-center justify-between mb-4 p-6 border-b bg-white ${printOnly ? 'hidden print:flex' : ''}`}>
      {/* Left Logo (saz-logo) */}
      <Image src="/logos/saz-logo.png" alt="Municipality Seal" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain shrink-0" />
      
      {/* Center Text */}
      <div className="text-center flex-1 px-4">
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Republic of the Philippines</p>
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Province of Zambales</p>
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Municipality of San Antonio</p>
        <p className="text-xs md:text-sm font-semibold print:text-black">Barangay Santiago</p>
        <p className="text-xs md:text-sm font-semibold print:text-black">Office of the Barangay Captain</p>
      </div>
      
      {/* Right Logo (santiago-logo) */}
      <Image src="/logos/santiago-logo.png" alt="Barangay Santiago Logo" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain shrink-0" />
    </div>
  )
}

export default function OfficialDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [requests, setRequests] = useState<DocumentRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)
  const [declineReason, setDeclineReason] = useState("")
  const [showManageTypes, setShowManageTypes] = useState(false)
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(defaultDocumentTypes)
  const [loading, setLoading] = useState(true)
  const [selectedPrintRequest, setSelectedPrintRequest] = useState<DocumentRequest | null>(null)
  const [showAddTypeDialog, setShowAddTypeDialog] = useState(false)
  const [editingType, setEditingType] = useState<DocumentType | null>(null)
  const [formData, setFormData] = useState({ name: "", requirements: "", fee: "" })
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([])
  const [requirementInput, setRequirementInput] = useState("")
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<{ requirement?: string; name?: string; url?: string } | null>(null)
  const [savingType, setSavingType] = useState(false)
  const [selectedRequestUploads, setSelectedRequestUploads] = useState<any[]>([])
  const [loadingRequestUploads, setLoadingRequestUploads] = useState(false)

  const getAuthHeaders = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.warn('Unable to read auth session for document type management', sessionError)
      }

      const accessToken = sessionData?.session?.access_token
      return {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      }
    } catch (error) {
      console.warn('Failed to build auth headers for document type management', error)
      return { 'Content-Type': 'application/json' }
    }
  }

  const normalizeRequirements = (raw: any): string[] => {
    if (!raw) return []
    if (Array.isArray(raw)) return raw.map(String)
    if (typeof raw === 'string') {
      const trimmed = raw.trim()
      // try parse JSON array
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed)
          if (Array.isArray(parsed)) return parsed.map(String)
        } catch {
          // fallthrough
        }
      }
      // fallback: comma separated
      return trimmed.split(',').map(s => s.trim()).filter(Boolean)
    }
    return []
  }

  useEffect(() => {
    setFormData((prev) => ({ ...prev, requirements: selectedRequirements.join(', ') }))
  }, [selectedRequirements])

  useEffect(() => {
    fetchRequests()
    fetchDocumentTypes()
  }, [])

  const loadRequestUploads = async (request: DocumentRequest | null = selectedRequest) => {
    if (!request) {
      setSelectedRequestUploads([])
      return
    }

    setLoadingRequestUploads(true)
    try {
      const residentId = request.resident_id || request.requester_id || ''
      const params = new URLSearchParams({ documentId: request.id })
      if (residentId) {
        params.set('residentId', residentId)
      }

      const response = await fetch(`/api/documents/uploads?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to load resident uploads')
      }

      const payload = await response.json()
      setSelectedRequestUploads(payload.uploads || [])
    } catch (error) {
      console.error('Error loading request uploads:', error)
      setSelectedRequestUploads([])
    } finally {
      setLoadingRequestUploads(false)
    }
  }

  useEffect(() => {
    if (!selectedRequest) {
      setSelectedRequestUploads([])
      return
    }

    loadRequestUploads(selectedRequest)
  }, [selectedRequest])

  function parseDocumentPath(raw: any) {
    if (!raw) return []
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw)
      } catch {
        return []
      }
    }
    return Array.isArray(raw) ? raw : []
  }

  // Document Type Management Handlers
  const handleAddType = async () => {
    if (!formData.name) {
      toast.error("Document type name is required")
      return
    }
    if (selectedRequirements.length === 0) {
      toast.error("Please select at least one requirement")
      return
    }
    const feeValue = String(formData.fee || '').trim()
    if (!feeValue) {
      toast.error("Fee is required")
      return
    }

    setSavingType(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/admin/document-types', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: formData.name.trim(),
          requirements: selectedRequirements,
          fee: feeValue,
          is_active: true,
        }),
      })

      const payload = await response.json()
      if (!response.ok || payload.error) {
        throw new Error(payload.error || 'Failed to add document type')
      }

      const data = payload.data
      const newType: DocumentType = {
        id: data.id,
        name: data.name,
        requirements: normalizeRequirements(data.requirements),
        fee: data.fee || '',
        isActive: data.is_active ?? true,
      }

      setDocumentTypes([...documentTypes, newType])
      closeTypeDialog()
      toast.success("Document type added successfully")
    } catch (error) {
      console.error('Error saving new document type:', getErrorMessage(error))
      toast.error(getErrorMessage(error, 'Failed to add document type'))
    } finally {
      setSavingType(false)
    }
  }

  const handleEditType = async () => {
    if (!editingType) {
      toast.error("Unable to identify the document type being edited")
      return
    }
    if (!formData.name) {
      toast.error("Document type name is required")
      return
    }
    if (selectedRequirements.length === 0) {
      toast.error("Please select at least one requirement")
      return
    }
    const feeValue = String(formData.fee || '').trim()
    if (!feeValue) {
      toast.error("Fee is required")
      return
    }

    setSavingType(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/admin/document-types', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: editingType.id,
          name: formData.name.trim(),
          requirements: selectedRequirements,
          fee: feeValue,
        }),
      })

      const payload = await response.json()
      if (!response.ok || payload.error) {
        throw new Error(payload.error || 'Failed to update document type')
      }

      const data = payload.data
      setDocumentTypes(documentTypes.map(type => 
        type.id === editingType.id 
          ? {
              ...type,
              name: data.name,
              requirements: normalizeRequirements(data.requirements),
              fee: data.fee || '',
            }
          : type
      ))
      closeTypeDialog()
      toast.success("Document type updated successfully")
    } catch (error) {
      console.error('Error updating document type:', getErrorMessage(error))
      toast.error(getErrorMessage(error, 'Failed to update document type'))
    } finally {
      setSavingType(false)
    }
  }

  const handleDeleteType = async (typeId: string) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`/api/admin/document-types`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ id: typeId }),
      })

      const payload = await response.json()
      if (!response.ok || payload.error) {
        throw new Error(payload.error || 'Failed to remove document type')
      }

      setDocumentTypes(documentTypes.filter(type => type.id !== typeId))
      toast.success("Document type removed")
    } catch (error) {
      console.error('Error deleting document type:', getErrorMessage(error))
      toast.error(getErrorMessage(error, 'Failed to remove document type'))
    }
  }

  const handleDeactivateType = async (typeId: string) => {
    const typeToToggle = documentTypes.find(type => type.id === typeId)
    if (!typeToToggle) {
      toast.error('Document type not found')
      return
    }

    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/admin/document-types', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: typeId,
          is_active: !typeToToggle.isActive,
        }),
      })

      const payload = await response.json()
      if (!response.ok || payload.error) {
        throw new Error(payload.error || 'Failed to update document type status')
      }

      const data = payload.data
      setDocumentTypes(documentTypes.map(type =>
        type.id === typeId ? { ...type, isActive: data.is_active ?? !typeToToggle.isActive } : type
      ))
      toast.success(`Document type ${typeToToggle.isActive ? 'deactivated' : 'activated'}`)
    } catch (error) {
      console.error('Error updating document type status:', getErrorMessage(error))
      toast.error(getErrorMessage(error, 'Failed to update document type status'))
    }
  }

  const openEditDialog = (type: DocumentType) => {
    setEditingType(type)
    const normalized = normalizeRequirements((type as any).requirements)
    setFormData({
      name: type.name,
      requirements: normalized.join(', '),
      fee: type.fee !== undefined && type.fee !== null ? String(type.fee) : ''
    })
    setSelectedRequirements(normalized)
    setRequirementInput("")
    setShowAddTypeDialog(true)
  }

  const closeTypeDialog = () => {
    setShowAddTypeDialog(false)
    setEditingType(null)
    setFormData({ name: "", requirements: "", fee: "" })
    setSelectedRequirements([])
    setRequirementInput("")
  }

  const getFileExtensionFromUrl = (url?: string) => {
    if (!url) return ''

    try {
      const parsed = new URL(url)
      const match = parsed.pathname.match(/\.([a-z0-9]+)(?:$|\?)/i)
      return match?.[1]?.toLowerCase() || ''
    } catch {
      const cleanUrl = url.split('?')[0].split('#')[0]
      const match = cleanUrl.match(/\.([a-z0-9]+)$/i)
      return match?.[1]?.toLowerCase() || ''
    }
  }

  const isPreviewableFile = (url?: string) => {
    const extension = getFileExtensionFromUrl(url)
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)
  }

  const getFileType = (url?: string) => {
    const extension = getFileExtensionFromUrl(url)
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image'
    if (extension === 'pdf') return 'pdf'
    return 'file'
  }

  const formatDocumentType = (type?: string | null) => {
    switch (type) {
      case 'barangay_clearance':
        return 'Barangay Clearance'
      case 'certificate_of_indigency':
        return 'Certificate of Indigency'
      case 'barangay_business_clearance':
        return 'Barangay Business Clearance'
      case 'certificate_of_residency':
        return 'Certificate of Residency'
      case 'certificate_of_solo_parent':
        return 'Certificate of Solo Parent'
      case 'certificate_of_business_closure':
        return 'Certificate of Business Closure'
      case 'certificate_to_file_action':
        return 'Certificate to File Action'
      case 'medical_assistance_certificate':
        return 'Medical Assistance Certificate'
      case 'blotter_report':
        return 'Blotter Report'
      case 'settlement_agreement':
        return 'Settlement Agreement'
      default:
        return type || 'Document Request'
    }
  }

  const getRequirementsForRequest = (request: DocumentRequest | null) => {
    if (!request) return []

    const documentTypeName = (request as any).document_type || request.type || ''
    const normalizedType = String(documentTypeName).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')

    const fromDocumentTypes = (documentTypes.find((type) => type.name === request.type || type.name === formatDocumentType(documentTypeName))?.requirements || [])
    if (fromDocumentTypes.length > 0) return fromDocumentTypes

    return REQUIREMENT_FALLBACKS[normalizedType] || ['Valid ID']
  }

  const getResidentDisplayName = (profile: any, fallback = 'Resident') => {
    if (!profile) return fallback

    const nameParts = [profile.first_name, profile.middle_name, profile.last_name, profile.suffix].filter(Boolean)
    if (nameParts.length > 0) {
      return nameParts.join(' ').trim()
    }

    const fullName = [profile.full_name, profile.name].find((value) => String(value || '').trim())
    return String(fullName || '').trim() || fallback
  }

  async function fetchRequests() {
    setLoading(true)
    try {
      const response = await fetch('/api/documents')
      if (!response.ok) {
        throw new Error(`Failed to load document requests (${response.status})`)
      }

      const data = await response.json()
      const requestsData = Array.isArray(data) ? data : data?.documents || []

      if (!requestsData || requestsData.length === 0) {
        setRequests([])
        return
      }

      const residentIds = Array.from(new Set(
        requestsData.flatMap((request: any) => [request.resident_id, request.requester_id].filter(Boolean))
      ))
      const profileMap = new Map<string, any>()

      if (residentIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, middle_name, last_name, suffix, full_name, email, purok, civil_status')
          .in('id', residentIds)

        if (!profilesError && Array.isArray(profilesData)) {
          profilesData.forEach((profile: any) => profileMap.set(profile.id, profile))
        }
      }

      const mappedRequests = requestsData.map((request: any) => {
        const parsedDocumentPath = parseDocumentPath(request.document_path)
        const requesterUid = request.resident_id || request.requester_id || null
        const residentProfile = requesterUid ? profileMap.get(requesterUid) : null
        const rawPurpose = String(request.purpose || request.notes || request.request_purpose || '').trim()
        const controlNumber = request.control_number || request.request_number || request.id
        const residentName = formatResidentName(
          residentProfile || {
            first_name: request.requester_first_name,
            middle_name: request.requester_middle_name,
            last_name: request.requester_last_name,
            suffix: request.requester_suffix,
            full_name: request.requester_name || request.full_name || request.name,
          },
          String(request.requester_name || request.full_name || request.name || '').trim() || 'Resident'
        )

        return {
          ...request,
          request_number: controlNumber,
          control_number: controlNumber,
          type: formatDocumentType(request.document_type || request.type || request.documentType || ''),
          purpose: rawPurpose || 'No purpose provided',
          requester_id: request.resident_id ?? request.requester_id ?? null,
          resident_id: request.resident_id ?? request.requester_id ?? null,
          requester_name: residentName,
          requester_email: residentProfile?.email || request.requester_email || 'N/A',
          purok: request.requester_purok || residentProfile?.purok || request.purok || 'N/A',
          requester_first_name: request.requester_first_name || residentProfile?.first_name || null,
          requester_middle_name: request.requester_middle_name || residentProfile?.middle_name || null,
          requester_last_name: request.requester_last_name || residentProfile?.last_name || null,
          requester_suffix: request.requester_suffix || residentProfile?.suffix || null,
          requester_purok: request.requester_purok || residentProfile?.purok || null,
          requester_civil_status: request.requester_civil_status || residentProfile?.civil_status || null,
          fee: '0',
          documents_uploaded: parsedDocumentPath.length > 0 || Boolean(request.document_path),
          missing_documents: [],
          document_path: parsedDocumentPath,
        }
      })

      setRequests(mappedRequests)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : (error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error))
      console.error('Error fetching document requests:', errorMessage)
      toast.error('Failed to load document requests.')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  async function fetchDocumentTypes() {
    try {
      const response = await fetch('/api/documents/types?active=true')
      const payload = await response.json()
      const data = Array.isArray(payload) ? payload : payload?.data || []

      if (!response.ok && !Array.isArray(data)) {
        throw new Error(payload.error || 'Failed to load document types')
      }

      setDocumentTypes((data || []).map((type: any) => ({
        id: type.id,
        name: type.name,
        requirements: normalizeRequirements(type.requirements),
        fee: type.fee || '',
        isActive: type.is_active ?? true,
      })))
    } catch (error) {
      console.error('Error fetching document types:', error)
      try {
        const headers = await getAuthHeaders()
        const fallbackResponse = await fetch('/api/admin/document-types', {
          method: 'GET',
          headers,
        })
        const fallbackPayload = await fallbackResponse.json()
        const fallbackData = fallbackPayload?.data || []

        setDocumentTypes((fallbackData || []).map((type: any) => ({
          id: type.id,
          name: type.name,
          requirements: normalizeRequirements(type.requirements),
          fee: type.fee || '',
          isActive: type.is_active ?? true,
        })))
      } catch (fallbackError) {
        console.error('Fallback document type fetch failed:', fallbackError)
        toast.error('Failed to load document types')
        setDocumentTypes([])
      }
    }
  }

  const handlePrintRequest = (request: DocumentRequest) => {
    setSelectedPrintRequest(request)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        printElementById("print-request-content")
        setSelectedPrintRequest(null)
      })
    })
  }

  const handleApproveRequest = async (requestId: string) => {
    const request = requests.find(r => r.id === requestId)

    try {
      const pickupDate = new Date()
      pickupDate.setDate(pickupDate.getDate() + 2)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/documents/approve', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          documentRequestId: requestId,
          action: 'approve',
          approvedBy: request?.requester_id || request?.resident_id || null,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok || payload?.error) {
        throw new Error(payload?.error || 'Failed to approve request')
      }

      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'approved', pickup_time: pickupDate.toISOString(), rejection_reason: null } : r
      ))
      setShowApproveDialog(false)
      setSelectedRequest(null)
      toast.success('Request approved successfully')
    } catch (error) {
      console.error('Error approving request:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to approve request')
    }
  }

  const handleDeclineRequest = async (requestId: string) => {
    const request = requests.find(r => r.id === requestId)
    const reason = declineReason.trim() || 'No reason provided.'

    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/documents/approve', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          documentRequestId: requestId,
          action: 'decline',
          reason,
          approvedBy: request?.requester_id || request?.resident_id || null,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok || payload?.error) {
        throw new Error(payload?.error || 'Failed to decline request')
      }

      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'declined', pickup_time: null, rejection_reason: reason } : r
      ))
      setShowDeclineDialog(false)
      setSelectedRequest(null)
      setDeclineReason('')
      toast.success('Request declined successfully')
    } catch (error) {
      console.error('Error declining request:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to decline request')
    }
  }

  const handlePrintAndAutofill = (request: DocumentRequest) => {
    setSelectedPrintRequest(request)
  }

  const addRequirementItem = () => {
    const requirement = requirementInput.trim()
    if (!requirement) return
    if (selectedRequirements.includes(requirement)) {
      toast.error('This requirement is already added')
      return
    }
    setSelectedRequirements(prev => [...prev, requirement])
    setRequirementInput("")
  }

  const removeRequirementItem = (requirement: string) => {
    setSelectedRequirements(prev => prev.filter(item => item !== requirement))
  }

  const toggleRequirementItem = (requirement: string, checked: boolean) => {
    if (checked) {
      setSelectedRequirements(prev => prev.includes(requirement) ? prev : [...prev, requirement])
    } else {
      setSelectedRequirements(prev => prev.filter(item => item !== requirement))
    }
  }

  useEffect(() => {
    if (!selectedPrintRequest) return

    const timeout = window.setTimeout(() => {
      printElementById("print-certification-content")
      setSelectedPrintRequest(null)
    }, 150)

    return () => window.clearTimeout(timeout)
  }, [selectedPrintRequest])

  const handleReleaseDocument = async (requestId: string) => {
    const request = requests.find(r => r.id === requestId)

    try {
      const res = await fetch('/api/documents/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentRequestId: requestId })
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || `Failed to release: ${res.status}`)
      }

      const payload = await res.json()
      if (payload?.error) {
        throw new Error(payload.error)
      }

      const releaseDate = new Date().toISOString()
      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'released', release_date: releaseDate } : r
      ))
      toast.success('Document marked as released')
    } catch (error) {
      console.error('Error releasing document:', error)
      toast.error('Failed to release document')
    }
  }

  const filteredRequests = requests.filter(r =>
    r.request_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.requester_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = requests.filter(r => r.status === "pending").length
  const approvedCount = requests.filter(r => r.status === "approved" || r.status === "ready_to_print").length
  const releasedCount = requests.filter(r => r.status === "released").length

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const selectedRequestRequirements = getRequirementsForRequest(selectedRequest)
  const printIssuedDate = new Date()
  const certificatePreview = selectedPrintRequest
    ? getDocumentPreviewTemplate(selectedPrintRequest.type, printIssuedDate)
    : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Document Requests</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Process and manage document requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowManageTypes(true)}>
            <Settings className="h-3 w-3 md:mr-2" />
            <span className="hidden md:inline">Manage Types</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-amber-100 p-1.5 md:p-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{pendingCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-emerald-100 p-1.5 md:p-2">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{approvedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-blue-100 p-1.5 md:p-2">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-blue-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{releasedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Released</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{requests.length}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search requests..." 
          className="pl-10 h-9 md:h-10 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Requests Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Document Requests</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {requests.length === 0 ? "No document requests yet" : `${filteredRequests.length} request${filteredRequests.length !== 1 ? 's' : ''} found`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No document requests</p>
                <p className="text-sm">Requests will appear here once residents submit them</p>
              </div>
            ) : (
              <Tabs defaultValue="pending">
                <TabsList className="h-10 w-full justify-start overflow-x-auto bg-muted/50 p-1">
                  <TabsTrigger value="pending" className="relative text-sm px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Pending ({pendingCount})
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="relative text-sm px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    For Pickup ({approvedCount})
                  </TabsTrigger>
                  <TabsTrigger value="all" className="relative text-sm px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    All ({requests.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-3 md:mt-4">
                  <RequestsTable 
                    requests={filteredRequests.filter(r => r.status === "pending")}
                    onView={(r) => { setSelectedRequest(r); setShowApproveDialog(false); setShowDeclineDialog(false); }}
                    onApprove={(r) => { setSelectedRequest(r); setShowApproveDialog(true); setShowDeclineDialog(false); }}
                    onDecline={(r) => { setSelectedRequest(r); setDeclineReason(''); setShowApproveDialog(false); setShowDeclineDialog(true); }}
                    formatDate={formatDate}
                    showApproveButton
                    showDeclineButton
                  />
                </TabsContent>

                <TabsContent value="approved" className="mt-3 md:mt-4">
                  <RequestsTable 
                    requests={filteredRequests.filter(r => r.status === "approved" || r.status === "ready_to_print")}
                    onView={setSelectedRequest}
                    onPrint={handlePrintAndAutofill}
                    onRelease={handleReleaseDocument}
                    formatDate={formatDate}
                    showPrintButton
                    showReleaseButton
                  />
                </TabsContent>

                <TabsContent value="all" className="mt-3 md:mt-4">
                  <RequestsTable 
                    requests={filteredRequests}
                    onView={setSelectedRequest}
                    onPrint={handlePrintAndAutofill}
                    formatDate={formatDate}
                    showPrintButton
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Request Details Modal */}
      <Dialog open={!!selectedRequest && !showApproveDialog && !showDeclineDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="w-[95vw] sm:w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>Request #{selectedRequest?.request_number}</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedRequest.type}</h3>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div className="grid gap-3 grid-cols-1">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Purpose</p>
                  <p className="font-medium text-sm">{selectedRequest.purpose}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Resident Uploads</p>
                  {loadingRequestUploads ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading uploads...
                    </div>
                  ) : selectedRequestUploads.length > 0 ? (
                    <div className="mt-1 space-y-2">
                      {selectedRequestUploads.map((upload: any) => {
                        const uploadStatus = String(upload.upload_status || upload.status || upload.uploadState || 'uploaded').toLowerCase()
                        const statusLabel = uploadStatus === 'uploaded' ? 'Uploaded' : uploadStatus === 'pending' ? 'Pending' : uploadStatus === 'failed' ? 'Failed' : uploadStatus
                        const filePath = upload.file_path || upload.storage_path || ''
                        const fileName = upload.file_name || upload.file_path || 'Uploaded file'
                        const isImage = ['jpg','jpeg','png','gif','webp'].includes(String(fileName).split('.').pop()?.toLowerCase() || '')
                        const resolvedFileUrl = upload.file_url || (filePath ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resident-uploads/${encodeURIComponent(filePath)}` : '')

                        return (
                          <div key={upload.id} className="rounded-md border border-slate-200 bg-white px-2 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-slate-700 truncate">{fileName}</p>
                              {isImage && resolvedFileUrl ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => setSelectedPreviewDoc({ requirement: upload.requirement_name || 'Uploaded file', name: fileName, url: resolvedFileUrl })}
                                >
                                  View
                                </Button>
                              ) : null}
                            </div>
                            <p className="text-[11px] text-slate-500 break-all">{upload.file_path || 'No file path available'}</p>
                            <Badge variant={uploadStatus === 'uploaded' ? 'default' : uploadStatus === 'pending' ? 'secondary' : 'outline'} className="mt-1 text-[10px]">
                              {statusLabel}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">No uploads found for this request.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={(open) => {
        setShowApproveDialog(open)
        if (!open) {
          setSelectedRequest(null)
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Approve document request from {selectedRequest?.requester_name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Are you sure you want to approve this {selectedRequest?.type} request?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => selectedRequest && handleApproveRequest(selectedRequest.id)}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={(open) => {
        setShowDeclineDialog(open)
        if (!open) {
          setSelectedRequest(null)
          setDeclineReason('')
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Decline Request</DialogTitle>
            <DialogDescription>
              Decline document request from {selectedRequest?.requester_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm">
              Please provide a reason for declining this {selectedRequest?.type} request.
            </p>
            <Textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Example: Incomplete requirements or invalid supporting documents."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclineDialog(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => selectedRequest && handleDeclineRequest(selectedRequest.id)}
            >
              Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Types Dialog */}
      <Dialog open={showManageTypes} onOpenChange={setShowManageTypes}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Document Types</DialogTitle>
            <DialogDescription>Manage document types, fees, and requirements</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {documentTypes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="text-sm font-medium">No document types yet.</p>
                <p className="text-sm text-muted-foreground">Create a document type and select the required documents for it.</p>
              </div>
            ) : (
              documentTypes.map((type) => (
                <div key={type.id} className={`p-4 border rounded-lg transition-opacity ${!type.isActive ? 'opacity-50 bg-muted' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <p className="font-medium flex items-center gap-2">
                        {type.name}
                        {!type.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{(Array.isArray((type as any).requirements) ? (type as any).requirements.join(', ') : String((type as any).requirements || ''))}</p>
                    </div>
                    <Badge variant="outline">PHP {type.fee}</Badge>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={() => openEditDialog(type)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={() => handleDeactivateType(type.id)}
                    >
                      {type.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={() => handleDeleteType(type.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowManageTypes(false)}>Close</Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowAddTypeDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Type Dialog */}
      <Dialog open={showAddTypeDialog || !!editingType} onOpenChange={closeTypeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingType ? 'Edit Document Type' : 'Add New Document Type'}</DialogTitle>
            <DialogDescription>
              {editingType ? 'Update the document type details' : 'Create a new document type for residents to request'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Document Type Name</label>
              <Input
                placeholder="e.g., Barangay Clearance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Requirements</label>
              <div className="mt-2 space-y-3">
                <p className="text-sm text-muted-foreground">Choose one or more required documents for this type. One requirement is enough if that is all the document needs.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {REQUIREMENT_CHOICES.map((requirement) => (
                    <label key={requirement} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 cursor-pointer">
                      <Checkbox
                        checked={selectedRequirements.includes(requirement)}
                        onCheckedChange={(checked) => toggleRequirementItem(requirement, Boolean(checked))}
                      />
                      <span className="text-sm">{requirement}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Add custom requirement"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={addRequirementItem} className="h-9">
                    Add
                  </Button>
                </div>
                {selectedRequirements.length > 0 && (
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm font-medium mb-2">Selected requirements</p>
                    <div className="space-y-2">
                      {selectedRequirements.map((requirement) => (
                        <div key={requirement} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2">
                          <span className="text-sm">{requirement}</span>
                          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => removeRequirementItem(requirement)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Fee (PHP)</label>
              <Input
                placeholder="e.g., 50 or Free"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeTypeDialog}>Cancel</Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={editingType ? handleEditType : handleAddType}
              disabled={savingType}
            >
              {savingType ? (editingType ? 'Updating...' : 'Saving...') : editingType ? 'Update Type' : 'Add Type'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* Print Content - Residency Certificate Template */}
      {selectedPrintRequest && (
        <div id="print-certification-content" className="hidden print:block bg-white">
          <style>{`
            @page {
              size: A4 portrait;
              margin: 0;
            }
            #print-certification-content {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              padding: 10mm;
              font-family: 'Times New Roman', Georgia, serif;
              color: #000;
              background-color: #fff;
              box-sizing: border-box;
            }
            .cert-container {
              width: 100%;
              min-height: 277mm;
              border: 2px solid #000;
              padding: 8mm;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
            }
            .cert-header {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6mm;
              border-bottom: 1px solid #000;
              padding-bottom: 3mm;
              margin-bottom: 4mm;
              text-align: center;
            }
            .logo {
              width: 16mm;
              height: 16mm;
              object-fit: contain;
            }
            .header-text {
              flex: 1;
              font-size: 10pt;
              line-height: 1.3;
            }
            .cert-title {
              text-align: center;
              font-size: 18pt;
              font-weight: bold;
              letter-spacing: 0.12em;
              margin: 4mm 0 3mm;
              text-transform: uppercase;
            }
            .cert-subtitle {
              text-align: center;
              font-size: 11pt;
              margin-bottom: 6mm;
              font-weight: 600;
            }
            .cert-content {
              flex: 1;
              font-size: 12pt;
              line-height: 1.8;
              text-align: justify;
              padding: 0 6mm;
            }
            .cert-content p {
              margin: 0 0 4mm;
            }
            .blank-line {
              display: inline-block;
              min-width: 36mm;
              border-bottom: 1px solid #000;
              margin: 0 1mm;
              vertical-align: bottom;
            }
            .cert-footer {
              margin-top: 10mm;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 3mm;
            }
            .signature-line {
              display: none;
            }
            .officer-title {
              font-size: 11pt;
              font-weight: 700;
              text-align: center;
            }
            .officer-role {
              font-size: 10pt;
              text-align: center;
            }
            .details-row {
              width: 100%;
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 3mm;
              font-size: 9pt;
              margin-top: 6mm;
            }
            .detail-box {
              border-top: none;
              padding-top: 2mm;
              text-align: center;
            }
          `}</style>

          <div className="cert-container">
            <div className="cert-header">
              <img src="/logos/saz-logo.png" alt="Municipality Seal" className="logo" />
              <div className="header-text">
                <p><strong>Republic of the Philippines</strong></p>
                <p>Province of Zambales</p>
                <p>Municipality of San Antonio</p>
                <p><strong>Barangay Santiago</strong></p>
                <p><strong>Office of the Barangay Captain</strong></p>
              </div>
              <img src="/logos/santiago-logo.png" alt="Barangay Santiago Logo" className="logo" />
            </div>

            <div className="cert-title">
              {certificatePreview?.title || selectedPrintRequest.type || 'Resident Request'}
            </div>

            <div className="cert-subtitle">
              TO WHOM IT MAY CONCERN:
            </div>

            <div className="cert-content">
              {certificatePreview?.paragraphs || (
                <>
                  <p>
                    This is to certify that <strong>{selectedPrintRequest.requester_name || '________________________'}</strong>, a bonafide resident of Barangay Santiago, San Antonio, Zambales, is residing at <strong>{selectedPrintRequest.purok || '________________________'}</strong>.
                  </p>

                  <p>
                    This certification is issued upon the request of the above-mentioned person for the purpose of <strong>{selectedPrintRequest.purpose || '________________________'}</strong>.
                  </p>

                  <p>
                    Issued this <strong>{printIssuedDate.getDate()}</strong> day of <strong>{printIssuedDate.toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>{printIssuedDate.getFullYear()}</strong>.
                  </p>
                </>
              )}
            </div>

            <div className="cert-footer">
              <div className="signature-line" />
              <p className="officer-title">ROLANDO C. BORJA</p>
              <p className="officer-role">Punong Barangay</p>

              <div className="details-row">
                <div className="detail-box">Control No.: {selectedPrintRequest.control_number || selectedPrintRequest.request_number || '________'}</div>
                <div className="detail-box">Request No.: {selectedPrintRequest.request_number || '________'}</div>
                <div className="detail-box">Date Issued: {formatDate(printIssuedDate.toISOString())}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div id="print-requirement-summary-content" className="hidden print:block">
        <div className="p-6 text-black">
          <h1 className="text-xl font-bold mb-2">Document Requirement Summary</h1>
          <p className="text-sm text-slate-600 mb-4">Request #{selectedPrintRequest?.request_number || selectedRequest?.request_number || 'N/A'}</p>
          <div className="space-y-3">
            {(() => {
              const requirementDefinitions = getRequirementsForRequest(selectedRequest)
              const uploadedRequirementNames = Array.from(new Set(selectedRequestUploads.map((upload: any) => String(upload.requirement_name || '')).filter(Boolean)))
              const requirementsToShow = requirementDefinitions.length > 0 ? requirementDefinitions : uploadedRequirementNames

              return requirementsToShow.map((requirement: string) => {
                const uploads = selectedRequestUploads.filter(
                  (upload: any) => String(upload.requirement_name || '').toLowerCase() === requirement.toLowerCase()
                )

                return (
                  <div key={requirement} className="border rounded-lg p-3">
                    <p className="font-semibold">{requirement}</p>
                    {uploads.length > 0 ? (
                      <ul className="mt-2 list-disc pl-5 text-sm">
                        {uploads.map((upload: any) => (
                          <li key={upload.id}>{upload.file_name || upload.file_path || 'Uploaded file'}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">No files uploaded for this requirement yet.</p>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      <Dialog open={!!selectedPreviewDoc} onOpenChange={() => setSelectedPreviewDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col">
          <DialogHeader className="border-b p-4">
            <DialogTitle className="flex items-center gap-2">
              📄 {selectedPreviewDoc?.requirement || selectedPreviewDoc?.name || 'Document Preview'}
            </DialogTitle>
            <DialogDescription>
              {selectedPreviewDoc?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
            {selectedPreviewDoc?.url ? (
              getFileType(selectedPreviewDoc.url) === 'image' ? (
                <div className="bg-white rounded-lg shadow-lg max-w-full max-h-full overflow-auto">
                  <img
                    src={selectedPreviewDoc.url}
                    alt={selectedPreviewDoc.name || 'Document preview'}
                    className="max-w-full h-auto"
                  />
                </div>
              ) : getFileType(selectedPreviewDoc.url) === 'pdf' ? (
                <div className="bg-white rounded-lg shadow-lg w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">📕</div>
                    <p className="text-slate-600 font-medium">{selectedPreviewDoc.name}</p>
                    <p className="text-slate-500 text-sm mb-4">PDF preview not supported in browser</p>
                    <a
                      href={selectedPreviewDoc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      Open PDF in New Tab
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <p>Preview not available for this file type</p>
                </div>
              )
            ) : (
              <p className="text-slate-500">No file available to preview</p>
            )}
          </div>

          <DialogFooter className="border-t p-4">
            {selectedPreviewDoc?.url && (
              <a
                href={selectedPreviewDoc.url}
                target="_blank"
                rel="noreferrer"
                className="mr-auto text-xs font-semibold text-primary hover:underline"
              >
                Download File
              </a>
            )}
            <Button variant="outline" onClick={() => setSelectedPreviewDoc(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  )
}

function RequestsTable({ 
  requests, 
  onView,
  onApprove,
  onDecline,
  onPrint,
  onRelease,
  formatDate,
  showApproveButton,
  showDeclineButton,
  showPrintButton,
  showReleaseButton
}: { 
  requests: DocumentRequest[]
  onView: (r: DocumentRequest) => void
  onApprove?: (r: DocumentRequest) => void
  onDecline?: (r: DocumentRequest) => void
  onPrint?: (r: DocumentRequest) => void
  onRelease?: (id: string) => void
  formatDate: (d: string | null) => string
  showApproveButton?: boolean
  showDeclineButton?: boolean
  showPrintButton?: boolean
  showReleaseButton?: boolean
}) {
  const canPrintRequest = (status: string) => ['approved', 'ready_to_print'].includes(status)

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No requests found</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile card list - visible on small screens */}
      <div className="space-y-3 sm:hidden">
        {requests.map((request) => (
          <div key={request.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{request.request_number} — {request.type}</p>
                <p className="text-xs text-slate-600 truncate">{request.requester_name}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDate(request.created_at)}</p>
              </div>
              <div className="shrink-0">
                {getStatusBadge(request.status)}
              </div>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(request)}>View</Button>
              {showApproveButton && onApprove && (
                <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => onApprove(request)}>Approve</Button>
              )}
              {showDeclineButton && onDecline && (
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => onDecline(request)}>Decline</Button>
              )}
              {showPrintButton && onPrint && canPrintRequest(request.status) && (
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => onPrint(request)}>Print</Button>
              )}
              {showReleaseButton && onRelease && (
                <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => onRelease(request.id)}>Release</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/table view - hidden on small screens */}
      <div className="hidden sm:block rounded-md border overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs md:text-sm">Request ID</TableHead>
            <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
            <TableHead className="text-xs md:text-sm hidden md:table-cell">Requester</TableHead>
            <TableHead className="text-xs md:text-sm">Status</TableHead>
            <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{request.request_number}</TableCell>
              <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{request.type}</TableCell>
              <TableCell className="py-2 md:py-4 hidden md:table-cell">
                <p className="font-medium text-xs md:text-sm">{request.requester_name}</p>
              </TableCell>
              <TableCell className="py-2 md:py-4">{getStatusBadge(request.status)}</TableCell>
              <TableCell className="py-2 md:py-4 text-right">
                <div className="flex gap-1 md:gap-2 justify-end">
                  <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs" onClick={() => onView(request)}>
                    <Eye className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">View</span>
                  </Button>
                  {showApproveButton && onApprove && (
                    <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => onApprove(request)}>
                      <CheckCircle2 className="h-3 w-3 md:mr-1" />
                      <span className="hidden md:inline">Approve</span>
                    </Button>
                  )}
                  {showDeclineButton && onDecline && (
                    <Button size="sm" variant="destructive" className="h-7 md:h-8 px-2 md:px-3 text-xs" onClick={() => onDecline(request)}>
                      <XCircle className="h-3 w-3 md:mr-1" />
                      <span className="hidden md:inline">Decline</span>
                    </Button>
                  )}
                  {showPrintButton && onPrint && canPrintRequest(request.status) && (
                    <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-blue-600 hover:bg-blue-700" onClick={() => onPrint(request)}>
                      <Printer className="h-3 w-3" />
                      <span className="hidden md:inline">Print</span>
                    </Button>
                  )}
                  {showReleaseButton && onRelease && (
                    <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => onRelease(request.id)}>
                      <CheckCircle2 className="h-3 w-3" />
                      <span className="hidden md:inline">Release</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </>
  )
}
