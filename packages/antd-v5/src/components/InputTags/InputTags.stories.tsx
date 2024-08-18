import { Story } from '@ladle/react'
import { Button, Form } from 'antd'
import { InputTags } from './InputTags'

export const InputTagsStory: Story = () => {
  return (
    <Form onFinish={(values) => alert(JSON.stringify(values))}>
      <InputTags name="roles" label="Roles" />

      <Button htmlType="submit">Submit</Button>
    </Form>
  )
}
InputTagsStory.displayName = 'Input tags'
