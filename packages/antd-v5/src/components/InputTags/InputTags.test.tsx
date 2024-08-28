import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { InputTagsStory } from './InputTags.stories'

const alertFn = vi.fn()

beforeEach(() => {
  window.alert = alertFn
  alertFn.mockClear()
})

test('base', async () => {
  render(<InputTagsStory />)

  const submitButton = await screen.findByRole('button', { name: 'Submit' })
  fireEvent.click(submitButton)

  await waitFor(async () => {
    const matching = await screen.findAllByRole('alert', { hidden: false })
    expect(matching.length).toBe(2)
  })

  let matching = await screen.findAllByRole('alert', { hidden: false })
  expect(matching.length).toBe(2)

  for (const element of matching) {
    expect(element).toHaveTextContent('There should be at least 1 role.')
  }

  const rolesInput = screen.getByRole('textbox', { name: 'Roles' })
  fireEvent.change(rolesInput, { target: { value: 'hello' } })
  fireEvent.blur(rolesInput)

  const childRolesInput = screen.getByRole('textbox', { name: 'Child roles' })
  fireEvent.change(childRolesInput, { target: { value: 'world' } })
  fireEvent.blur(childRolesInput)

  fireEvent.click(submitButton)

  for (const element of matching) {
    expect(element).not.toBeInTheDocument()
  }

  await waitFor(() => {
    expect(alertFn.mock.calls.length).toBe(1)
  })

  const parsed = JSON.parse(alertFn.mock.calls[0][0])
  expect(parsed.roles[0]).toBe('hello')
  expect(parsed.children[0].roles[0]).toBe('world')

  // Try setting non-unique inputs.
  fireEvent.change(childRolesInput, { target: { value: 'world' } })
  fireEvent.blur(childRolesInput)

  matching = await screen.findAllByRole('alert', { hidden: false })
  expect(matching.length).toBe(1)

  for (const element of matching) {
    expect(element).toHaveTextContent('Input must be unique.')
  }
})
