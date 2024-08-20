import { Story } from '@ladle/react'
import { Button, Form } from 'antd'
import { InputTags } from './InputTags'

export const InputTagsStory: Story = () => {
  return (
    <Form
      initialValues={{ roles: ['haha'], children: [{ roles: ['hehe'] }] }}
      onFinish={(values) => alert(JSON.stringify(values))}
      className="flex flex-col gap-y-4"
    >
      <InputTags name="roles" label="Roles" />

      <Form.List name="children">
        {(fields) => {
          return fields.map((field) => (
            <InputTags
              key={`${field.name}-roles`}
              name={[field.name, 'roles']}
              label="Roles"
              validator={(chips, input) => {
                console.info('validator internal called', chips, input)
                if (chips.includes(input)) return Promise.reject(new Error('Input must be unique'))

                return Promise.resolve()
              }}
            />
          ))
        }}
      </Form.List>

      <div>
        <Button htmlType="submit">Submit</Button>
      </div>
    </Form>
  )
}
InputTagsStory.displayName = 'Input tags'
