import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  camelToSnake,
  convertKeysCamelToSnake,
  convertKeysSnakeToCamel,
  snakeToCamel,
} from './case-converter'

describe('snakeToCamel', () => {
  it('uppercases the letter after each underscore', () => {
    assert.equal(snakeToCamel('profile_image_url'), 'profileImageUrl')
    assert.equal(snakeToCamel('total_studies'), 'totalStudies')
    assert.equal(snakeToCamel('alreadyCamel'), 'alreadyCamel')
  })
})

describe('camelToSnake', () => {
  it('inserts an underscore before each capital letter', () => {
    assert.equal(camelToSnake('profileImageUrl'), 'profile_image_url')
    assert.equal(camelToSnake('totalStudies'), 'total_studies')
    assert.equal(camelToSnake('already_snake'), 'already_snake')
  })
})

describe('convertKeysSnakeToCamel', () => {
  it('renames nested object and array keys and leaves values alone', () => {
    const payload = {
      total_studies: 19,
      studies_by_status: { RECEIVED: 16, FINAL: 3 },
      recent_activity: [{ created_at: '2025-08-05T10:03:23.735949Z', is_superuser: false }],
      profile_image_url: null,
    }

    assert.deepEqual(convertKeysSnakeToCamel(payload), {
      totalStudies: 19,
      studiesByStatus: { RECEIVED: 16, FINAL: 3 },
      recentActivity: [{ createdAt: '2025-08-05T10:03:23.735949Z', isSuperuser: false }],
      profileImageUrl: null,
    })
  })

  it('returns null, undefined, primitives, and non-plain objects unchanged', () => {
    const createdAt = new Date('2025-08-05T10:03:23.735949Z')
    class Token {
      value = 'secret'
    }
    const token = new Token()

    assert.equal(convertKeysSnakeToCamel(null), null)
    assert.equal(convertKeysSnakeToCamel(undefined), undefined)
    assert.equal(convertKeysSnakeToCamel(0), 0)
    assert.equal(convertKeysSnakeToCamel(false), false)
    assert.equal(convertKeysSnakeToCamel(''), '')
    assert.equal(convertKeysSnakeToCamel(createdAt), createdAt)
    assert.equal(convertKeysSnakeToCamel(token), token)
  })

  it('does not mutate the input object', () => {
    const payload = { user_id: 58, nested: { email_verified: false } }
    const snapshot = structuredClone(payload)

    convertKeysSnakeToCamel(payload)

    assert.deepEqual(payload, snapshot)
  })
})

describe('convertKeysCamelToSnake', () => {
  it('renames request bodies the API client sends outbound', () => {
    assert.deepEqual(
      convertKeysCamelToSnake({
        organizationId: 'org-1',
        startDate: '2026-01-01',
        filters: [{ hasMore: false }],
      }),
      {
        organization_id: 'org-1',
        start_date: '2026-01-01',
        filters: [{ has_more: false }],
      }
    )
  })
})
