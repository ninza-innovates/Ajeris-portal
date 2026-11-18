import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { invoiceMatchesPeriod } from './invoice-period'

const now = new Date(2026, 10, 18) // 18 November 2026

describe('invoiceMatchesPeriod', () => {
  it('keeps every invoice when the period is all time', () => {
    assert.equal(invoiceMatchesPeriod('2023-09-15', 'all', now), true)
    assert.equal(invoiceMatchesPeriod('not-a-date', 'all', now), true)
  })

  it('matches the calendar year of the current date', () => {
    assert.equal(invoiceMatchesPeriod('2026-01-01', 'this-year', now), true)
    assert.equal(invoiceMatchesPeriod('2026-11-18', 'this-year', now), true)
    assert.equal(invoiceMatchesPeriod('2025-12-31', 'this-year', now), false)
  })

  it('matches the previous calendar year', () => {
    assert.equal(invoiceMatchesPeriod('2025-01-01', 'last-year', now), true)
    assert.equal(invoiceMatchesPeriod('2025-12-31', 'last-year', now), true)
    assert.equal(invoiceMatchesPeriod('2026-01-01', 'last-year', now), false)
    assert.equal(invoiceMatchesPeriod('2024-12-31', 'last-year', now), false)
  })

  it('matches invoices from the last six months, including the boundary day', () => {
    assert.equal(invoiceMatchesPeriod('2026-05-18', 'last-6-months', now), true)
    assert.equal(invoiceMatchesPeriod('2026-05-17', 'last-6-months', now), false)
    assert.equal(invoiceMatchesPeriod('2026-11-18', 'last-6-months', now), true)
    assert.equal(invoiceMatchesPeriod('2026-11-19', 'last-6-months', now), false)
    assert.equal(invoiceMatchesPeriod('2026-01-15', 'last-6-months', now), false)
  })

  it('does not let a date-only string slip into the previous year', () => {
    const newYearsDay = new Date(2026, 0, 1)
    assert.equal(invoiceMatchesPeriod('2026-01-01', 'this-year', newYearsDay), true)
    assert.equal(invoiceMatchesPeriod('2025-12-31', 'this-year', newYearsDay), false)
  })

  it('clamps month shifts that land past the end of a shorter month', () => {
    const endOfMarch = new Date(2024, 2, 31)
    assert.equal(invoiceMatchesPeriod('2024-02-29', 'last-6-months', endOfMarch), true)
    assert.equal(invoiceMatchesPeriod('2023-09-30', 'last-6-months', endOfMarch), true)
    assert.equal(invoiceMatchesPeriod('2023-09-29', 'last-6-months', endOfMarch), false)
  })

  it('drops unparseable dates from a bounded period', () => {
    assert.equal(invoiceMatchesPeriod('2026-02-31', 'this-year', now), false)
    assert.equal(invoiceMatchesPeriod('', 'last-year', now), false)
  })
})
