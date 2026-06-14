import test from 'node:test'
import assert from 'node:assert/strict'
import { buildProfileImageStoragePath, buildProfileImageUploadPayload } from '../lib/profile-upload.js'

test('buildProfileImageStoragePath includes the user id and file name', () => {
  const path = buildProfileImageStoragePath('user-123', 'avatar.png')
  assert.match(path, /^profiles\/user-123\//)
  assert.match(path, /avatar\.png$/)
})

test('buildProfileImageUploadPayload includes the expected metadata', () => {
  const payload = buildProfileImageUploadPayload({
    userId: 'user-123',
    fileName: 'avatar.png',
    fileType: 'image/png',
    fileSize: 2048,
    storagePath: 'profiles/user-123/avatar.png',
    publicUrl: 'https://example.com/avatar.png',
  })

  assert.equal(payload.requirement_name, 'profile_photo')
  assert.equal(payload.file_name, 'avatar.png')
  assert.equal(payload.file_type, 'image/png')
  assert.equal(payload.file_size, 2048)
  assert.equal(payload.file_url, 'https://example.com/avatar.png')
})
