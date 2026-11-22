/**
 * Convert API payload keys between snake_case and camelCase.
 *
 * Only plain objects and arrays are walked. Dates, class instances, and
 * other non-plain objects are returned as-is. The generic return type keeps
 * the input type so existing callers stay assignable; the renamed keys are a
 * runtime transform and are not reflected in the type.
 */

function isPlainObject(value: object): value is Record<string, unknown> {
  return value.constructor === Object
}

/**
 * Turn a snake_case identifier into camelCase.
 * A lowercase letter immediately after `_` is uppercased and the underscore is dropped.
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

/**
 * Turn a camelCase identifier into snake_case.
 * Each capital letter is prefixed with `_` and lowercased.
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
}

function convertKeys(value: unknown, convertKey: (key: string) => string): unknown {
  if (value === null || value === undefined) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => convertKeys(item, convertKey))
  }

  if (typeof value === 'object' && isPlainObject(value)) {
    const converted: Record<string, unknown> = {}

    for (const key of Object.keys(value)) {
      converted[convertKey(key)] = convertKeys(value[key], convertKey)
    }

    return converted
  }

  return value
}

/** Recursively rename plain-object keys from snake_case to camelCase. */
export function convertKeysSnakeToCamel<T>(obj: T): T {
  return convertKeys(obj, snakeToCamel) as T
}

/** Recursively rename plain-object keys from camelCase to snake_case. */
export function convertKeysCamelToSnake<T>(obj: T): T {
  return convertKeys(obj, camelToSnake) as T
}
