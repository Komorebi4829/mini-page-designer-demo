import update from 'immutability-helper'
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useState, useEffect, useRef, memo } from 'react'
import { Button, Input, Form, Divider, Space, Switch } from 'antd'
import './index.less'
import VarText, { VarModal } from '@/components/BindVar'
import BindEvent from '@/components/BindEvent'

const FormItem = Form.Item

const defaultVal = {
  value: 'Drag and drop components or templates here',
  styles: {
    display: 'block',
  },
  attrs: {},
  listeners: [],
  children: [],
}

const Attribute = memo((props) => {
  const { selected, onAttrsChange, onEventsChange } = props
  const [varModalProps, setvarModalProps] = useState(false)
  const [bindEventModal, setbindEventModal] = useState(false)
  // const [first, setfirst] = useState(second);
  const form = useRef()

  useEffect(() => {
    form?.current?.resetFields()
    form?.current?.setFieldsValue(selected.attrs)
  }, [selected.i])

  const onBindEvent = (event) => {
    let value
    if (bindEventModal.mode === 'add') {
      if (Array.isArray(selected?.listeners)) {
        value = update(selected.listeners, {
          $push: [event],
        })
      } else {
        value = [event]
      }
      onEventsChange(value)
    } else {
      value = update(selected.listeners, {
        $apply: (oldArray) => {
          const newArray = []
          oldArray.map((item) => {
            if (item.id === event.id) {
              newArray.push(event)
            } else {
              newArray.push(item)
            }
          })
          return newArray
        },
      })
      onEventsChange(value)
    }
    setbindEventModal(false)
  }

  const onDeleteAction = (e, actionId) => {
    console.log(actionId)
    e.stopPropagation()
    const value = update(selected.listeners, {
      $apply: (oldArray) => {
        const newArray = []
        oldArray.map((item) => {
          if (item.id === actionId) {
          } else {
            newArray.push(item)
          }
        })
        return newArray
      },
    })
    onEventsChange(value)
  }

  const onValuesChange = (changedValues, allValues) => {
    // console.log('on attribute valuesChange raw', changedValues, allValues)
    onAttrsChange(allValues)
  }

  const initialValues = {
    fieldId: selected?.i,
  }

  return (
    <>
      <Form
        onFinish={(params) => console.log('onfinish')}
        onValuesChange={onValuesChange}
        ref={form}
        initialValues={initialValues}
      >
        <div className="tabAttribute">
          <Divider>Condition display</Divider>
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
                      rules={[{ required: true, message: 'Please select true/false' }]}
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
                    size="small"
                    block
                    icon={<PlusOutlined />}
                  >
                    Add a condition
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Divider>Cycle display</Divider>
          <FormItem
            name=":for"
            label={
              <VarText
                varModal={varModalProps}
                setvarModal={(value) => {
                  setvarModalProps({
                    data: selected?.attrs?.[':for'] || '$page.state',
                    onCancel: () => setvarModalProps({ data: false }),
                    onSave: (data) => {
                      form?.current?.setFieldsValue({ ':for': data })
                      onAttrsChange({ ':for': data })
                    },
                    prefix: '$page.state.',
                  })
                }}
              >
                variable
              </VarText>
            }
          >
            {/* <Input size="small" disabled /> */}
            <span>{selected?.attrs?.[':for']}</span>
          </FormItem>
          <Divider>Bind event</Divider>
          {selected?.listeners?.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => setbindEventModal({ mode: 'edit', data: item })}
                className="event-item"
              >
                <Space>
                  <span>tap</span>
                  <span>{item.handler.name}</span>
                </Space>
                <span className="event-item-action">
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={(e) => onDeleteAction(e, item.id)}
                    style={{ transition: 'none', backgroundColor: '#f1f2f5' }}
                  />
                </span>
              </div>
            )
          })}
          <Button
            type="dashed"
            onClick={() => setbindEventModal({ mode: 'add' })}
            size="small"
            block
            icon={<PlusOutlined />}
            style={{ marginBottom: 24 }}
          >
            Add a event
          </Button>

          <Divider />
          <FormItem name="fieldId" label="fieldId" required>
            <Input size="small" />
          </FormItem>
        </div>
        <VarModal {...varModalProps} />
      </Form>
      <BindEvent
        data={bindEventModal}
        onCancel={() => setbindEventModal(false)}
        callback={onBindEvent}
      />
    </>
  )
})

export default {
  tabAttr: Attribute,
  tabStyle: [],
  tabAdvance: [],
  tabNewStyle: [],
}

export { defaultVal }
