import { CloseOutlined } from '@ant-design/icons'
import { Form, FormItemProps, Input, InputProps, Tag } from 'antd'
import useFormItemStatus from 'antd/es/form/hooks/useFormItemStatus'
import classNames from 'classnames'
import { FieldContext } from 'rc-field-form'
import { ReactNode, useContext, useEffect, useId, useState } from 'react'

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
  const [errors, setErrors] = useState<ReactNode[]>([])
  const [input, setInput] = useState('')

  const contextValue = Form.useWatch(fieldName, formInstance)

  useEffect(() => {}, [formInstance, chips, fieldName])

  useEffect(() => {
    if (contextValue) {
      setChips(contextValue)
    }
  }, [formInstance, contextValue])

  async function updateState(chipsSetter: (prev: string[]) => string[], nextInput: string) {
    const result = await formInstance.validateFields(fieldName)
    // Still can't seem to prevent from inputting tag; there's also this weird key "0" at the top.
    console.info('result', result)

    const nextChips = chipsSetter(chips)

    setInput(nextInput)
    setChips(chipsSetter)
    formInstance.setFieldValue(fieldName, nextChips)
  }

  if (!formInstance) {
    throw new Error('InputTags component must be used under <Form>')
  }

  const hasErrors = errors.length > 0

  return (
    <>
      <Form.Item name={fieldName} hidden rules={validator?.(chips, input)} {...formItemProps}>
        <Input addonBefore={<FormItemStatusForwarder setErrors={setErrors} />} />
      </Form.Item>

      <Form.Item
        className="inline-flex mb-0 w-full"
        wrapperCol={{ className: '[&>.ant-form-item-control-input]:min-h-[22px]' }}
        help={hasErrors ? errors : undefined}
        validateStatus={hasErrors ? 'error' : undefined}
        {...formItemProps}
      >
        <InputWrapper
          id={id}
          variant="borderless"
          className="p-0 w-auto"
          value={input}
          hasErrors={hasErrors}
          onKeyDown={(e) => {
            if (ADD_CHIP_KEYS.includes(e.key)) {
              e.preventDefault()

              updateState((prev) => prev.concat(input), '')

              return
            }

            if (e.key === 'Backspace') {
              if (input === '' && chips.length > 0) {
                e.preventDefault()

                updateState((chips) => chips.slice(0, -1), chips[chips.length - 1])
                return
              }
            }
          }}
          onChange={async (e) => {
            await formInstance.validateFields([fieldName])

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

function InputWrapper({ children, hasErrors, ...props }: InputProps & { hasErrors: boolean }) {
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
  const { errors } = useFormItemStatus()

  useEffect(() => {
    setErrors(errors)
  }, [setErrors, errors])

  return null
}
