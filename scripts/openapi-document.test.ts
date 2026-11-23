import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { groupAdminEndpoints, httpMethodList, parseOpenApiPaths } from './openapi-document'

const document = {
  paths: {
    '/api/admin/billing/invoices': {
      parameters: [{ name: 'limit' }],
      summary: 'Path summary',
      post: {
        summary: 'Create invoice',
        operationId: 'createInvoice',
        requestBody: { required: true },
      },
      get: {
        summary: 'List invoices',
        operationId: 'listInvoices',
        tags: ['Billing'],
        parameters: [{ name: 'page', in: 'query' }],
      },
      put: { summary: 12, tags: ['ok', 1], operationId: 'updateInvoice', requestBody: false },
      delete: 'nope',
      servers: [{ url: 'https://example.test' }],
    },
    '/api/admin/': {
      get: { summary: 'Admin root' },
    },
    '/api/admin/reports': 'broken',
    '/health': {
      get: { summary: 'Health' },
    },
  },
}

describe('parseOpenApiPaths', () => {
  it('rejects an empty document the way property access would', () => {
    assert.throws(() => parseOpenApiPaths(null), /OpenAPI document/)
    assert.throws(() => parseOpenApiPaths(undefined), /OpenAPI document/)
  })

  it('returns no paths when the document or paths field is not an object', () => {
    assert.deepEqual(parseOpenApiPaths('not-json'), {})
    assert.deepEqual(parseOpenApiPaths({}), {})
    assert.deepEqual(parseOpenApiPaths({ paths: null }), {})
    assert.deepEqual(parseOpenApiPaths({ paths: ['/admin/users'] }), {})
  })

  it('keeps HTTP operations in source order and drops non-method fields', () => {
    const paths = parseOpenApiPaths(document)
    const invoices = paths['/api/admin/billing/invoices']

    assert.equal(httpMethodList(invoices), 'POST, GET, PUT')
    assert.equal(paths['/api/admin/reports'], undefined)
    assert.equal(paths['/health']?.operations[0]?.operation.summary, 'Health')
  })
})

describe('groupAdminEndpoints', () => {
  it('groups admin paths by the segment after admin and skips other paths', () => {
    const grouped = groupAdminEndpoints(parseOpenApiPaths(document))

    assert.deepEqual(Object.keys(grouped), ['billing', 'general'])
    assert.deepEqual(grouped.billing, [
      {
        path: '/api/admin/billing/invoices',
        method: 'POST',
        summary: 'Create invoice',
        operationId: 'createInvoice',
        tags: [],
        parameters: [],
        requestBody: true,
      },
      {
        path: '/api/admin/billing/invoices',
        method: 'GET',
        summary: 'List invoices',
        operationId: 'listInvoices',
        tags: ['Billing'],
        parameters: [{ name: 'page', in: 'query' }],
        requestBody: false,
      },
      {
        path: '/api/admin/billing/invoices',
        method: 'PUT',
        summary: '',
        operationId: 'updateInvoice',
        tags: [],
        parameters: [],
        requestBody: false,
      },
    ])
    assert.deepEqual(grouped.general, [
      {
        path: '/api/admin/',
        method: 'GET',
        summary: 'Admin root',
        operationId: '',
        tags: [],
        parameters: [],
        requestBody: false,
      },
    ])
  })
})
