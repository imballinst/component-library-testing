import { Story } from '@ladle/react'
import { Button, Descriptions, DescriptionsProps, Form, Input, Select } from 'antd'
import { DescriptionsItemType } from 'antd/es/descriptions'
import { ReactNode, useId, useState } from 'react'

const DEFAULT_VALUES = {
  id: '123123',
  displayName: 'Hello World',
  role: 'Player',
}

export const EditableDescriptionsStory: Story = () => {
  const [mode, setMode] = useState('read')
  const [state, setState] = useState(DEFAULT_VALUES)

  const items: WrappedDescriptionsItemType[] = [
    {
      key: 'id',
      label: 'ID',
      children: mode === 'read'
        ? state.id
        : (
          <>
            <Form.Item name="id" hidden />
            {state.id}
          </>
        ),
    },
    {
      key: 'displayName',
      label: 'Display Name',
      formElement: 'input',
      children:
        mode === 'read'
          ? state.displayName
          : (id) => (
            <Form.Item name="displayName">
              <Input id={id} />
            </Form.Item>
          ),
    },
    {
      key: 'role',
      label: 'Role',
      formElement: 'select',
      children:
        mode === 'read'
          ? state.role
          : (id) => (
            <Form.Item name="role">
              <Select id={id} style={{ width: 250 }}>
                <Select.Option value="Player">Player</Select.Option>
                <Select.Option value="Manager">Manager</Select.Option>
              </Select>
            </Form.Item>
          ),
    },
  ]

  return (
    <div>
      <div>
        <Button onClick={() => setMode((prev) => (prev === 'read' ? 'update' : 'read'))}>Toggle {mode === 'read' ? 'update' : 'read'}</Button>
      </div>

      <Form
        initialValues={state}
        onFinish={(values) => {
          setState(values)
          setMode('read')
        }}
      >
        <WrappedDescriptions items={items} mode={mode} />

        {mode === 'update' && <Button htmlType="submit">Submit</Button>}
      </Form>
    </div>
  )
}
EditableDescriptionsStory.displayName = 'Editable Descriptions'

// Composing functions.
interface WrappedDescriptionsItemType extends Omit<DescriptionsItemType, 'children'> {
  key: string
  label: ReactNode
  formElement?: string
  children: DescriptionsItemType['children'] | ((id: string) => DescriptionsItemType['children'])
}

function WrappedDescriptions(props: { items: WrappedDescriptionsItemType[]; mode: string }) {
  const idRecord = useIds(props.items.map((item) => item.key))

  const items: DescriptionsProps['items'] = []
  for (let i = 0; i < props.items.length; i++) {
    const item = props.items[i]

    items.push({
      ...item,
      label:
        props.mode === 'read' || !item.formElement ? (
          <span id={idRecord[item.key]}>{item.label}</span>
        ) : (
          <label htmlFor={idRecord[item.key]}>{item.label}</label>
        ),
      children:
        typeof item.children === 'function' ? (
          item.children(idRecord[item.key])
        ) : (
          <div aria-labelledby={idRecord[item.key]}>{item.children}</div>
        ),
    })
  }

  return <Descriptions items={items} />
}

function useIds(keys: string[]) {
  const baseId = useId()
  return keys.reduce(
    (acc, key) => {
      acc[key] = `${baseId}-${key}`
      return acc
    },
    {} as Record<string, string>,
  )
}
