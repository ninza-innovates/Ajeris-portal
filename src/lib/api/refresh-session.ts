import { API_ENDPOINTS } from './config'

export interface RefreshedSession {
  token: string
  refreshToken?: string
}

function readString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/**
 * Read the new access token from a refresh response.
 *
 * The admin API returns `access_token`. The API client renames that to
 * `accessToken` before the auth store reads it. Some payloads use `token`.
 */
export function readRefreshedSession(payload: unknown): RefreshedSession | null {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return null

  const record = payload as Record<string, unknown>
  const token =
    readString(record.token) ??
    readString(record.accessToken) ??
    readString(record.access_token)

  if (!token) return null

  const refreshToken = readString(record.refreshToken) ?? readString(record.refresh_token)
  return refreshToken ? { token, refreshToken } : { token }
}

/** A failed refresh call must not start another refresh. */
export function isAuthRefreshRequest(url: string | undefined): boolean {
  if (!url) return false
  return url.includes(API_ENDPOINTS.AUTH.REFRESH)
}
