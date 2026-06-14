import test from 'node:test'
import assert from 'node:assert/strict'
import { getAssetAgeLabel } from '../lib/asset-utils.ts'

test('formats asset age in years', () => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 5)

  assert.equal(getAssetAgeLabel(date.toISOString()), '5 years')
})

test('formats asset age in months when it is less than a year old', () => {
  const date = new Date()
  date.setMonth(date.getMonth() - 8)

  assert.match(getAssetAgeLabel(date.toISOString()), /^8 months$/)
})

test('returns a fallback label when no acquisition date exists', () => {
  assert.equal(getAssetAgeLabel(null), 'Age unavailable')
})
