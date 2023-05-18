import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react'
import {
  Row,
  Col,
  Button,
  Tabs,
  Input,
  Select,
  InputNumber,
  Collapse,
  Radio,
  Form,
  Tooltip,
  Slider,
  Divider,
  Switch,
} from 'antd'
import './index.less'

const FormItem = Form.Item

const defaultVal = {
  value: 'Button',
  styles: {},
  attrs: {
    type: 'primary',
    size: 'default',
    status: 'normal',
    icon: null,
  },
}

const Attribute = memo((props) => {
  const { selected, onAttrsChange } = props
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
    type: selected?.type,
    size: selected?.size,
    status: selected?.status,
  }

  return (
    <Form
      onFinish={(params) => console.log('onfinish')}
      onValuesChange={onValuesChange}
      ref={form}
      initialValues={initialValues}
    >
      <div className="tabAttribute">
        <Divider>Setting</Divider>
        <FormItem name="content" label="text">
          <Input size="small" />
        </FormItem>
        <FormItem name="type" label="type">
          <Select
            size="small"
            options={[
              { value: 'primary', label: 'primary' },
              { value: 'default', label: 'default' },
              { value: 'warn', label: 'warn' },
            ]}
          />
        </FormItem>
        <FormItem name="size" label="size">
          <Radio.Group size="small">
            <Radio.Button value="default">default</Radio.Button>
            <Radio.Button value="mini">mini</Radio.Button>
          </Radio.Group>
        </FormItem>
        <FormItem name="loading" label="loading" valuePropName="checked">
          <Switch />
        </FormItem>
        <FormItem name="disabled" label="disabled" valuePropName="checked">
          <Switch />
        </FormItem>
        <Divider>Advanced</Divider>
        <FormItem name="fieldId" label="fieldId" required>
          <Input size="small" />
        </FormItem>
      </div>
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
