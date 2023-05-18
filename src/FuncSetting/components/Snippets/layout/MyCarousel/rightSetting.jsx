import React, { useState, useEffect, useMemo, useRef, memo } from 'react'
import { Button, Input, Select, Form, Switch, Divider } from 'antd'
import './index.less'

const FormItem = Form.Item

const sliderContentStyles = {
  height: { value: 160, unit: 'px' },
  color: '#fff',
  lineHeight: { value: 160, unit: 'px' },
  textAlign: 'center',
  fillType: 'fill-color',
  backgroundColor: '#364d79',
}

const defaultVal = {
  value: '',
  styles: {
    display: 'block',
    height: { value: 160, unit: 'px' },
  },
  attrs: {
    autoplay: false,
    indicatorDots: true,
    vertical: false,
    current: 0,
  },
  children: [
    {
      i: `div_easqgba0imYmrIMRC3`,
      key: `div_easqgba0imYmrIMRC3`,
      name: 'MyContainer',
      category: 'layout',
      title: 'Container',
      value: 'Drag and drop components or templates here',
      styles: {
        display: 'block',
      },
      attrs: {},
      children: [
        {
          i: `text_c545a539-66a1-42`,
          key: `text_c545a539-66a1-42`,
          name: 'MyText',
          category: 'basic',
          title: 'Text1',
          value: 'Text1',
          styles: { ...sliderContentStyles },
          attrs: {},
        },
      ],
    },
    {
      i: `div_f73bad85-6bf1-4c`,
      key: `div_f73bad85-6bf1-4c`,
      name: 'MyContainer',
      category: 'layout',
      title: 'Container',
      value: 'Drag and drop components or templates here',
      styles: {
        display: 'block',
      },
      attrs: {},
      children: [
        {
          i: `text_1e07c8ff-6e4e-4f`,
          key: `text_1e07c8ff-6e4e-4f`,
          name: 'MyText',
          category: 'basic',
          title: 'Text2',
          value: 'Text2',
          styles: { ...sliderContentStyles },
          attrs: {},
        },
      ],
    },
  ],
}

const Attribute = memo((props) => {
  const { selected, onAttrsChange, dispatch, editor } = props
  const form = useRef()

  console.log(props, props)

  useEffect(() => {
    form?.current?.resetFields()
    form?.current?.setFieldsValue(selected.attrs)
  }, [selected.i])

  const pageOptions = useMemo(() => {
    const options = selected?.children?.map((item, index) => ({
      value: index,
      label: `page ${index}`,
    }))
    return options
  }, [selected.children.length])

  const onValuesChange = (changedValues, allValues) => {
    onAttrsChange(allValues)
  }

  const addSlider = () => {
    const newSlider = {
      i: `div_6a49e114-0096-41`,
      key: `div_6a49e114-0096-41`,
      name: 'MyContainer',
      category: 'layout',
      title: 'Container',
      value: 'Drag and drop components or templates here',
      styles: {
        display: 'block',
      },
      attrs: {},
      children: [
        {
          i: `text_c3904a0d-ec3f-46`,
          key: `text_c3904a0d-ec3f-46`,
          name: 'MyText',
          category: 'basic',
          title: 'Text',
          value: 'Text',
          styles: { ...sliderContentStyles },
          attrs: {},
        },
      ],
    }
    dispatch({
      type: 'pageEditor/addSliderByContainerId',
      payload: { i: selected?.i, newSlider },
    })
  }

  const removeSlider = () => {
    const currentIndex = form?.current?.getFieldValue('current')
    const currentId = selected.children?.[currentIndex]?.i
    dispatch({
      type: 'pageEditor/removeComponentById',
      payload: { i: currentId },
    })
    let newIndex = currentIndex - 1
    onAttrsChange({ current: newIndex })
    form?.current?.setFieldsValue({ current: newIndex })
  }

  const initialValues = {
    fieldId: selected?.i,
    autoplay: false,
    indicatorDots: true,
    vertical: false,
    current: 0,
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
        <FormItem name="autoplay" label="autoplay" valuePropName="checked">
          <Switch />
        </FormItem>
        <FormItem name="indicatorDots" label="indicatorDots" valuePropName="checked">
          <Switch />
        </FormItem>
        <FormItem name="vertical" label="vertical" valuePropName="checked">
          <Switch checkedChildren="vertical" unCheckedChildren="horizontal" />
        </FormItem>
        <FormItem name="current" label="current page">
          <Select options={pageOptions} />
        </FormItem>
        <Button size="small" type="dashed" onClick={addSlider}>
          Add a page
        </Button>
        <Button size="small" type="dashed" onClick={removeSlider}>
          Delete current page
        </Button>
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
