import { CloseOutlined } from '@ant-design/icons'
import { Form, FormItemProps, Input, InputProps, Tag } from 'antd'
import classNames from 'classnames'
import { FieldContext } from 'rc-field-form'
import { ReactNode, useContext, useEffect, useId, useState } from 'react'

interface Props extends Pick<FormItemProps, 'label'> {
  name: string | (string | number)[]
  validator?: (chips: string[], input: string) => Promise<unknown>
}

const ADD_CHIP_KEYS = ['Tab', 'Enter']

export function InputTags({ name, validator, label, ...formItemProps }: Props) {
  const id = useId()
  const formInstance = Form.useFormInstance()
  const fieldName = useFieldLeafName(name)

  const [chips, setChips] = useState<string[]>([])
  const [errors, setErrors] = useState<ReactNode[]>([])
  const [input, setInput] = useState('')

  const contextValue = Form.useWatch(fieldName, formInstance)

  useEffect(() => {
    if (contextValue) {
      setChips(contextValue)
    }
  }, [formInstance, contextValue])

  async function updateState(nextInput: string, nextChips: string[]) {
    if (chips.includes(input)) {
      setErrors(['Input must be unique.'])
      return
    }

    if (nextChips) {
      setChips(nextChips)
      formInstance.setFieldValue(fieldName, nextChips)
    }

    setInput(nextInput)
  }

  if (!formInstance) {
    throw new Error('InputTags component must be used under <Form>')
  }

  const hasErrors = errors.length > 0

  return (
    <>
      <Form.Item
        name={name}
        hidden
        rules={[
          {
            validator() {
              if (!validator) return Promise.resolve()
              return validator(chips, input)
            },
          },
        ]}
        {...formItemProps}
      >
        <InputWrapper>
          <FormItemStatusForwarder setErrors={setErrors} />
        </InputWrapper>
      </Form.Item>

      <Form.Item
        className="inline-flex mb-0 w-full"
        wrapperCol={{ className: '[&>.ant-form-item-control-input]:min-h-[22px]' }}
        help={hasErrors ? errors : undefined}
        validateStatus={hasErrors ? 'error' : undefined}
        htmlFor={id}
        label={label}
        {...formItemProps}
      >
        <InputWrapper
          id={id}
          variant="borderless"
          className="p-0 w-auto"
          value={input}
          hasErrors={hasErrors}
          onKeyDown={(e) => {
            if (ADD_CHIP_KEYS.includes(e.key) && input !== '') {
              e.preventDefault()

              updateState('', chips.concat(input))

              return
            }

            if (e.key === 'Backspace') {
              if (input === '' && chips.length > 0) {
                e.preventDefault()

                updateState(chips[chips.length - 1], chips.slice(0, -1))
                return
              }
            }
          }}
          onBlur={() => {
            if (input !== '') {
              updateState('', chips.concat(input))
            }
          }}
          onChange={(e) => {
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

function InputWrapper({ children, hasErrors, ...props }: InputProps & { hasErrors?: boolean }) {
  return (
    <div
      className={classNames('inline-flex gap-x-1 border rounded p-1 w-full flex-wrap', {
        'border-[#ff4d4f]': hasErrors,
      })}
    >
      {children}

      <Input {...props} />
    </div>
  )
}

function useFieldLeafName(name: string | (string | number)[]) {
  const fieldContext = useContext(FieldContext).prefixName ?? []
  return fieldContext.concat(name)
}

function FormItemStatusForwarder({ setErrors }: { setErrors: (errors: ReactNode[]) => void }) {
  const { errors } = Form.Item.useStatus()

  useEffect(() => {
    setErrors(errors)
  }, [setErrors, errors])

  return null
}
