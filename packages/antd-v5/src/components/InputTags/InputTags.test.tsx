import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, test } from 'vitest'
import { InputTagsStory } from './InputTags.stories'

test('base', async () => {
  render(<InputTagsStory />)

  const submitButton = await screen.findByRole('button', { name: 'Submit' })
  fireEvent.click(submitButton)

  await waitFor(async () => {
    const matching = await screen.findAllByText('There should be at least 1 role.')
    expect(matching.length).toBe(2)
  })
})
