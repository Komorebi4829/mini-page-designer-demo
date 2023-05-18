import update from 'immutability-helper'
import { MinusCircleOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, Space, Radio, Drawer, Form, Divider, Switch } from 'antd'
import { ProFormDependency } from '@ant-design/pro-form'
import './index.less'
import { useSelector, useDispatch } from 'react-redux'

const FormItem = Form.Item

const defaultVal = {
  styles: {
    display: 'block',
  },
  attrs: {
    imgList: [
      {
        src: 'https://img.alicdn.com/tps/TB1bewbNVXXXXc5XXXXXXXXXXXX-1000-300.png',
        title: 'img1',
        type: 'page',
      },
      {
        src: 'https://img.alicdn.com/tps/TB1xuUcNVXXXXcRXXXXXXXXXXXX-1000-300.jpg',
        title: 'img2',
        type: 'page',
      },
      {
        src: 'https://img.alicdn.com/tps/TB1s1_JNVXXXXbhaXXXXXXXXXXX-1000-300.jpg',
        title: 'img3',
        type: 'page',
      },
    ],
  },
}

const Attribute = (props) => {
  const { selected, onAttrsChange } = props
  const [showDrawer, setshowDrawer] = useState(false)
  const form = useRef()
  const form2 = useRef()

  useEffect(() => {
    form?.current?.resetFields()
    form?.current?.setFieldsValue(selected.attrs)
  }, [selected.i])

  const onValuesChange = (changedValues, allValues) => {
    // console.log('on attribute valuesChange raw', changedValues, allValues)
    onAttrsChange(allValues)
  }

  const onValuesChangeDrawer = (changedValues, allValues) => {
    const index = showDrawer.index
    const newAttrs = update(selected.attrs, {
      imgList: { [index]: { $merge: allValues } },
    })
    onAttrsChange(newAttrs)
    form?.current?.setFieldsValue({ imgList: newAttrs.imgList })
  }

  const onOpenImageSetting = (index) => {
    const item = selected.attrs.imgList?.[index]
    setshowDrawer({ index, ...item })
    form2?.current?.resetFields()
    form2?.current?.setFieldsValue(item)
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
          <Divider>Setting</Divider>
          <Form.List
            name="imgList"
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
                      <FormItem
                        {...restField}
                        name={[name, 'title']}
                        fieldKey={[fieldKey, 'title']}
                      >
                        <Input />
                      </FormItem>
                      <EditOutlined onClick={() => onOpenImageSetting(name)} />
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add({ title: 'image item' })
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add tag
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )
            }}
          </Form.List>
          <Divider>Advanced</Divider>
          <FormItem name="fieldId" label="fieldId" required>
            <Input size="small" />
          </FormItem>
        </div>
      </Form>
      <Drawer
        title={showDrawer.title}
        placement="right"
        onClose={() => setshowDrawer(false)}
        open={showDrawer}
        mask={false}
        getContainer={false}
        style={{ position: 'absolute', bottom: 0, right: 0, bottom: 0, top: 0, zIndex: 0 }}
        width={350}
      >
        <Form
          onFinish={(params) => console.log('onfinish')}
          onValuesChange={onValuesChangeDrawer}
          ref={form2}
        >
          <FormItem name="title" label="title">
            <Input />
          </FormItem>
          <FormItem name="src" label="src">
            <Input />
          </FormItem>
          <Divider>Link</Divider>
          <FormItem name="type" label="type">
            <Radio.Group
              options={[
                { value: 'page', label: 'internal page [real page]' },
                { value: 'vpage', label: 'internal page [virtual page]' },
                { value: 'link', label: 'external link' },
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
          {/* <ProFormList name="params">
            <ProFormText name="key" placeholder="key" />
            <ProFormText name="value" placeholder="value" />
          </ProFormList> */}
          <Form.List name="params">
            {(fields, { add, remove }, { errors }) => {
              return (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex' }} align="baseline">
                      <FormItem {...restField} name={[name, 'key']} fieldKey={[fieldKey, 'key']}>
                        <Input placeholder="key" />
                      </FormItem>
                      <FormItem
                        {...restField}
                        name={[name, 'value']}
                        fieldKey={[fieldKey, 'value']}
                      >
                        <Input placeholder="value" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      add
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )
            }}
          </Form.List>
        </Form>
      </Drawer>
    </>
  )
}

export default {
  tabAttr: Attribute,
  tabStyle: [],
  tabAdvance: [],
  tabNewStyle: [],
}

export { defaultVal }
