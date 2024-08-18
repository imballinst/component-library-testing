import '@testing-library/jest-dom'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { Button, Form, Select } from 'antd'
import { expect, test, vi } from 'vitest'

const OPTIONS = [
  {
    label: 'Test 1',
    value: 'test1',
  },
  {
    label: 'Test 2',
    value: 'test2',
  },
  {
    label: 'Test 3',
    value: 'test3',
  },
]

test('base', async () => {
  const submitFn = vi.fn()

  render(
    <Form onFinish={submitFn}>
      <Form.Item name="option" label="Option">
        <Select options={OPTIONS} />
      </Form.Item>

      <Button htmlType="submit">Submit</Button>
    </Form>,
  )

  const submitButton = await screen.findByRole('button', { name: 'Submit' })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(submitFn.mock.calls.length).toBe(1)
    expect(submitFn.mock.calls[0][0]).toEqual({ option: undefined })
  })

  const select = screen.getByRole('combobox', { name: 'Option' })
  fireEvent.mouseDown(select)

  const virtualList = document.getElementById(
    select.getAttribute('aria-controls')!,
  )?.nextSibling as HTMLElement
  fireEvent.click(within(virtualList).getByTitle('Test 3'))

  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(submitFn.mock.calls.length).toBe(2)
    expect(submitFn.mock.calls[1][0]).toEqual({ option: OPTIONS[2].value })
  })
})

test('default value', async () => {
  const submitFn = vi.fn()

  render(
    <Form onFinish={submitFn} initialValues={{ option: OPTIONS[1].value }}>
      <Form.Item name="option" label="Option">
        <Select options={OPTIONS} />
      </Form.Item>

      <Button htmlType="submit">Submit</Button>
    </Form>,
  )

  const select = screen.getByRole('combobox', { name: 'Option' })
  const currentValueContainer = select.parentElement?.nextSibling as HTMLElement

  expect(currentValueContainer).toHaveTextContent('Test 2')

  const submitButton = await screen.findByRole('button', { name: 'Submit' })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(submitFn.mock.calls.length).toBe(1)
    expect(submitFn.mock.calls[0][0]).toEqual({ option: OPTIONS[1].value })
  })
})

test('with search', async () => {
  const submitFn = vi.fn()

  render(
    <Form onFinish={submitFn} initialValues={{ option: undefined }}>
      <Form.Item name="option" label="Option">
        <Select options={OPTIONS} showSearch optionFilterProp="label" />
      </Form.Item>

      <Button htmlType="submit">Submit</Button>
    </Form>,
  )

  const select = screen.getByRole('combobox', { name: 'Option' })
  fireEvent.change(select, { target: { value: 'Test 1' } })
  fireEvent.mouseDown(select)

  const virtualList = document.getElementById(
    select.getAttribute('aria-controls')!,
  )?.nextSibling as HTMLElement

  expect(within(virtualList).queryByTitle('Test 2')).not.toBeInTheDocument()
  expect(within(virtualList).queryByTitle('Test 3')).not.toBeInTheDocument()

  fireEvent.click(within(virtualList).getByTitle('Test 1'))
})
