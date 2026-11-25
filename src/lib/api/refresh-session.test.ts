import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isAuthRefreshRequest, readRefreshedSession } from './refresh-session'

describe('readRefreshedSession', () => {
  it('reads a token field', () => {
    assert.deepEqual(readRefreshedSession({ token: 'abc' }), { token: 'abc' })
  })

  it('reads access_token and a rotated refresh token', () => {
    assert.deepEqual(
      readRefreshedSession({ access_token: 'new-access', refresh_token: 'new-refresh' }),
      { token: 'new-access', refreshToken: 'new-refresh' }
    )
  })

  it('reads camelCase fields produced by the API client', () => {
    assert.deepEqual(
      readRefreshedSession({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
      { token: 'new-access', refreshToken: 'new-refresh' }
    )
  })

  it('rejects an empty or missing access token', () => {
    assert.equal(readRefreshedSession(null), null)
    assert.equal(readRefreshedSession({ token: '   ' }), null)
    assert.equal(readRefreshedSession({ refreshToken: 'only-refresh' }), null)
    assert.equal(readRefreshedSession('abc'), null)
    assert.equal(readRefreshedSession([]), null)
  })
})

describe('isAuthRefreshRequest', () => {
  it('matches the refresh endpoint and ignores other auth calls', () => {
    assert.equal(
      isAuthRefreshRequest('https://api.staging.ajeris.com/api/admin/auth/refresh-token'),
      true
    )
    assert.equal(isAuthRefreshRequest('/auth/login'), false)
    assert.equal(isAuthRefreshRequest(undefined), false)
  })
})
