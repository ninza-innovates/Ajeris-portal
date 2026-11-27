import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { readLoginSession } from './login-session'

describe('readLoginSession', () => {
  it('reads the staging login payload without inventing an account', () => {
    assert.deepEqual(
      readLoginSession({
        access_token: 'jwt-access',
        token_type: 'bearer',
        message: 'Admin login successful',
      }),
      { token: 'jwt-access' }
    )
  })

  it('reads camelCase fields produced by the API client', () => {
    assert.deepEqual(
      readLoginSession({
        accessToken: 'jwt-access',
        refreshToken: 'jwt-refresh',
        tokenType: 'bearer',
      }),
      { token: 'jwt-access', refreshToken: 'jwt-refresh' }
    )
  })

  it('keeps a real user and a rotated refresh token', () => {
    assert.deepEqual(
      readLoginSession({
        token: 'jwt-access',
        refresh_token: 'jwt-refresh',
        user: {
          id: 'user-9',
          email: 'clinic@hospital.org',
          name: 'Clinic User',
          role: 'VIEWER',
          avatar: 'https://example.com/avatar.png',
        },
        permissions: ['studies:read', '  ', 3],
      }),
      {
        token: 'jwt-access',
        refreshToken: 'jwt-refresh',
        user: {
          id: 'user-9',
          email: 'clinic@hospital.org',
          name: 'Clinic User',
          role: 'VIEWER',
          avatar: 'https://example.com/avatar.png',
        },
        permissions: ['studies:read'],
      }
    )
  })

  it('uses the account email as the name and defaults an unknown role', () => {
    assert.deepEqual(
      readLoginSession({
        access_token: 'jwt-access',
        user: {
          id: 'user-2',
          email: 'lead@ajeris.com',
          role: 'RAD',
        },
      }),
      {
        token: 'jwt-access',
        user: {
          id: 'user-2',
          email: 'lead@ajeris.com',
          name: 'lead@ajeris.com',
          role: 'ADMIN',
        },
      }
    )
  })

  it('omits a user that has no id or email', () => {
    assert.deepEqual(
      readLoginSession({
        access_token: 'jwt-access',
        user: { name: 'Admin User', email: 'admin@ajeris.com' },
      }),
      { token: 'jwt-access' }
    )
  })

  it('rejects an empty or missing access token', () => {
    assert.equal(readLoginSession(null), null)
    assert.equal(readLoginSession({ access_token: '   ' }), null)
    assert.equal(readLoginSession({ message: 'Admin login successful' }), null)
    assert.equal(readLoginSession('jwt-access'), null)
    assert.equal(readLoginSession([]), null)
  })
})
