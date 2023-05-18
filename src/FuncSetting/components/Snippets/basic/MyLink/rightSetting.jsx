import React, { useState, useEffect, useRef } from 'react'
import { Input, Radio, Form, Divider, Switch } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import { ProFormDependency, ProFormList, ProFormText } from '@ant-design/pro-form'

const FormItem = Form.Item

const defaultVal = {
  styles: {
    display: 'inline-block',
  },
  attrs: {
    content: 'Here is a link',
    type: 'page',
  },
}

const Attribute = (props) => {
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
        <FormItem name="content" label="content">
          <Input />
        </FormItem>
        <FormItem
          name="textOverflow"
          label="text overflow"
          tooltip="textOverflow"
          valuePropName="checked"
        >
          <Switch />
        </FormItem>
        <Divider>link setting</Divider>
        <FormItem name="type" label="type">
          <Radio.Group
            options={[
              { value: 'page', label: 'internal page' },
              { value: 'url', label: 'external link' },
            ]}
          />
        </FormItem>
        <ProFormDependency name={['type']}>
          {({ type }) => {
            return (
              <FormItem name="url" label="link">
                <Input />
              </FormItem>
            )
          }}
        </ProFormDependency>
        <FormItem name="isBlank" label="new page" valuePropName="checked">
          <Switch />
        </FormItem>
        <Divider>parameters</Divider>
        <ProFormList name="params">
          <ProFormText name="key" placeholder="key" />
          <ProFormText name="value" placeholder="value" />
        </ProFormList>
        <Divider>advanced</Divider>
        <FormItem name="fieldId" label="unique identification" required>
          <Input size="small" />
        </FormItem>
      </div>
    </Form>
  )
}

export default {
  tabAttr: Attribute,
  tabStyle: [],
  tabAdvance: [],
  tabNewStyle: [],
}

export { defaultVal }
