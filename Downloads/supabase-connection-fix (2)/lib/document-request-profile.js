function formatResidentName(profile, fallback = 'Resident') {
  if (!profile) return fallback

  const nameParts = [
    profile.first_name,
    profile.middle_name,
    profile.last_name,
    profile.suffix,
  ].filter(Boolean)

  if (nameParts.length > 0) {
    return nameParts.join(' ').trim()
  }

  const fullName = [profile.full_name, profile.name].find((value) => String(value || '').trim())
  return String(fullName || '').trim() || fallback
}

function buildRequesterProfilePayload(profile, fallbackName = 'Resident') {
  const residentName = formatResidentName(profile, fallbackName)
  const firstName = String(profile?.first_name || '').trim()
  const middleName = String(profile?.middle_name || '').trim()
  const lastName = String(profile?.last_name || '').trim()
  const suffix = String(profile?.suffix || '').trim()
  const fullName = [firstName, middleName, lastName, suffix].filter(Boolean).join(' ').trim() || residentName

  return {
    requester_full_name: fullName,
    requester_first_name: firstName,
    requester_middle_name: middleName,
    requester_last_name: lastName,
    requester_suffix: suffix,
    requester_purok: String(profile?.purok || '').trim(),
    requester_civil_status: String(profile?.civil_status || '').trim(),
    requester_email: String(profile?.email || '').trim(),
  }
}

module.exports = {
  formatResidentName,
  buildRequesterProfilePayload,
}
