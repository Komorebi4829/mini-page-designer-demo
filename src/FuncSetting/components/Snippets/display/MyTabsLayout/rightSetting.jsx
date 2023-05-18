import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, Space, Radio, Form, Divider, Switch } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import { uuid } from '@/utils'

const FormItem = Form.Item

const tabPrefix = 'tab_'
const tabList = [
  { title: 'Tab1', key: tabPrefix + uuid(8) },
  { title: 'Tab2', key: tabPrefix + uuid(8) },
  { title: 'Tab3', key: tabPrefix + uuid(8) },
]

const defaultVal = {
  styles: {
    display: 'block',
  },
  attrs: {
    swipeable: true,
    animated: true,
    tabList: tabList,
    theme: 'line',
  },
  children: tabList.map((item) => ({
    i: item.key,
    title: item.title,
    key: item.key,
    name: 'MyTabPane',
    category: 'display',
    children: [],
    selectable: false,
    disabled: true,
  })),
}

const Attribute = (props) => {
  const dispatch = useDispatch()
  const { selected, onAttrsChange } = props
  const form = useRef()

  useEffect(() => {
    form?.current?.resetFields()
    form?.current?.setFieldsValue(selected.attrs)
  }, [selected.i])

  const onValuesChange = (changedValues, allValues) => {
    // console.log('on attribute valuesChange raw', changedValues, allValues)
    if (changedValues.tabList) {
      const values = allValues.tabList.filter(
        (item) => item.title !== undefined && item.key !== undefined,
      )
      onAttrsChange({ tabList: values })
      return
    }
    onAttrsChange(changedValues)
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
        <Form.List
          name="tabList"
          rules={[
            {
              validator: async (_, value) => {
                if (value && value.length > 0) {
                  return
                }
                throw new Error('At least one item is required!')
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ display: 'flex' }} align="baseline">
                    <FormItem {...restField} name={[name, 'title']} fieldKey={[fieldKey, 'title']}>
                      <Input placeholder="title" />
                    </FormItem>
                    <FormItem
                      {...restField}
                      name={[name, 'key']}
                      fieldKey={[fieldKey, 'key']}
                      hidden
                    >
                      <Input />
                    </FormItem>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(name)
                        dispatch({ type: 'pageEditor/onMyTabsRemoveTab', payload: name })
                      }}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      const key = tabPrefix + uuid(8)
                      const item = {
                        title: 'tab',
                        key: key,
                      }
                      add(item)
                      dispatch({
                        type: 'pageEditor/onMyTabsAddTab',
                        payload: {
                          ...item,
                          children: [],
                          selectable: false,
                          disabled: true,
                          i: item.key,
                          name: 'MyTabPane',
                          category: 'display',
                        },
                      })
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add a tab
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )
          }}
        </Form.List>
        {/* <FormItem name="defaultActiveKey" label="Tabs selected by default">
          <Select options={[]} />
        </FormItem> */}
        <FormItem name="theme" label="theme">
          <Radio.Group
            options={[
              { value: 'card', label: 'card' },
              { value: 'line', label: 'line' },
            ]}
          />
        </FormItem>
        <FormItem name="swipeable" label="swipeable" valuePropName="checked">
          <Switch />
        </FormItem>
        <FormItem name="animated" label="animated" valuePropName="checked">
          <Switch />
        </FormItem>

        <Divider>Advanced</Divider>
        <FormItem name="fieldId" label="fieldId" required>
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
