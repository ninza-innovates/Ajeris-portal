export type InvoicePeriod = 'all' | 'this-year' | 'last-year' | 'last-6-months'

interface CalendarDate {
  year: number
  month: number
  day: number
}

function parseCalendarDate(value: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim())
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12) return null

  const lastDay = new Date(year, month, 0).getDate()
  if (day < 1 || day > lastDay) return null

  return { year, month, day }
}

function calendarFromDate(date: Date): CalendarDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

function shiftMonths(date: CalendarDate, months: number): CalendarDate {
  const monthIndex = date.month - 1 + months
  const year = date.year + Math.floor(monthIndex / 12)
  const month = ((monthIndex % 12) + 12) % 12
  const lastDay = new Date(year, month + 1, 0).getDate()

  return {
    year,
    month: month + 1,
    day: Math.min(date.day, lastDay),
  }
}

function compareCalendar(left: CalendarDate, right: CalendarDate): number {
  if (left.year !== right.year) return left.year - right.year
  if (left.month !== right.month) return left.month - right.month
  return left.day - right.day
}

/**
 * Whether an invoice date belongs in the billing period selected in the UI.
 * Dates are read as calendar days so timezone offsets do not move them
 * into the previous year.
 */
export function invoiceMatchesPeriod(
  invoiceDate: string,
  period: string,
  now: Date = new Date()
): boolean {
  if (period === 'all') return true

  const invoice = parseCalendarDate(invoiceDate)
  if (!invoice) return false

  const today = calendarFromDate(now)

  if (period === 'this-year') return invoice.year === today.year
  if (period === 'last-year') return invoice.year === today.year - 1

  if (period === 'last-6-months') {
    const start = shiftMonths(today, -6)
    return compareCalendar(invoice, start) >= 0 && compareCalendar(invoice, today) <= 0
  }

  return true
}
