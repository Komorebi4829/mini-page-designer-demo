import React, { useState, useEffect, useRef, memo } from 'react'
import { Input, Select, Form, Divider } from 'antd'

const FormItem = Form.Item

const defaultVal = {
  styles: {
    display: 'inline-block',
    width: { value: 350, unit: 'px' },
    height: { value: 200, unit: 'px' },
  },
  attrs: {
    src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
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
        <FormItem name="src" label="image url">
          <Input
            style={{ width: '100%' }}
            size="small"
            placeholder="input url"
            // addonAfter={
            //   <CloudUploadOutlined
            //     onClick={handleBackgroundImage}
            //     className="upload-btn"
            //   />
            // }
          />
        </FormItem>
        <FormItem name="objectFit" label="object-fit">
          <Select
            size="small"
            options={[
              { value: 'cover', label: 'Cover' },
              { value: 'contain', label: 'Contain' },
              { value: 'fill', label: 'fill' },
            ]}
          />
        </FormItem>
        <FormItem name="alt" label="alternative text">
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
