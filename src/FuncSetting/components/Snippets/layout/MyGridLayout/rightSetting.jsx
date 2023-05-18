import { PlusOutlined } from '@ant-design/icons'
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
  message,
} from 'antd'
import './index.less'
import MyRenderer from '@/App/Components/MyRenderer'

const FormItem = Form.Item

const defaultVal = {
  value: '',
  styles: {},
  attrs: {
    columnRatio: '4:4:4',
    mobileLayout: 'horizontal',
    columnGap: 20,
    rowGap: 20,
  },
  children: [
    {
      i: `div_easqaaaYmrIMRC3`,
      key: `div_easqaaaYmrIMRC3`,
      name: 'MyContainer',
      category: 'layout',
      title: 'Container',
      value: 'Drag and drop components or templates here',
      styles: {
        flexFlow: 'column nowrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        display: 'flex',
        position: 'relative',
        gridArea: `span 1 / span 4 / auto / auto`,
        minWidth: 'auto',
      },
      attrs: {},
      children: [
        {
          i: `text_c545aaa539-66a1-42`,
          key: `text_c545aaa539-66a1-42`,
          name: 'MyText',
          category: 'basic',
          title: 'Text1',
          value: 'Text1',
          styles: {},
          attrs: {},
        },
      ],
    },
    {
      i: `div_eas3b32mrIMRC3`,
      key: `div_eas3b32mrIMRC3`,
      name: 'MyContainer',
      category: 'layout',
      title: 'Container',
      value: 'Drag and drop components or templates here',
      styles: {
        flexFlow: 'column nowrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        display: 'flex',
        position: 'relative',
        gridArea: `span 1 / span 4 / auto / auto`,
        minWidth: 'auto',
      },
      attrs: {},
      children: [
        {
          i: `text_c3b32aa539-66a1-42`,
          key: `text_c3b32aa539-66a1-42`,
          name: 'MyText',
          category: 'basic',
          title: 'Text1',
          value: 'Text1',
          styles: {},
          attrs: {},
        },
      ],
    },
    {
      i: `div_eaf43aMRC3`,
      key: `div_eaf43aMRC3`,
      name: 'MyContainer',
      category: 'layout',
      title: 'Container',
      value: 'Drag and drop components or templates here',
      styles: {
        flexFlow: 'column nowrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        display: 'flex',
        position: 'relative',
        gridArea: `span 1 / span 4 / auto / auto`,
        minWidth: 'auto',
      },
      attrs: {},
      children: [
        {
          i: `text_c545aaaf43a-66a1-42`,
          key: `text_c545aaaf43a-66a1-42`,
          name: 'MyText',
          category: 'basic',
          title: 'Text1',
          value: 'Text1',
          styles: {},
          attrs: {},
        },
      ],
    },
  ],
}

const defaultRatioOptions = [
  { value: '12', label: '12' },
  { value: '6:6', label: '6:6' },
  { value: '3:9', label: '3:9' },
  { value: '9:3', label: '9:3' },
  { value: '4:4:4', label: '4:4:4' },
  { value: '3:6:3', label: '3:6:3' },
  { value: '3:3:3:3', label: '3:3:3:3' },
  { value: '2:2:2:2:2:2', label: '2:2:2:2:2:2' },
]

const Attribute = memo((props) => {
  const { selected, onAttrsChange } = props
  const form = useRef()
  const [ratio, setratio] = useState('')
  const [ratioOptions, setratioOptions] = useState(defaultRatioOptions)

  useEffect(() => {
    form?.current?.resetFields()
    form?.current?.setFieldsValue(selected.attrs)
  }, [selected.i])

  const onValuesChange = (changedValues, allValues) => {
    onAttrsChange(allValues)
  }

  const onRatioChange = (event) => {
    setratio(event.target.value)
  }

  const addItem = () => {
    ratio && setratioOptions([...ratioOptions, { value: ratio, label: ratio }])
    setratio('')
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
        <Divider>Basic attribute</Divider>
        <FormItem name="columnRatio" label="column ratio">
          <Select
            size="small"
            placeholder="select or input"
            options={ratioOptions}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                  <Input
                    style={{ flex: 'auto' }}
                    value={ratio}
                    onChange={onRatioChange}
                    placeholder="Please enter according to the format"
                    size="small"
                  />
                  <a
                    style={{
                      flex: 'none',
                      padding: '8px',
                      display: 'block',
                      cursor: 'pointer',
                    }}
                    onClick={addItem}
                  >
                    <PlusOutlined /> Add
                  </a>
                </div>
              </div>
            )}
          />
        </FormItem>
        <FormItem name="columnGap" label="column gap">
          <InputNumber type="number" size="small" addonAfter="px" />
        </FormItem>
        <FormItem name="rowGap" label="row gap">
          <InputNumber type="number" size="small" addonAfter="px" />
        </FormItem>
        <Divider>Mobile settings</Divider>
        <FormItem name="mobileLayout" label="layout">
          <Radio.Group
            options={[
              { value: 'vertical', label: 'vertical' },
              { value: 'horizontal', label: 'horizontal' },
            ]}
          />
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
