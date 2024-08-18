import { Story } from '@ladle/react'
import { Button, Form } from 'antd'
import { InputTags } from './InputTags'

export const InputTagsStory: Story = () => {
  return (
    <Form initialValues={{ roles: [], children: [{ roles: [] }] }} onFinish={(values) => alert(JSON.stringify(values))}>
      <InputTags name="roles" label="Roles" />

      <Form.List name="children">
        {(fields) => {
          return fields.map((field) => (
            <InputTags
              name={[field.name, 'roles']}
              label="Roles"
              validator={(chips, input) => [
                {
                  validator() {
                    if (chips.includes(input)) return Promise.reject(new Error('Input must be unique'))

                    return Promise.resolve()
                  },
                },
              ]}
            />
          ))
        }}
      </Form.List>

      <Button htmlType="submit">Submit</Button>
    </Form>
  )
}
InputTagsStory.displayName = 'Input tags'
