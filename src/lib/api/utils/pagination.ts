export interface PaginationMeta {
  page: number
  limit: number
  total: number
  hasMore: boolean
  totalPages: number
}

export interface ResolvePaginationOptions {
  /** Used when the payload does not include a positive total. */
  totalFallback?: number
  /** Used when the payload does not include a positive page size. */
  defaultLimit?: number
}

const PAGE_KEYS = ['page', 'currentPage', 'current_page'] as const
const LIMIT_KEYS = [
  'itemsPerPage',
  'items_per_page',
  'limit',
  'pageSize',
  'page_size',
  'perPage',
  'per_page',
] as const
const TOTAL_KEYS = ['total', 'totalCount', 'total_count'] as const
const TOTAL_PAGES_KEYS = ['totalPages', 'total_pages'] as const
const HAS_MORE_KEYS = ['hasMore', 'has_more'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

/**
 * Nested `meta` / `pagination` objects win over the same fields on the payload.
 * The admin API uses both shapes.
 */
function sources(payload: unknown): Record<string, unknown>[] {
  if (!isRecord(payload)) return []
  const nested = [payload.meta, payload.pagination].filter(isRecord)
  return [...nested, payload]
}

function firstNumber(
  min: number,
  keys: readonly string[],
  records: Record<string, unknown>[]
): number | null {
  for (const record of records) {
    for (const key of keys) {
      const parsed = toFiniteNumber(record[key])
      if (parsed !== null && parsed >= min) return Math.floor(parsed)
    }
  }
  return null
}

function firstBoolean(
  keys: readonly string[],
  records: Record<string, unknown>[]
): boolean | undefined {
  for (const record of records) {
    for (const key of keys) {
      const value = record[key]
      if (typeof value === 'boolean') return value
    }
  }
  return undefined
}

/**
 * Normalize pagination fields from the admin API.
 *
 * `has_more` is optional. When it is omitted, `hasMore` is derived from the
 * page, page size, and total so Next stays enabled while rows remain.
 * An explicit boolean from the API is left unchanged.
 */
export function resolvePaginationMeta(
  payload: unknown,
  options: ResolvePaginationOptions = {}
): PaginationMeta {
  const defaultLimit = Math.max(1, options.defaultLimit ?? 10)
  const totalFallback = Math.max(0, options.totalFallback ?? 0)
  const records = sources(payload)

  const page = firstNumber(1, PAGE_KEYS, records) ?? 1
  const limit = firstNumber(1, LIMIT_KEYS, records) ?? defaultLimit
  const total = firstNumber(1, TOTAL_KEYS, records) ?? totalFallback
  const totalPages = firstNumber(1, TOTAL_PAGES_KEYS, records) ?? Math.ceil(total / limit)
  const explicitHasMore = firstBoolean(HAS_MORE_KEYS, records)
  const hasMore = explicitHasMore ?? page * limit < total

  return { page, limit, total, hasMore, totalPages }
}
