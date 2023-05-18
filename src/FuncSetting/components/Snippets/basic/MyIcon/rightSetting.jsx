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
  Drawer,
} from 'antd'
import ColorPicker from '@/components/ColorPicker'

const FormItem = Form.Item
const Option = Select.Option

const defaultVal = {
  styles: {
    display: 'inline-block',
  },
  attrs: {
    fontSize: 25,
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
        <FormItem name="color" label="color">
          <ColorPicker popoverStyle={{ bottom: 0, top: -80 }} />
        </FormItem>
        <FormItem name="fontSize" label="size">
          <Input size="small" />
        </FormItem>
        <FormItem name="iconUrl" label="url">
          <Input size="small" />
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
