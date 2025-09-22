// Utility functions to convert between snake_case and camelCase

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

export function convertKeysSnakeToCamel(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysSnakeToCamel(item))
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted: any = {}
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = snakeToCamel(key)
        converted[camelKey] = convertKeysSnakeToCamel(obj[key])
      }
    }
    
    return converted
  }

  return obj
}

export function convertKeysCamelToSnake(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysCamelToSnake(item))
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted: any = {}
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const snakeKey = camelToSnake(key)
        converted[snakeKey] = convertKeysCamelToSnake(obj[key])
      }
    }
    
    return converted
  }

  return obj
}