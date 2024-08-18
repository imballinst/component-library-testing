import { CloseOutlined } from '@ant-design/icons'
import { Form, FormItemProps, Input, InputProps, Tag } from 'antd'
import { FieldContext } from 'rc-field-form'
import { useContext, useEffect, useId, useState } from 'react'

interface Props extends Pick<FormItemProps, 'label'> {
  name: string | (string | number)[]
  validator?: (chips: string[], input: string) => FormItemProps['rules']
}

const ADD_CHIP_KEYS = ['Tab', 'Enter']

export function InputTags({ name, validator, ...formItemProps }: Props) {
  const id = useId()
  const formInstance = Form.useFormInstance()
  const fieldName = useFieldLeafName(name)

  const [chips, setChips] = useState<string[]>([])
  const [input, setInput] = useState('')

  const contextValue = Form.useWatch(fieldName, formInstance)

  useEffect(() => {
    formInstance.setFieldValue(fieldName, chips)
  }, [formInstance, chips, fieldName])

  useEffect(() => {
    if (contextValue) {
      setChips(contextValue)
    }
  }, [formInstance, contextValue])

  if (!formInstance) {
    throw new Error('InputTags component must be used under <Form>')
  }

  return (
    <>
      <Form.Item name={fieldName} hidden rules={validator?.(chips, input)} {...formItemProps}>
        <Input />
      </Form.Item>

      <Form.Item
        className="inline-flex mb-0 w-full"
        wrapperCol={{ className: '[&>.ant-form-item-control-input]:min-h-[22px]' }}
        {...formItemProps}
      >
        <InputWrapper
          id={id}
          variant="borderless"
          className="p-0 w-auto"
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
          onChange={(e) => {
            formInstance.validateFields([fieldName])

            setInput(e.target.value)
          }}
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
    <div className="inline-flex gap-x-1 border p-1 mb-6 w-full flex-wrap">
      {children}

      <Input {...props} />
    </div>
  )
}

function useFieldLeafName(name: string | (string | number)[]) {
  const fieldContext = useContext(FieldContext).prefixName ?? []
  return fieldContext.concat(name)
}
