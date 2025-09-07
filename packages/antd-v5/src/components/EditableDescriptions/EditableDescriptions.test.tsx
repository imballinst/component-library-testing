import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { EditableDescriptionsStory } from './EditableDescriptions.stories'

const alertFn = vi.fn()

beforeEach(() => {
  window.alert = alertFn
  alertFn.mockClear()
})

test('base', async () => {
  render(<EditableDescriptionsStory />)

  expect(screen.getByLabelText("ID")).toHaveTextContent("123123");
  expect(screen.getByLabelText("Display Name")).toHaveTextContent("Hello World");
  expect(screen.getByLabelText("Role")).toHaveTextContent("Player");
})

test('edit', async () => {
  render(<EditableDescriptionsStory />)

  const toggleButton = screen.getByRole('button', { name: 'Toggle update' })
  fireEvent.click(toggleButton)

  expect(screen.getByLabelText("ID")).toHaveTextContent("123123");

  const displayNameInput = screen.getByLabelText("Display Name")
  expect(displayNameInput).toHaveValue("Hello World");

  fireEvent.change(displayNameInput, { target: { value: 'xddinside' } })

  const roleSelect = screen.getByLabelText("Role")
  expect(roleSelect.parentNode?.nextSibling).toHaveTextContent("Player");

  fireEvent.mouseDown(roleSelect)

  const virtualList = document.getElementById(
    roleSelect.getAttribute('aria-controls')!,
  )?.nextSibling as HTMLElement

  fireEvent.click(within(virtualList).getByTitle('Manager'))

  const submitButton = screen.getByRole('button', { name: 'Submit' })
  fireEvent.click(submitButton)

  await waitForElementToBeRemoved(submitButton)

  expect(screen.getByLabelText("ID")).toHaveTextContent("123123");
  expect(screen.getByLabelText("Display Name")).toHaveTextContent("xddinside");
  expect(screen.getByLabelText("Role")).toHaveTextContent("Manager");
})
