import test from 'node:test'
import assert from 'node:assert/strict'
import { isMissingAnnouncementImageColumnError } from '../lib/announcement-errors.ts'

test('detects missing image_url column errors', () => {
  const error = new Error("Could not find the 'image_url' column of 'announcements' in the schema cache")
  assert.equal(isMissingAnnouncementImageColumnError(error), true)
})

test('ignores unrelated errors', () => {
  assert.equal(isMissingAnnouncementImageColumnError(new Error('permission denied')), false)
})
