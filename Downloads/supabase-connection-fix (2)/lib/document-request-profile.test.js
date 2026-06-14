const test = require('node:test')
const assert = require('node:assert/strict')
const { buildRequesterProfilePayload, formatResidentName } = require('./document-request-profile')

test('buildRequesterProfilePayload captures resident identity fields', () => {
  const payload = buildRequesterProfilePayload({
    first_name: 'Juan',
    middle_name: 'Santos',
    last_name: 'Dela Cruz',
    suffix: 'Jr.',
    purok: 'Purok 2',
    civil_status: 'Single',
    email: 'juan@example.com',
  })

  assert.equal(payload.requester_full_name, 'Juan Santos Dela Cruz Jr.')
  assert.equal(payload.requester_first_name, 'Juan')
  assert.equal(payload.requester_middle_name, 'Santos')
  assert.equal(payload.requester_last_name, 'Dela Cruz')
  assert.equal(payload.requester_purok, 'Purok 2')
  assert.equal(payload.requester_civil_status, 'Single')
  assert.equal(payload.requester_email, 'juan@example.com')
})

test('formatResidentName uses available name parts and falls back safely', () => {
  assert.equal(formatResidentName({ first_name: 'Maria', middle_name: 'L.', last_name: 'Reyes' }), 'Maria L. Reyes')
  assert.equal(formatResidentName({ full_name: 'Resident User' }), 'Resident User')
  assert.equal(formatResidentName(null), 'Resident')
})
