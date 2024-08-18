import { CloseOutlined } from '@ant-design/icons'
import { Form, Input, InputProps, Tag } from 'antd'
import { useId, useState } from 'react'

interface Props {
  name: string
  label?: string
}

const ADD_CHIP_KEYS = ['Tab', 'Enter']

export function InputTags({ name, label }: Props) {
  const id = useId()

  const [chips, setChips] = useState<string[]>(new Array(10).fill('hell212o1'))
  const [input, setInput] = useState('')

  return (
    <>
      <Form.Item name={name} hidden>
        <Input />
      </Form.Item>

      <Form.Item className="inline-flex mb-0" wrapperCol={{ className: '[&>.ant-form-item-control-input]:min-h-[22px]' }} label={label}>
        <InputWrapper
          id={id}
          className="p-0"
          value={input}
          onKeyDown={(e) => {
            if (ADD_CHIP_KEYS.includes(e.key)) {
              e.preventDefault()

              setChips((prev) => prev.concat(input))
              setInput('')

              return
            }

            if (e.key === 'Backspace') {
              if (input === '' && chips.length > 0) {
                e.preventDefault()

                setInput(chips[chips.length - 1])
                setChips((chips) => chips.slice(0, -1))
                return
              }
            }
          }}
          onChange={(e) => setInput(e.target.value)}
        >
          {chips.map((chip, idx) => (
            <Tag
              key={`${chip}-${idx}`}
              className="mr-0"
              closable
              closeIcon={<CloseOutlined aria-label={`Remove ${chip}`} />}
              onClose={() => {
                setChips((prev) => {
                  const newChips = [...prev]
                  newChips.splice(idx, 1)

                  return newChips
                })
              }}
            >
              {chip}
            </Tag>
          ))}
        </InputWrapper>
      </Form.Item>
    </>
  )
}

function InputWrapper({ children, ...props }: InputProps) {
  return (
    <>
      {children}

      <Input {...props} />
    </>
  )
}
