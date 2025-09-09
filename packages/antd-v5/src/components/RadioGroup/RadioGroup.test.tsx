import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { Button, Form, Radio } from 'antd'
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
      <div>
        <Form.Item name="option" label={<span id="form-label">Option</span>} htmlFor={undefined}>
          <div role="radiogroup" aria-labelledby="form-label">
            <Radio.Group options={OPTIONS} />
          </div>
        </Form.Item>
      </div>

      <Button htmlType="submit">Submit</Button>
    </Form>,
  )

  const submitButton = await screen.findByRole('button', { name: 'Submit' })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(submitFn.mock.calls.length).toBe(1)
    expect(submitFn.mock.calls[0][0]).toEqual({ option: undefined })
  })

  const container = screen.getByRole('radiogroup', { name: 'Option' })
  fireEvent.click(within(container).getByRole('radio', { name: 'Test 1' }))
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(submitFn.mock.calls.length).toBe(2)
    expect(submitFn.mock.calls[1][0]).toEqual({ option: OPTIONS[0].value })
  })

  fireEvent.click(within(container).getByRole('radio', { name: 'Test 3' }))
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(submitFn.mock.calls.length).toBe(3)
    expect(submitFn.mock.calls[2][0]).toEqual({ option: OPTIONS[2].value })
  })
})
