import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useState, useEffect, useRef, memo } from 'react'
import { Button, Input, InputNumber, Form, Space, Divider, Switch } from 'antd'
import './index.less'
import VarText, { VarModal } from '@/components/BindVar'

const FormItem = Form.Item

const defaultVal = {
  value: 'Text',
  styles: {
    // width: 378,
  },
  attrs: {},
}

const Attribute = memo((props) => {
  const { selected, onAttrsChange } = props
  const [varModalProps, setvarModalProps] = useState(false)
  const form = useRef()

  useEffect(() => {
    form?.current?.resetFields()
    form?.current?.setFieldsValue(selected.attrs)
  }, [selected.i])

  const onValuesChange = (changedValues, allValues) => {
    // console.log('on attribute valuesChange raw', changedValues, allValues)
    onAttrsChange(allValues)
  }

  const initialValues = {
    fieldId: selected?.i,
    content: selected?.value,
    maxLine: 0,
    ':if': [],
  }

  return (
    <Form
      onFinish={(params) => console.log('onfinish')}
      onValuesChange={onValuesChange}
      ref={form}
      initialValues={initialValues}
    >
      <div className="tabAttribute">
        <FormItem
          name="content"
          label={
            <VarText
              varModal={varModalProps}
              setvarModal={(value) => {
                // The initial value of the component does not have selected?.attrs?.content, need to manually give one
                // setvarModalProps(selected?.attrs?.content || '$page.state')
                setvarModalProps({
                  data: selected?.attrs?.content || '$page.state',
                  onCancel: () => setvarModalProps({ data: false }),
                  onSave: (data) => {
                    form?.current?.setFieldsValue({ content: data })
                    onAttrsChange({ content: data })
                  },
                  prefix: '$page.state.',
                })
              }}
            >
              text content
            </VarText>
          }
        >
          {selected?.attrs?.content?.startsWith('$page') ? (
            <Input bordered={false} disabled={true} />
          ) : (
            <Input.TextArea style={{ height: 120, width: 240 }} />
          )}
        </FormItem>
        {/* TEMP */}
        <FormItem name="isRichText" label="rich text" valuePropName="checked">
          <Switch />
        </FormItem>
        {/* TEMP */}
        <FormItem name="maxLine" label="max line">
          <InputNumber min={0} type="number" size="small" />
        </FormItem>

        <Divider>condition</Divider>
        <Form.List name=":if">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space key={key} style={{ display: 'flex' }} align="baseline">
                  <FormItem
                    {...restField}
                    name={[name, 'var']}
                    rules={[{ required: true, message: 'Please bind variable' }]}
                    label={
                      <VarText
                        varModal={varModalProps}
                        setvarModal={(value) => {
                          setvarModalProps({
                            data: selected?.attrs?.[index] || '$page.state',
                            onCancel: () => setvarModalProps({ data: false }),
                            onSave: (data) => {
                              form?.current?.setFields([
                                {
                                  name: [':if', index, 'var'],
                                  value: data,
                                },
                              ])
                              onAttrsChange({ ':if': form?.current?.getFieldValue(':if') })
                            },
                            prefix: '$page.state.',
                          })
                        }}
                      >
                        variable
                      </VarText>
                    }
                  >
                    <Input size="small" />
                  </FormItem>
                  <FormItem
                    {...restField}
                    name={[name, 'cond']}
                    rules={[{ required: true, message: 'select true/false' }]}
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="true" unCheckedChildren="false" size="small" />
                  </FormItem>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add({ cond: true, var: '' })}
                  block
                  icon={<PlusOutlined />}
                >
                  Add a condition
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider>Advanced</Divider>
        <FormItem name="fieldId" label="fieldId" required>
          <Input size="small" />
        </FormItem>
      </div>

      <VarModal {...varModalProps} />
    </Form>
  )
})

export default {
  tabAttr: Attribute,
  tabStyle: [],
  tabAdvance: [],
  tabNewStyle: [],
}

export { defaultVal }
