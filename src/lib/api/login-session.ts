export interface LoginSessionUser {
  id: string
  email: string
  name: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER'
  avatar?: string
}

export interface LoginSession {
  token: string
  refreshToken?: string
  user?: LoginSessionUser
  permissions?: string[]
}

const ADMIN_ROLES = new Set<LoginSessionUser['role']>(['SUPER_ADMIN', 'ADMIN', 'VIEWER'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function readRole(value: unknown): LoginSessionUser['role'] {
  const role = readString(value)
  if (role && ADMIN_ROLES.has(role as LoginSessionUser['role'])) {
    return role as LoginSessionUser['role']
  }
  return 'ADMIN'
}

/**
 * The admin login API returns `access_token` and does not include an account.
 * Copy only identity fields the payload actually contains. Callers that need a
 * display name can fall back to the email that was submitted.
 */
function readUser(value: unknown): LoginSessionUser | undefined {
  if (!isRecord(value)) return undefined

  const id = readString(value.id)
  const email = readString(value.email)
  const name = readString(value.name) ?? email
  if (!id || !email || !name) return undefined

  const avatar = readString(value.avatar)
  const user: LoginSessionUser = {
    id,
    email,
    name,
    role: readRole(value.role),
  }
  if (avatar) user.avatar = avatar
  return user
}

function readPermissions(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const permissions = value.filter((item): item is string => readString(item) !== undefined)
  return permissions.length > 0 ? permissions : undefined
}

/**
 * Normalize a login response.
 *
 * The staging admin API returns `{ access_token, token_type, message }`.
 * The API client may already have renamed `access_token` to `accessToken`.
 * A refresh token or user is included only when the payload has one.
 */
export function readLoginSession(payload: unknown): LoginSession | null {
  if (!isRecord(payload)) return null

  const token =
    readString(payload.token) ??
    readString(payload.accessToken) ??
    readString(payload.access_token)

  if (!token) return null

  const refreshToken = readString(payload.refreshToken) ?? readString(payload.refresh_token)
  const user = readUser(payload.user)
  const permissions = readPermissions(payload.permissions)

  return {
    token,
    ...(refreshToken ? { refreshToken } : {}),
    ...(user ? { user } : {}),
    ...(permissions ? { permissions } : {}),
  }
}
