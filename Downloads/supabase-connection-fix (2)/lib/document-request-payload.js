const { buildRequesterProfilePayload } = require('./document-request-profile')

function buildDocumentRequestInsertPayload({
  residentId,
  documentType,
  purpose,
  residentProfile,
  controlNumber,
  createdAt = new Date().toISOString(),
  includeRequesterFields = true,
  includeBusinessFields = true,
  createdBy = residentId,
  businessPermitDetails = {},
}) {
  const parsedCapitalizationAmount = businessPermitDetails?.capitalizationAmount
    ? Number(businessPermitDetails.capitalizationAmount)
    : null

  const payload = {
    resident_id: residentId,
    document_type: documentType,
    status: 'pending',
    control_number: controlNumber,
    purpose: purpose || '',
    created_at: createdAt,
    updated_at: createdAt,
    created_by: createdBy,
  }

  if (includeBusinessFields) {
    Object.assign(payload, {
      business_name: businessPermitDetails?.businessName || null,
      business_address: businessPermitDetails?.businessAddress || null,
      owner_name: businessPermitDetails?.ownerName || null,
      home_address: businessPermitDetails?.homeAddress || null,
      contact_number: businessPermitDetails?.contactNumber || null,
      type_of_business: businessPermitDetails?.typeOfBusiness || null,
      nature_of_business: businessPermitDetails?.natureOfBusiness || null,
      capitalization_amount: parsedCapitalizationAmount ?? null,
      tin: businessPermitDetails?.tin || null,
    })
  }

  if (!includeRequesterFields) {
    return payload
  }

  const requesterProfilePayload = buildRequesterProfilePayload(residentProfile || undefined, 'Resident')

  return {
    ...payload,
    requester_name: requesterProfilePayload.requester_full_name || 'Resident',
    requester_first_name: requesterProfilePayload.requester_first_name || null,
    requester_middle_name: requesterProfilePayload.requester_middle_name || null,
    requester_last_name: requesterProfilePayload.requester_last_name || null,
    requester_suffix: requesterProfilePayload.requester_suffix || null,
    requester_purok: requesterProfilePayload.requester_purok || null,
    requester_civil_status: requesterProfilePayload.requester_civil_status || null,
    requester_email: requesterProfilePayload.requester_email || null,
  }
}

module.exports = {
  buildDocumentRequestInsertPayload,
}
