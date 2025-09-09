import { Story } from '@ladle/react'
import { Button, Form, Radio } from 'antd'

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

export const RadioGroup: Story = () => {
  return <Form onFinish={(values) => console.info(values)}>
    <div>
      <Form.Item name="option" label={<span id="form-label">Option</span>} htmlFor={undefined}>
        <div role="radiogroup" aria-labelledby="form-label">
          <Radio.Group
            options={OPTIONS}
          />
        </div>
      </Form.Item>
    </div>


    <Button htmlType="submit">Submit</Button>
  </Form>
}