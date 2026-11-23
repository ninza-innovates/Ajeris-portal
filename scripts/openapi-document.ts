/** HTTP methods defined by OpenAPI. Path-item fields such as `parameters` are not methods. */
const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const

type HttpMethod = (typeof HTTP_METHODS)[number]

const HTTP_METHOD_SET: ReadonlySet<string> = new Set(HTTP_METHODS)

export interface OpenApiOperation {
  summary?: string
  operationId?: string
  tags?: string[]
  parameters?: unknown[]
  requestBody?: unknown
}

export interface OpenApiPathItem {
  parameters?: unknown[]
  /** HTTP operations in the order they appear on the path item. */
  operations: Array<{ method: HttpMethod; operation: OpenApiOperation }>
}

export interface AdminEndpoint {
  path: string
  method: string
  summary: string
  operationId: string
  tags: string[]
  parameters: unknown[]
  requestBody: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isHttpMethod(value: string): value is HttpMethod {
  return HTTP_METHOD_SET.has(value)
}

function isStringArray(value: unknown): value is string[] {
  if (!Array.isArray(value)) return false
  for (const item of value) {
    if (typeof item !== 'string') return false
  }
  return true
}

function unknownArray(value: unknown): unknown[] | undefined {
  if (!Array.isArray(value)) return undefined
  return [...value]
}

function parseOperation(value: unknown): OpenApiOperation | undefined {
  if (!isRecord(value)) return undefined

  const operation: OpenApiOperation = {}
  if (typeof value.summary === 'string') operation.summary = value.summary
  if (typeof value.operationId === 'string') operation.operationId = value.operationId
  if (isStringArray(value.tags)) operation.tags = value.tags

  const parameters = unknownArray(value.parameters)
  if (parameters) operation.parameters = parameters
  if ('requestBody' in value) operation.requestBody = value.requestBody

  return operation
}

function parsePathItem(value: unknown): OpenApiPathItem | undefined {
  if (!isRecord(value)) return undefined

  const pathItem: OpenApiPathItem = { operations: [] }
  const parameters = unknownArray(value.parameters)
  if (parameters) pathItem.parameters = parameters

  for (const [key, child] of Object.entries(value)) {
    if (!isHttpMethod(key)) continue
    const operation = parseOperation(child)
    if (!operation) continue
    pathItem.operations.push({ method: key, operation })
  }

  return pathItem
}

/**
 * Read `paths` from an OpenAPI document.
 * A null or undefined document throws, matching property access on an empty body.
 * Any other non-object document or `paths` value yields no paths.
 */
export function parseOpenApiPaths(data: unknown): Record<string, OpenApiPathItem> {
  if (data == null) {
    throw new TypeError('Cannot read OpenAPI document')
  }

  if (!isRecord(data) || data.paths == null || !isRecord(data.paths)) {
    return {}
  }

  const parsed: Record<string, OpenApiPathItem> = {}
  for (const [path, pathItem] of Object.entries(data.paths)) {
    const parsedItem = parsePathItem(pathItem)
    if (parsedItem) parsed[path] = parsedItem
  }
  return parsed
}

function categoryFromAdminPath(path: string): string {
  const pathParts = path.split('/')
  const adminIndex = pathParts.indexOf('admin')
  return pathParts[adminIndex + 1] || 'general'
}

export function httpMethodList(pathItem: OpenApiPathItem): string {
  return pathItem.operations.map((entry) => entry.method.toUpperCase()).join(', ')
}

export function groupAdminEndpoints(
  paths: Record<string, OpenApiPathItem>
): Record<string, AdminEndpoint[]> {
  const adminEndpoints: Record<string, AdminEndpoint[]> = {}

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!path.includes('/admin/')) continue

    const category = categoryFromAdminPath(path)
    if (!adminEndpoints[category]) adminEndpoints[category] = []

    for (const { method, operation } of pathItem.operations) {
      adminEndpoints[category].push({
        path,
        method: method.toUpperCase(),
        summary: operation.summary ?? '',
        operationId: operation.operationId ?? '',
        tags: operation.tags ?? [],
        parameters: operation.parameters ?? [],
        requestBody: Boolean(operation.requestBody),
      })
    }
  }

  return adminEndpoints
}
