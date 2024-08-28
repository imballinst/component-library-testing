import { Story } from '@ladle/react'
import { Button, Form } from 'antd'
import { Fragment } from 'react'
import { InputTags } from './InputTags'

export const InputTagsStory: Story = () => {
  return (
    <Form
      initialValues={{ roles: [], children: [{ roles: [] }] }}
      onFinish={(values) => alert(JSON.stringify(values))}
      className="flex flex-col gap-y-4"
    >
      <InputTags name="roles" label="Roles" validator={validatorFunction} />

      <Form.List name="children">
        {(fields) => {
          return fields.map((field) => (
            <Fragment key={field.name}>
              <InputTags name={[field.name, 'roles']} label="Child roles" validator={validatorFunction} />
            </Fragment>
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

// Helper functions.
function validatorFunction(chips: string[], input: string): Promise<unknown> {
  if (chips.length === 0 && input === '') return Promise.reject(new Error(`There should be at least 1 role.`))
  return Promise.resolve()
}
