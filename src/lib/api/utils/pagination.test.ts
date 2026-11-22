import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { mapPaginatedResponse } from '../response-mappers'
import { resolvePaginationMeta } from './pagination'

describe('resolvePaginationMeta', () => {
  it('derives hasMore when the API omits has_more but more rows exist', () => {
    const meta = resolvePaginationMeta(
      {
        data: [{ id: 1 }, { id: 2 }],
        page: 1,
        items_per_page: 10,
        total_count: 45,
      },
      { defaultLimit: 10, totalFallback: 2 }
    )

    assert.deepEqual(meta, {
      page: 1,
      limit: 10,
      total: 45,
      hasMore: true,
      totalPages: 5,
    })
  })

  it('reports the last page as having no further rows', () => {
    const meta = resolvePaginationMeta({
      page: 5,
      items_per_page: 10,
      total_count: 45,
    })

    assert.equal(meta.hasMore, false)
    assert.equal(meta.totalPages, 5)
  })

  it('keeps an explicit has_more value from the API', () => {
    assert.equal(
      resolvePaginationMeta({ page: 1, limit: 10, total_count: 45, has_more: false }).hasMore,
      false
    )
    assert.equal(
      resolvePaginationMeta({ page: 2, limit: 10, total_count: 15, hasMore: true }).hasMore,
      true
    )
  })

  it('uses the resolved page size when total_pages is omitted', () => {
    const meta = resolvePaginationMeta(
      { page: '1', limit: '25', total_count: '100' },
      { defaultLimit: 10, totalFallback: 0 }
    )

    assert.equal(meta.page, 1)
    assert.equal(meta.limit, 25)
    assert.equal(meta.total, 100)
    assert.equal(meta.totalPages, 4)
    assert.equal(meta.hasMore, true)
  })

  it('prefers items_per_page over limit, matching the list response', () => {
    const meta = resolvePaginationMeta({
      items_per_page: 10,
      limit: 25,
      total_count: 30,
    })

    assert.equal(meta.limit, 10)
    assert.equal(meta.totalPages, 3)
  })

  it('reads camelCase pagination nested under meta', () => {
    const meta = resolvePaginationMeta(
      {
        data: [{ id: 'a' }],
        meta: { currentPage: 2, pageSize: 20, totalCount: 41 },
      },
      { defaultLimit: 20, totalFallback: 0 }
    )

    assert.deepEqual(meta, {
      page: 2,
      limit: 20,
      total: 41,
      hasMore: true,
      totalPages: 3,
    })
  })

  it('falls back when the payload has no pagination fields', () => {
    const meta = resolvePaginationMeta(null, { defaultLimit: 10, totalFallback: 0 })

    assert.deepEqual(meta, {
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false,
      totalPages: 0,
    })
  })
})

describe('mapPaginatedResponse', () => {
  it('enables hasMore from currentPage, pageSize, and totalCount', () => {
    const mapped = mapPaginatedResponse(
      {
        data: [{ id: '1' }, { id: '2' }],
        meta: { currentPage: 1, pageSize: 2, totalCount: 5 },
      },
      (item: { id: string }) => item.id
    )

    assert.deepEqual(mapped, {
      data: ['1', '2'],
      meta: { page: 1, limit: 2, total: 5, hasMore: true },
    })
  })

  it('does not invent another page for a bare list', () => {
    const mapped = mapPaginatedResponse([{ id: 'only' }], (item: { id: string }) => item)

    assert.equal(mapped.meta.hasMore, false)
    assert.equal(mapped.meta.total, 1)
    assert.equal(mapped.data.length, 1)
  })
})
