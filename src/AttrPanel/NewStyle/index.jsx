import get from 'lodash.get'
import set from 'lodash.set'
import React, { useState, useEffect, useRef, memo } from 'react'
import {
  AppleOutlined,
  FontColorsOutlined,
  DeploymentUnitOutlined,
  CaretRightOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AlignCenterOutlined,
  MenuOutlined,
  CloudUploadOutlined,
  PlusOutlined,
} from '@ant-design/icons'
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
  Space,
  Typography,
} from 'antd'
import ColorPicker from '@/components/ColorPicker'
import { ProFormDependency } from '@ant-design/pro-form'

import './index.less'

import Justify_space_around from '@/assets/img/Justify_space-around.svg'
import Justify_space_between from '@/assets/img/Justify_space-between.svg'
import Justify_flex_end from '@/assets/img/Justify_flex-end.svg'
import Justify_flex_start from '@/assets/img/Justify_flex-start.svg'
import Justify_center from '@/assets/img/Justify_center.svg'

import Align_baseline from '@/assets/img/Align_baseline.svg'
import Align_stretch from '@/assets/img/Align_stretch.svg'
import Align_flex_end from '@/assets/img/Align_flex-end.svg'
import Align_center from '@/assets/img/Align_center.svg'
import Align_flex_start from '@/assets/img/Align_flex-start.svg'

import cursor_default from '@/assets/img/cursor_default.svg'
import cursor_pointer from '@/assets/img/cursor_pointer.svg'

import { queryFileResourceListAll } from '@/mockService'

const FormItem = Form.Item

function connectValueUnit(value, unit) {
  const unit2 = unit === 'rpx' ? 'px' : unit
  return `${value}${unit2}`
}

const Index = memo((props) => {
  const { onNewStyleChange, dynamicStyles, selected } = props
  const [paddingValue, setpaddingValue] = useState()
  const [marginValue, setmarginValue] = useState()
  const [fontValue, setfontValue] = useState()
  const [opacityValue, setopacityValue] = useState()
  const [boxShadowValue, setboxShadowValue] = useState()
  const [imgListOptions, setimgListOptions] = useState([])
  const [bgUrl, setbgUrl] = useState('')
  const form = useRef()

  useEffect(() => {
    form?.current?.resetFields()
    const newDynamicStyles = splitUnit(dynamicStyles)
    console.log('dynamicStyles', dynamicStyles)
    console.log('newDynamicStyles', newDynamicStyles)
    form?.current?.setFieldsValue({
      ...newDynamicStyles,
      backgroundImage: newDynamicStyles?.backgroundImage?.startsWith('url(')
        ? newDynamicStyles.backgroundImage.slice(4, -1)
        : newDynamicStyles.backgroundImage,
    })
    setInnerState(newDynamicStyles)
  }, [selected.i])

  useEffect(() => {
    queryFileResourceListAll({ fileType: 'image' }).then((res) => {
      setimgListOptions(res?.map((it) => genImageOptions(it.fileName, it.fileUrl)))
    })
    return () => {}
  }, [])

  const splitUnit = (styles) => {
    // Separation of the css values and units
    const newStyles = { ...styles }
    hasUnitNames.map((k) => {
      const v = get(styles, k)
      if (v) {
        const newV = _splitUnit(v)
        newStyles[k] = newV
      }
    })
    return newStyles
  }

  const _splitUnit = (v) => {
    // Separation of the css values and units
    if (typeof v === 'string' && v !== '') {
      var split = v.match(/^([-.\d]+(?:\.\d+)?)(.*)$/)
      return { value: split[1].trim(), unit: split[2].trim() }
    } else {
      return v
    }
  }

  const genImageOptions = (name, url) => {
    return {
      value: url,
      label: (
        <Space>
          <img src={url} alt="" style={{ width: 35, height: 35 }} />
          <Typography.Text ellipsis>{name}</Typography.Text>
        </Space>
      ),
    }
  }

  const setInnerState = (styles) => {
    setopacityValue(typeof styles.opacity === 'number' && styles.opacity * 100)
    setpaddingValue(undefined)
    setmarginValue(undefined)
    setfontValue(undefined)
    setboxShadowValue(undefined)
  }

  const onValuesChange = (changedValues, allValues) => {
    console.log('on new style valuesChange raw', changedValues, allValues)
    const keys = Object.keys(changedValues)
    for (let i in keys) {
      const key = keys[i]
      if (key === 'borderStyleAll' || key === 'borderWidthAll' || key === 'borderColorAll') {
        modifyBorder(key, changedValues, allValues)
        return
      }
      if (key === 'borderRadiusAll') {
        modifyBorderRadius(key, changedValues, allValues)
        return
      }
      if (key === 'backgroundPositionAll') {
        modifyBackgroundPosition(key, changedValues, allValues)
        return
      }
      if (
        key === 'backgroundSize_2' ||
        key === 'backgroundSizeWidth' ||
        key === 'backgroundSizeHeight'
      ) {
        modifyBackgroundSize(key, changedValues, allValues)
        return
      }
      if (key === 'backgroundImage') {
        modifyBackgroundImage(key, changedValues, allValues)
        return
      }
      if (key === 'fillType') {
        modifyBackgroundAttr(key, changedValues, allValues)
        return
      }
      if (key === 'position') {
        modifyPosition(key, changedValues, allValues)
        return
      }
    }
    const v = { ...allValues }
    delete v.borderWidthAll
    delete v.borderRadiusAll
    delete v.borderStyleAll
    delete v.borderColorAll
    delete v.backgroundPositionAll
    delete v.backgroundSize_2
    delete v.backgroundSizeWidth
    delete v.backgroundSizeHeight
    onNewStyleChange(v)
  }

  const modifyBorder = (key, changedValues, allValues) => {
    if (allValues.borderType !== 'whole') {
      return
    }
    const keys = Object.keys(changedValues)
    if (key === 'borderStyleAll') {
      const v = allValues.borderStyleAll
      // TODO
      const values = {
        borderTopStyle: v,
        borderLeftStyle: v,
        borderRightStyle: v,
        borderBottomStyle: v,
      }
      form?.current?.setFieldsValue(values)
      onNewStyleChange(values)
      return
    }
    if (key === 'borderWidthAll') {
      const v = allValues.borderWidthAll
      const values = {
        borderTopWidth: v,
        borderLeftWidth: v,
        borderRightWidth: v,
        borderBottomWidth: v,
      }
      form?.current?.setFieldsValue(values)
      onNewStyleChange(values)
      return
    }
    if (key === 'borderColorAll') {
      const v = allValues.borderColorAll
      const values = {
        borderTopColor: v,
        borderLeftColor: v,
        borderRightColor: v,
        borderBottomColor: v,
      }
      form?.current?.setFieldsValue(values)
      onNewStyleChange(values)
      return
    }
  }

  const modifyBorderRadius = (key, changedValues, allValues) => {
    if (allValues.borderRadiusType !== 'whole') {
      return
    }
    const v = allValues.borderRadiusAll
    const values = {
      borderTopLeftRadius: v,
      borderTopRightRadius: v,
      borderBottomLeftRadius: v,
      borderBottomRightRadius: v,
    }
    form?.current?.setFieldsValue(values)
    onNewStyleChange(values)
  }

  const modifyBackgroundPosition = (key, changedValues, allValues) => {
    const m = {
      leftTop: [0, 0],
      centerTop: [50, 0],
      rightTop: [100, 0],
      leftCenter: [0, 50],
      center: [50, 50],
      rightCenter: [100, 50],
      leftBottom: [0, 100],
      centerBottom: [50, 100],
      rightBottom: [100, 100],
    }
    const values = {
      backgroundPositionX: m[changedValues.backgroundPositionAll]?.[0],
      backgroundPositionY: m[changedValues.backgroundPositionAll]?.[1],
    }
    form?.current?.setFieldsValue(values)
    onNewStyleChange(values)
  }

  const modifyBackgroundSize = (key, changedValues, allValues) => {
    const v = changedValues[key]
    if (key === 'backgroundSize_2') {
      form?.current?.setFieldsValue({
        backgroundSizeWidth: { value: undefined, unit: 'px' },
        backgroundSizeHeight: { value: undefined, unit: 'px' },
        backgroundSize: v,
      })
      onNewStyleChange({ backgroundSize: v })
    } else if (key === 'backgroundSizeWidth' || key === 'backgroundSizeHeight') {
      const w = allValues.backgroundSizeWidth,
        h = allValues.backgroundSizeHeight
      const width = (w?.value && `${w.value}${w.unit === 'rpx' ? 'px' : w.unit}`) || 'auto'
      const height = (h?.value && `${h.value}${h.unit === 'rpx' ? 'px' : h.unit}`) || 'auto'
      const size = `${width} ${height}`
      form?.current?.setFieldsValue({
        backgroundSize_2: { value: undefined, unit: 'px' },
        backgroundSize: size,
      })
      onNewStyleChange({
        backgroundSize: size,
      })
    }
  }

  const modifyBackgroundImage = (key, changedValues, allValues) => {
    const v = changedValues[key]
    const values = {
      backgroundImage: v ? `url(${v})` : undefined,
    }
    onNewStyleChange(values)
  }

  const modifyBackgroundAttr = (key, changedValues, allValues) => {
    const v = changedValues[key]
    let values = {}
    const valuesFillColor = {
      backgroundImage: undefined,
      backgroundPositionAll: 'leftTop',
      backgroundPositionX: undefined,
      backgroundPositionY: undefined,
      backgroundSize: undefined,
      backgroundSize_2: undefined,
      backgroundSizeWidth: { unit: 'px' },
      backgroundSizeHeight: { unit: 'px' },
      backgroundRepeat: undefined,
      backgroundAttachment: undefined,
    }
    const valuesFillImage = {
      backgroundColor: undefined,
    }
    if (v === 'fill-color') {
      values = valuesFillColor
    } else if (v === 'fill-image') {
      values = valuesFillImage
    } else {
      values = {
        ...valuesFillColor,
        ...valuesFillImage,
      }
    }
    form?.current?.setFieldsValue(values)
    delete values.backgroundPositionAll
    delete values.backgroundSize_2
    onNewStyleChange(values)
  }

  const modifyPosition = (key, changedValues, allValues) => {
    const values = {
      top: { unit: 'px' },
      right: { unit: 'px' },
      left: { unit: 'px' },
      bottom: { unit: 'px' },
      ...changedValues,
    }
    form?.current?.setFieldsValue(values)
    onNewStyleChange(values)
  }

  const gen_unitSelect = (name, units) => {
    const kvs = {
      px: 'px',
      '%': '%',
      auto: 'auto',
      em: 'em',
      null: 'null',
      inherit: 'inherit',
      vw: 'vw',
      vh: 'vh',
    }
    return (
      <FormItem name={name} noStyle>
        <Select style={{ width: 66 }}>
          {units.map((item) => {
            return (
              <Select.Option value={item} key={item}>
                {kvs[item]}
              </Select.Option>
            )
          })}
        </Select>
      </FormItem>
    )
  }

  const hasUnitNames = [
    // Fields with units:
    'top',
    'right',
    'left',
    'bottom',
    'width',
    'height',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'fontSize',
    'lineHeight',
    'borderTopWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderWidthAll',
    'borderRadiusAll',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'backgroundSizeWidth',
    'backgroundSizeHeight',
    'boxShadow.x',
    'boxShadow.y',
    'boxShadow.blur',
    'boxShadow.spread',
  ]

  const getInitialValues = () => {
    let initialValuesWithUnit = {}
    hasUnitNames.map((k) => {
      set(initialValues, k, { unit: 'px' })
    })
    const initialValues = {
      ...initialValuesWithUnit,
      // other
      fillType: 'none',
      borderType: 'whole',
      borderRadiusType: 'whole',
      borderStyle: 'none',
      backgroundPositionAll: 'leftTop',
      backgroundAttachment: 'scroll',
    }
    return initialValues
  }

  const onChangeMargin = (value) => {
    setmarginValue(value)
    const unit = 'px'
    if (value === 'default') {
      form?.current?.setFieldsValue({
        marginTop: { value: undefined, unit },
        marginBottom: { value: undefined, unit },
        marginLeft: { value: undefined, unit },
        marginRight: { value: undefined, unit },
      })
    } else if (value === 'custom') {
    } else {
      form?.current?.setFieldsValue({
        marginTop: { value, unit },
        marginBottom: { value, unit },
        marginLeft: { value, unit },
        marginRight: { value, unit },
      })
    }
    const values = form?.current?.getFieldsValue()
    onNewStyleChange(values)
  }

  const onChangePadding = (value) => {
    setpaddingValue(value)
    const unit = 'px'
    if (value === 'default') {
      form?.current?.setFieldsValue({
        paddingTop: { value: undefined, unit },
        paddingBottom: { value: undefined, unit },
        paddingLeft: { value: undefined, unit },
        paddingRight: { value: undefined, unit },
      })
    } else if (value === 'custom') {
    } else {
      form?.current?.setFieldsValue({
        paddingTop: { value, unit },
        paddingBottom: { value, unit },
        paddingLeft: { value, unit },
        paddingRight: { value, unit },
      })
    }
    const values = form?.current?.getFieldsValue()
    onNewStyleChange(values)
  }

  const onChangeFont = (value) => {
    setfontValue(value)
    const unit = 'px',
      fontStyle = 'normal'
    if (value === 'level-1') {
      form?.current?.setFieldsValue({
        fontWeight: 'bold',
        fontSize: { value: 20, unit },
        lineHeight: { value: 30, unit },
        fontStyle,
      })
    } else if (value === 'level-2') {
      form?.current?.setFieldsValue({
        fontWeight: 'bold',
        fontSize: { value: 16, unit },
        lineHeight: { value: 24, unit },
        fontStyle,
      })
    } else if (value === 'level-3') {
      form?.current?.setFieldsValue({
        fontWeight: 'bold',
        fontSize: { value: 14, unit },
        lineHeight: { value: 22, unit },
        fontStyle,
      })
    } else if (value === 'paragraph') {
      form?.current?.setFieldsValue({
        fontSize: { value: 14, unit },
        lineHeight: { value: 22, unit },
        fontStyle,
      })
    } else if (value === 'default') {
      form?.current?.setFieldsValue({
        fontWeight: undefined,
        fontSize: { value: undefined, unit },
        lineHeight: { value: undefined, unit },
        fontStyle,
      })
    } else if (value === 'custom') {
    }
    const values = form?.current?.getFieldsValue()
    onNewStyleChange(values)
  }

  const handleBackgroundImage = (e) => {
    console.log(e)
  }

  const onChangeOpacity = (value) => {
    setopacityValue(value)
    typeof value === 'number' && onNewStyleChange({ opacity: value / 100 })
  }

  const onChangeBoxShadow = (value) => {
    setboxShadowValue(value)
    const unit = 'px',
      color = 'rgb(31 56 88 / 20%)'
    if (value === 'large') {
      form?.current?.setFieldsValue({
        boxShadow: {
          x: { unit, value: 4 },
          y: { unit, value: 4 },
          blur: { unit, value: 15 },
          spread: { unit, value: 0 },
          color,
        },
      })
    } else if (value === 'middle') {
      form?.current?.setFieldsValue({
        boxShadow: {
          x: { unit, value: 2 },
          y: { unit, value: 2 },
          blur: { unit, value: 10 },
          spread: { unit, value: 0 },
          color,
        },
      })
    } else if (value === 'small') {
      form?.current?.setFieldsValue({
        boxShadow: {
          x: { unit, value: 1 },
          y: { unit, value: 1 },
          blur: { unit, value: 4 },
          spread: { unit, value: 0 },
          color,
        },
      })
    } else if (value === 'none') {
      form?.current?.setFieldsValue({
        boxShadow: {
          x: { unit, value: 0 },
          y: { unit, value: 0 },
          blur: { unit, value: 0 },
          spread: { unit, value: 0 },
          color,
        },
      })
    } else if (value === 'default') {
      form?.current?.setFieldsValue({
        boxShadow: {
          x: { unit, value: undefined },
          y: { unit, value: undefined },
          blur: { unit, value: undefined },
          spread: { unit, value: undefined },
          color: undefined,
        },
      })
    } else {
    }
    const values = form?.current?.getFieldsValue()
    onNewStyleChange(values)
  }

  const onUrlChange = (event) => {
    setbgUrl(event.target.value)
  }

  const addUrlItem = () => {
    bgUrl && setimgListOptions([...imgListOptions, genImageOptions(bgUrl, bgUrl)])
    setbgUrl('')
  }

  return (
    <Form
      onFinish={(params) => console.log('onfinish')}
      onValuesChange={onValuesChange}
      ref={form}
      initialValues={getInitialValues()}
    >
      <div className="newStyle">
        <div className="newStyle-item">
          <span className="newStyle-item-title">display</span>
          <FormItem name="display" noStyle>
            <Select style={{ width: 180 }} size="small" popupClassName="designer-dropdown">
              <Select.Option value="block">block</Select.Option>
              <Select.Option value="flex">flex</Select.Option>
              <Select.Option value="inline-block">inline-block</Select.Option>
              <Select.Option value="inline">inline</Select.Option>
              <Select.Option value="none">none</Select.Option>
            </Select>
          </FormItem>
        </div>
        <ProFormDependency name={['display']}>
          {({ display }) => {
            return (
              <div
                style={{
                  paddingBottom: 6,
                  marginBottom: 6,
                  borderBottom: '1px solid #f5f5f5',
                  display: display !== 'flex' ? 'none' : undefined,
                }}
              >
                <div className="newStyle-smallItem">
                  <span>flex-direction</span>
                  <FormItem name="flexDirection" noStyle>
                    <Radio.Group size="small">
                      <Radio.Button value="row">row</Radio.Button>
                      <Radio.Button value="row-reverse">row-reverse</Radio.Button>
                      <Radio.Button value="column">column</Radio.Button>
                      <Radio.Button value="column-reverse">column-reverse</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </div>
                <div className="newStyle-smallItem">
                  <span>justify-content</span>
                  <FormItem name="justifyContent" noStyle>
                    <Radio.Group size="small">
                      <Radio.Button value="flex-start">
                        <Tooltip title="flex-start">
                          <img src={Justify_flex_start} />
                        </Tooltip>
                      </Radio.Button>
                      <Radio.Button value="flex-end">
                        <Tooltip title="flex-end">
                          <img src={Justify_flex_end} />
                        </Tooltip>
                      </Radio.Button>
                      <Radio.Button value="center">
                        <Tooltip title="center">
                          <img src={Justify_center} />
                        </Tooltip>
                      </Radio.Button>
                      <Radio.Button value="space-around">
                        <Tooltip title="space-around">
                          <img src={Justify_space_around} />
                        </Tooltip>
                      </Radio.Button>
                      <Radio.Button value="space-between">
                        <Tooltip title="space-between">
                          <img src={Justify_space_between} />
                        </Tooltip>
                      </Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </div>
                <div className="newStyle-smallItem">
                  <span>align-items</span>
                  <FormItem name="alignItems" noStyle>
                    <Radio.Group size="small">
                      <Radio.Button value="flex-start">
                        <Tooltip title="flex-start">
                          <img src={Align_flex_start} />
                        </Tooltip>
                      </Radio.Button>
                      <Radio.Button value="flex-end">
                        <Tooltip title="flex-end">
                          <img src={Align_flex_end} />
                        </Tooltip>
                      </Radio.Button>
                      <Radio.Button value="center">
                        <Tooltip title="center">
                          <img src={Align_center} />
                        </Tooltip>
                      </Radio.Button>
                      <Radio.Button value="baseline">
                        <Tooltip title="baseline">
                          <img src={Align_baseline} />
                        </Tooltip>
                      </Radio.Button>
                      <Radio.Button value="stretch">
                        <Tooltip title="stretch">
                          <img src={Align_stretch} />
                        </Tooltip>
                      </Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </div>
                <div className="newStyle-smallItem">
                  <span>flex-wrap</span>
                  <FormItem name="flexWrap" noStyle>
                    <Radio.Group size="small">
                      <Radio.Button value="nowrap">nowrap</Radio.Button>
                      <Radio.Button value="wrap">wrap</Radio.Button>
                      <Radio.Button value="wrap-reverse">wrap-reverse</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </div>
              </div>
            )
          }}
        </ProFormDependency>
        <div className="newStyle-item">
          <span className="newStyle-item-title">width</span>
          <FormItem name={['width', 'value']} noStyle>
            <InputNumber
              style={{ width: 180 }}
              type="number"
              size="small"
              addonAfter={gen_unitSelect(['width', 'unit'], ['px', '%', 'vw', 'vh'])}
            />
          </FormItem>
        </div>
        <div className="newStyle-item">
          <span className="newStyle-item-title">height</span>
          <FormItem name={['height', 'value']} noStyle>
            <InputNumber
              style={{ width: 180 }}
              type="number"
              size="small"
              addonAfter={gen_unitSelect(['height', 'unit'], ['px', '%', 'vw', 'vh'])}
            />
          </FormItem>
        </div>
        <div className="newStyle-item">
          <Collapse
            defaultActiveKey={[]}
            ghost
            style={{ width: '100%' }}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            <Collapse.Panel header={<span className="newStyle-item-title">position</span>} key="1">
              <div className="newStyle-item newStyle-item-wholeSetting">
                <span className="newStyle-item-wholeSetting-title">position</span>
                <FormItem name="position" noStyle>
                  <Select
                    style={{ width: 180 }}
                    size="small"
                    popupClassName="designer-dropdown"
                    allowClear
                  >
                    <Select.Option value="static">static</Select.Option>
                    <Select.Option value="relative">relative</Select.Option>
                    <Select.Option value="absolute">absolute</Select.Option>
                    <Select.Option value="fixed">fixed</Select.Option>
                  </Select>
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>top</span>
                <FormItem name={['top', 'value']} noStyle>
                  <InputNumber
                    style={{ width: 180 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['top', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>bottom</span>
                <FormItem name={['bottom', 'value']} noStyle>
                  <InputNumber
                    style={{ width: 180 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['bottom', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>left</span>
                <FormItem name={['left', 'value']} noStyle>
                  <InputNumber
                    style={{ width: 180 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['left', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>right</span>
                <FormItem name={['right', 'value']} noStyle>
                  <InputNumber
                    style={{ width: 180 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['right', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>z-index</span>
                <FormItem name={'zIndex'} noStyle>
                  <InputNumber style={{ width: 180 }} type="number" size="small" />
                </FormItem>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
        {/* <div className="newStyle-item">
          <span className="newStyle-item-title">status</span>
          <div>
            <FormItem name="status" noStyle>
              <Select
                style={{ width: 180 }}
                name="status"
                size="small"
                options={[
                  { value: 'default', label: 'default' },
                  { value: ':hover', label: ':hover' },
                  { value: ':focus', label: ':focus' },
                  { value: ':active', label: ':active' },
                ]}
              />
            </FormItem>
          </div>
        </div> */}
        <div className="newStyle-item">
          <Collapse
            defaultActiveKey={[]}
            ghost
            style={{ width: '100%' }}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            <Collapse.Panel header={<span className="newStyle-item-title">margin</span>} key="1">
              <div className="newStyle-item newStyle-item-wholeSetting">
                <span className="newStyle-item-wholeSetting-title">whole setting</span>
                <Select
                  className="newStyle-item-settingAll"
                  placeholder="default"
                  size="small"
                  dropdownStyle={{ height: 260 }}
                  listHeight={260}
                  popupClassName="designer-dropdown"
                  onChange={onChangeMargin}
                  value={marginValue}
                  allowClear
                >
                  <Select.Option value="24">huge(24px)</Select.Option>
                  <Select.Option value="20">large(20px)</Select.Option>
                  <Select.Option value="16">middle(16px)</Select.Option>
                  <Select.Option value="12">small(12px)</Select.Option>
                  <Select.Option value="8">tiny(8px)</Select.Option>
                  <Select.Option value="0">none(0px)</Select.Option>
                  <Select.Option value="default">default</Select.Option>
                  <Select.Option value="custom">custom</Select.Option>
                </Select>
              </div>
              <div className="newStyle-smallItem">
                <span>margin-top</span>
                <FormItem name={['marginTop', 'value']} noStyle>
                  <InputNumber
                    placeholder="default"
                    style={{ width: 176 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['marginTop', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>margin-bottom</span>
                <FormItem name={['marginBottom', 'value']} noStyle>
                  <InputNumber
                    placeholder="default"
                    style={{ width: 176 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['marginBottom', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>marginleft</span>
                <FormItem name={['marginLeft', 'value']} noStyle>
                  <InputNumber
                    placeholder="default"
                    style={{ width: 176 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['marginLeft', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>margin-right</span>
                <FormItem name={['marginRight', 'value']} noStyle>
                  <InputNumber
                    placeholder="default"
                    style={{ width: 176 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['marginRight', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
        <div className="newStyle-item">
          <Collapse
            defaultActiveKey={[]}
            ghost
            style={{ width: '100%' }}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            <Collapse.Panel header={<span className="newStyle-item-title">padding</span>} key="1">
              <div className="newStyle-item newStyle-item-wholeSetting">
                <span className="newStyle-item-wholeSetting-title">whole setting</span>
                <Select
                  className="newStyle-item-settingAll"
                  placeholder="default"
                  size="small"
                  dropdownStyle={{ height: 260 }}
                  listHeight={260}
                  popupClassName="designer-dropdown"
                  onChange={onChangePadding}
                  value={paddingValue}
                  allowClear
                >
                  <Select.Option value="24">huge(24px)</Select.Option>
                  <Select.Option value="20">large(20px)</Select.Option>
                  <Select.Option value="16">middle(16px)</Select.Option>
                  <Select.Option value="12">small(12px)</Select.Option>
                  <Select.Option value="8">tiny(8px)</Select.Option>
                  <Select.Option value="0">none(0px)</Select.Option>
                  <Select.Option value="default">default</Select.Option>
                  <Select.Option value="custom">custom</Select.Option>
                </Select>
              </div>
              <div className="newStyle-smallItem">
                <span>padding-top</span>
                <FormItem name={['paddingTop', 'value']} noStyle>
                  <InputNumber
                    placeholder="default"
                    style={{ width: 176 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['paddingTop', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>padding-bottom</span>
                <FormItem name={['paddingBottom', 'value']} noStyle>
                  <InputNumber
                    placeholder="default"
                    style={{ width: 176 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['paddingBottom', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>padding-left</span>
                <FormItem name={['paddingLeft', 'value']} noStyle>
                  <InputNumber
                    placeholder="default"
                    style={{ width: 176 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['paddingLeft', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
              <div className="newStyle-smallItem">
                <span>padding-right</span>
                <FormItem name={['paddingRight', 'value']} noStyle>
                  <InputNumber
                    placeholder="default"
                    style={{ width: 176 }}
                    type="number"
                    size="small"
                    addonAfter={gen_unitSelect(['paddingRight', 'unit'], ['px', '%'])}
                  />
                </FormItem>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
        <div className="newStyle-item">
          <Collapse
            defaultActiveKey={[]}
            ghost
            style={{ width: '100%' }}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            <Collapse.Panel header={<span className="newStyle-item-title">font</span>} key="1">
              <div className="newStyle-item newStyle-item-wholeSetting">
                <span className="newStyle-item-wholeSetting-title">whole setting</span>
                <Select
                  className="newStyle-item-settingAll"
                  size="small"
                  popupClassName="designer-dropdown"
                  onChange={onChangeFont}
                  value={fontValue}
                  allowClear
                >
                  <Select.Option value="level-1">level 1</Select.Option>
                  <Select.Option value="level-2">level 2</Select.Option>
                  <Select.Option value="level-3">level 3</Select.Option>
                  <Select.Option value="paragraph">paragraph</Select.Option>
                  <Select.Option value="default">default</Select.Option>
                  <Select.Option value="custom">custom</Select.Option>
                </Select>
              </div>
              <div className="newStyle-smallItem">
                <Col span={4}>font-family</Col>
                <Col span={16}>
                  <FormItem name={'fontFamily'} noStyle>
                    <Select
                      style={{ width: '100%' }}
                      size="small"
                      popupClassName="designer-dropdown"
                      dropdownStyle={{ height: 420 }}
                      listHeight={420}
                    >
                      <Select.Option
                        value="arial, helvetica, microsoft yahei"
                        style={{ fontFamily: 'arial, helvetica, microsoft yahei' }}
                      >
                        Arial, Helvetica, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="arial, helvetica, simhei"
                        style={{ fontFamily: 'arial, helvetica, simhei' }}
                      >
                        Arial, Helvetica, simhei
                      </Select.Option>
                      <Select.Option
                        value="comic sans ms, microsoft yahei"
                        style={{ fontFamily: 'comic sans ms, microsoft yahei' }}
                      >
                        Comic Sans MS, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="comic sans ms, simhei"
                        style={{ fontFamily: 'comic sans ms, simhei' }}
                      >
                        Comic Sans MS, simhei
                      </Select.Option>
                      <Select.Option
                        value="impact, microsoft yahei"
                        style={{ fontFamily: 'impact, microsoft yahei' }}
                      >
                        Impact, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="impact, simhei"
                        style={{ fontFamily: 'impact, simhei' }}
                      >
                        Impact, simhei
                      </Select.Option>
                      <Select.Option
                        value="lucida sans unicode, microsoft yahei"
                        style={{ fontFamily: 'lucida sans unicode, microsoft yahei' }}
                      >
                        Lucida Sans Unicode, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="lucida sans unicode, simhei"
                        style={{ fontFamily: 'lucida sans unicode, simhei' }}
                      >
                        Lucida Sans Unicode, simhei
                      </Select.Option>
                      <Select.Option
                        value="trebuchet ms, microsoft yahei"
                        style={{ fontFamily: 'trebuchet ms, microsoft yahei' }}
                      >
                        Trebuchet MS, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="trebuchet ms, simhei"
                        style={{ fontFamily: 'trebuchet ms, simhei' }}
                      >
                        Trebuchet MS, simhei
                      </Select.Option>
                      <Select.Option
                        value="verdana, microsoft yahei"
                        style={{ fontFamily: 'verdana, microsoft yahei' }}
                      >
                        Verdana, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="verdana, simhei"
                        style={{ fontFamily: 'verdana, simhei' }}
                      >
                        Verdana, simhei
                      </Select.Option>
                      <Select.Option
                        value="georgia, microsoft yahei"
                        style={{ fontFamily: 'georgia, microsoft yahei' }}
                      >
                        Georgia, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="georgia, simhei"
                        style={{ fontFamily: 'georgia, simhei' }}
                      >
                        Georgia, simhei
                      </Select.Option>
                      <Select.Option
                        value="palatino linotype, microsoft yahei"
                        style={{ fontFamily: 'palatino linotype, microsoft yahei' }}
                      >
                        Palatino Linotype, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="palatino linotype, simhei"
                        style={{ fontFamily: 'palatino linotype, simhei' }}
                      >
                        Palatino Linotype, simhei
                      </Select.Option>
                      <Select.Option
                        value="times new roman, microsoft yahei"
                        style={{ fontFamily: 'times new roman, microsoft yahei' }}
                      >
                        Times New Roman, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="times new roman, simhei"
                        style={{ fontFamily: 'times new roman, simhei' }}
                      >
                        Times New Roman, simhei
                      </Select.Option>
                      <Select.Option
                        value="courier new, microsoft yahei"
                        style={{ fontFamily: 'courier new, microsoft yahei' }}
                      >
                        Courier New, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="courier new, simhei"
                        style={{ fontFamily: 'courier new, simhei' }}
                      >
                        Courier New, simhei
                      </Select.Option>
                      <Select.Option
                        value="lucida console, microsoft yahei"
                        style={{ fontFamily: 'lucida console, microsoft yahei' }}
                      >
                        Lucida Console, microsoft yahei
                      </Select.Option>
                      <Select.Option
                        value="lucida console, simhei"
                        style={{ fontFamily: 'lucida console, simhei' }}
                      >
                        Lucida Console, simhei
                      </Select.Option>
                    </Select>
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col span={4}>font-weight</Col>
                <Col span={16}>
                  <FormItem name="fontWeight" noStyle>
                    <Select
                      size="small"
                      style={{ width: '100%' }}
                      popupClassName="designer-dropdown"
                    >
                      <Select.Option value="100">100 Thin</Select.Option>
                      <Select.Option value="200">100 Extra Light</Select.Option>
                      <Select.Option value="300">100 Light</Select.Option>
                      <Select.Option value="normal">400 Normal</Select.Option>
                      <Select.Option value="500">500 Medium</Select.Option>
                      <Select.Option value="600">600 Semi Bold</Select.Option>
                      <Select.Option value="bold">700 Bold</Select.Option>
                      <Select.Option value="800">800 Extra Bold</Select.Option>
                      <Select.Option value="900">900 Black</Select.Option>
                      <Select.Option value="lighter">Lighter</Select.Option>
                      <Select.Option value="bolder">Bolder</Select.Option>
                    </Select>
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col>font-style</Col>
                <Col>
                  <FormItem name="fontStyle" noStyle>
                    <Radio.Group size="small">
                      <Radio.Button value="normal">normal</Radio.Button>
                      <Radio.Button value="italic">italic</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col>color</Col>
                <Col>
                  <FormItem name="color" noStyle>
                    <ColorPicker />
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col>font-size</Col>
                <Col>
                  <FormItem name={['fontSize', 'value']} noStyle>
                    <InputNumber
                      style={{ width: 180 }}
                      type="number"
                      size="small"
                      addonAfter={gen_unitSelect(['fontSize', 'unit'], ['px', '%'])}
                    />
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col>line-height</Col>
                <Col>
                  <FormItem name={['lineHeight', 'value']} noStyle>
                    <InputNumber
                      style={{ width: 180 }}
                      type="number"
                      size="small"
                      addonAfter={gen_unitSelect(['lineHeight', 'unit'], ['px', '%'])}
                    />
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col>text-align</Col>
                <Col>
                  <FormItem name="textAlign" noStyle>
                    <Radio.Group size="small">
                      <Radio.Button value="left">
                        <AlignLeftOutlined />
                      </Radio.Button>
                      <Radio.Button value="center">
                        <AlignCenterOutlined />
                      </Radio.Button>
                      <Radio.Button value="right">
                        <AlignRightOutlined />
                      </Radio.Button>
                      <Radio.Button value="justify">
                        <MenuOutlined />
                      </Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col>text-decoration</Col>
                <Col>
                  <FormItem name="textDecoration" noStyle>
                    <Radio.Group size="small">
                      <Radio.Button value="none">none</Radio.Button>
                      <Radio.Button value="underline">underline</Radio.Button>
                      <Radio.Button value="line-through">line-through</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </Col>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
        <div className="newStyle-item">
          <Collapse
            defaultActiveKey={[]}
            ghost
            style={{ width: '100%' }}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            <Collapse.Panel
              header={<span className="newStyle-item-title">background</span>}
              key="1"
            >
              <div className="newStyle-smallItem">
                <span>fill-type</span>
                <FormItem name="fillType" noStyle>
                  <Radio.Group size="small">
                    <Radio.Button value="none">none</Radio.Button>
                    <Radio.Button value="fill-color">fill color</Radio.Button>
                    <Radio.Button value="fill-image">fill image</Radio.Button>
                  </Radio.Group>
                </FormItem>
              </div>
              <ProFormDependency name={['fillType']}>
                {({ fillType }) => {
                  if (fillType === 'fill-color') {
                    return (
                      <div className="newStyle-smallItem">
                        <Col>background-color</Col>
                        <Col>
                          <FormItem name="backgroundColor" noStyle>
                            <ColorPicker />
                          </FormItem>
                        </Col>
                      </div>
                    )
                  } else if (fillType === 'fill-image') {
                    return (
                      <>
                        <div className="newStyle-smallItem">
                          <Col span={4}>image</Col>
                          <Col span={20}>
                            <FormItem name="backgroundImage" noStyle>
                              <Select
                                style={{ width: '100%' }}
                                options={imgListOptions}
                                placeholder="input url or select"
                                allowClear
                                dropdownRender={(menu) => (
                                  <div>
                                    {menu}
                                    <Divider style={{ margin: '4px 0' }} />
                                    <div
                                      style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}
                                    >
                                      <Input
                                        style={{ flex: 'auto' }}
                                        value={bgUrl}
                                        onChange={onUrlChange}
                                      />
                                      <a
                                        style={{
                                          flex: 'none',
                                          padding: '8px',
                                          display: 'block',
                                          cursor: 'pointer',
                                        }}
                                        onClick={addUrlItem}
                                      >
                                        <PlusOutlined /> Add
                                      </a>
                                    </div>
                                  </div>
                                )}
                              />
                            </FormItem>
                          </Col>
                        </div>
                        {/* <div
                          style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <Button
                            type="link"
                            onClick={() => {
                              console.log("history.push('/fileManage')")
                            }}
                          >
                            go file manager
                          </Button>
                        </div> */}

                        <ProFormDependency name={['backgroundImage']}>
                          {({ backgroundImage }) => {
                            if (backgroundImage) {
                              return (
                                <>
                                  <div>background-position</div>
                                  <div className="newStyle-smallItem">
                                    <Col span={6}>
                                      <FormItem name="backgroundPositionAll" noStyle>
                                        <Radio.Group size="small" style={{ width: '100%' }}>
                                          <div style={{ display: 'flex' }}>
                                            <Radio.Button value="leftTop">↖</Radio.Button>
                                            <Radio.Button value="centerTop">↑</Radio.Button>
                                            <Radio.Button value="rightTop">↗</Radio.Button>
                                          </div>
                                          <div style={{ display: 'flex' }}>
                                            <Radio.Button value="leftCenter">←</Radio.Button>
                                            <Radio.Button value="center">+</Radio.Button>
                                            <Radio.Button value="rightCenter">→</Radio.Button>
                                          </div>
                                          <div style={{ display: 'flex' }}>
                                            <Radio.Button value="leftBottom">↙</Radio.Button>
                                            <Radio.Button value="centerBottom">↓</Radio.Button>
                                            <Radio.Button value="rightBottom">↘</Radio.Button>
                                          </div>
                                        </Radio.Group>
                                      </FormItem>
                                    </Col>
                                    <Col span={17}>
                                      <Row justify="space-between" style={{ paddingBottom: 8 }}>
                                        <Col span={6}>background-position-x</Col>
                                        <Col span={18}>
                                          <FormItem name="backgroundPositionX" noStyle>
                                            <InputNumber
                                              style={{ width: '100%' }}
                                              type="number"
                                              size="small"
                                              placeholder="0"
                                              addonAfter={'%'}
                                            />
                                          </FormItem>
                                        </Col>
                                      </Row>
                                      <Row justify="space-between" style={{ paddingBottom: 8 }}>
                                        <Col span={6}>background-position-y</Col>
                                        <Col span={18}>
                                          <FormItem name="backgroundPositionY" noStyle>
                                            <InputNumber
                                              style={{ width: '100%' }}
                                              type="number"
                                              size="small"
                                              placeholder="0"
                                              addonAfter={'%'}
                                            />
                                          </FormItem>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </div>
                                  <div>background-size</div>
                                  <div className="newStyle-smallItem">
                                    <Col span={10}>
                                      <FormItem name="backgroundSize" hidden>
                                        <Input />
                                      </FormItem>
                                      <FormItem name="backgroundSize_2" noStyle>
                                        <Radio.Group size="small" style={{ width: '100%' }}>
                                          <Radio.Button value="cover">cover</Radio.Button>
                                          <Radio.Button value="contain">contain</Radio.Button>
                                        </Radio.Group>
                                      </FormItem>
                                    </Col>
                                    <Col span={14}>
                                      <Row justify="space-between" style={{ paddingBottom: 8 }}>
                                        <Col span={4}>background width</Col>
                                        <Col span={20}>
                                          <FormItem name={['backgroundSizeWidth', 'value']} noStyle>
                                            <InputNumber
                                              style={{ width: '100%' }}
                                              type="number"
                                              size="small"
                                              placeholder="auto"
                                              addonAfter={gen_unitSelect(
                                                ['backgroundSizeWidth', 'unit'],
                                                ['px', '%'],
                                              )}
                                            />
                                          </FormItem>
                                        </Col>
                                      </Row>
                                      <Row justify="space-between" style={{ paddingBottom: 8 }}>
                                        <Col span={4}>background height</Col>
                                        <Col span={20}>
                                          <FormItem
                                            name={['backgroundSizeHeight', 'value']}
                                            noStyle
                                          >
                                            <InputNumber
                                              style={{ width: '100%' }}
                                              type="number"
                                              size="small"
                                              placeholder="auto"
                                              addonAfter={gen_unitSelect(
                                                ['backgroundSizeHeight', 'unit'],
                                                ['px', '%'],
                                              )}
                                            />
                                          </FormItem>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </div>
                                  <div className="newStyle-smallItem">
                                    <Col>background-repeat</Col>
                                    <Col>
                                      <FormItem name="backgroundRepeat" noStyle>
                                        <Select
                                          className="newStyle-item-settingAll"
                                          size="small"
                                          options={[
                                            { value: 'repeat', label: 'repeat' },
                                            { value: 'repeat-x', label: 'repeat-x' },
                                            { value: 'repeat-y', label: 'repeat-y' },
                                            { value: 'no-repeat', label: 'no-repeat' },
                                          ]}
                                          popupClassName="designer-dropdown"
                                          allowClear
                                        ></Select>
                                      </FormItem>
                                    </Col>
                                  </div>
                                  <div className="newStyle-smallItem">
                                    <Col>background-attachment</Col>
                                    <Col>
                                      <FormItem name="backgroundAttachment" noStyle>
                                        <Radio.Group size="small" style={{ width: '100%' }}>
                                          <Radio.Button value="scroll">
                                            <Tooltip title="scroll">scroll</Tooltip>
                                          </Radio.Button>
                                          <Radio.Button value="fixed">
                                            <Tooltip title="fixed">fixed</Tooltip>
                                          </Radio.Button>
                                        </Radio.Group>
                                      </FormItem>
                                    </Col>
                                  </div>
                                </>
                              )
                            }
                          }}
                        </ProFormDependency>
                      </>
                    )
                  }
                }}
              </ProFormDependency>
            </Collapse.Panel>
          </Collapse>
        </div>
        <div className="newStyle-item">
          <Collapse
            defaultActiveKey={[]}
            ghost
            style={{ width: '100%' }}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            <Collapse.Panel header={<span className="newStyle-item-title">border</span>} key="1">
              <div className="newStyle-smallItem">
                <Col span={8}>
                  <FormItem name="borderType" noStyle>
                    <Radio.Group size="small" style={{ width: '100%' }}>
                      <div style={{ textAlign: 'center' }}>
                        <Radio.Button value="top">┳</Radio.Button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Radio.Button value="left">┣</Radio.Button>
                        <Radio.Button value="whole">╋</Radio.Button>
                        <Radio.Button value="right">┫</Radio.Button>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Radio.Button value="bottom">┻</Radio.Button>
                      </div>
                    </Radio.Group>
                  </FormItem>
                </Col>
                <Col span={15}>
                  <ProFormDependency name={['borderType']}>
                    {({ borderType }) => {
                      const names = {
                        top: {
                          style: 'borderTopStyle',
                          width: 'borderTopWidth',
                          color: 'borderTopColor',
                        },
                        left: {
                          style: 'borderLeftStyle',
                          width: 'borderLeftWidth',
                          color: 'borderLeftColor',
                        },
                        whole: {
                          style: 'borderStyleAll',
                          width: 'borderWidthAll',
                          color: 'borderColorAll',
                        },
                        right: {
                          style: 'borderRightStyle',
                          width: 'borderRightWidth',
                          color: 'borderRightColor',
                        },
                        bottom: {
                          style: 'borderBottomStyle',
                          width: 'borderBottomWidth',
                          color: 'borderBottomColor',
                        },
                      }
                      if (borderType) {
                        return (
                          <>
                            <Row justify="space-between" style={{ paddingBottom: 8 }}>
                              <Col>border-style</Col>
                              <Col>
                                <FormItem name={names[borderType].style} noStyle>
                                  <Radio.Group size="small">
                                    <Radio.Button value="none">none</Radio.Button>
                                    <Radio.Button value="solid">solid</Radio.Button>
                                    <Radio.Button value="dashed">dashed</Radio.Button>
                                    <Radio.Button value="dotted">dotted</Radio.Button>
                                  </Radio.Group>
                                </FormItem>
                              </Col>
                            </Row>
                            <Row justify="space-between" style={{ paddingBottom: 8 }}>
                              <Col>border-width</Col>
                              <Col>
                                <FormItem name={[names[borderType].width, 'value']} noStyle>
                                  <InputNumber
                                    style={{ width: 160 }}
                                    type="number"
                                    size="small"
                                    addonAfter={gen_unitSelect(
                                      [names[borderType].width, 'unit'],
                                      ['px', '%'],
                                    )}
                                  />
                                </FormItem>
                              </Col>
                            </Row>
                            <Row justify="space-between" style={{ paddingBottom: 8 }}>
                              <Col>border-color</Col>
                              <Col>
                                <FormItem name={names[borderType].color} noStyle>
                                  <ColorPicker />
                                </FormItem>
                              </Col>
                            </Row>
                          </>
                        )
                      }
                      return <div></div>
                    }}
                  </ProFormDependency>
                </Col>
              </div>
              <div className="newStyle-smallItem" style={{ alignItems: 'center' }}>
                <Col span={8}>
                  <FormItem name="borderRadiusType" noStyle>
                    <Radio.Group size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Radio.Button value="topLeft">┏</Radio.Button>
                        <Radio.Button value="topRight">┓</Radio.Button>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Radio.Button value="whole">╋</Radio.Button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Radio.Button value="bottomLeft">┗</Radio.Button>
                        <Radio.Button value="bottomRight">┛</Radio.Button>
                      </div>
                    </Radio.Group>
                  </FormItem>
                </Col>
                <Col span={15}>
                  <ProFormDependency name={['borderRadiusType']}>
                    {({ borderRadiusType }) => {
                      const names = {
                        topLeft: 'borderTopLeftRadius',
                        topRight: 'borderTopRightRadius',
                        whole: 'borderRadiusAll',
                        bottomLeft: 'borderBottomLeftRadius',
                        bottomRight: 'borderBottomRightRadius',
                      }
                      if (borderRadiusType) {
                        return (
                          <Row justify="space-between">
                            <Col>border-radius</Col>
                            <Col>
                              <FormItem name={[names[borderRadiusType], 'value']} noStyle>
                                <InputNumber
                                  style={{ width: 160 }}
                                  type="number"
                                  size="small"
                                  addonAfter={gen_unitSelect(
                                    [names[borderRadiusType], 'unit'],
                                    ['px', '%'],
                                  )}
                                />
                              </FormItem>
                            </Col>
                          </Row>
                        )
                      }
                    }}
                  </ProFormDependency>
                </Col>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
        <div className="newStyle-item">
          <Collapse
            defaultActiveKey={[]}
            ghost
            style={{ width: '100%' }}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            <Collapse.Panel
              header={<span className="newStyle-item-title">box-shadow</span>}
              key="1"
            >
              <div className="newStyle-item newStyle-item-wholeSetting">
                <span className="newStyle-item-wholeSetting-title">whole setting</span>
                <Select
                  className="newStyle-item-settingAll"
                  onChange={onChangeBoxShadow}
                  value={boxShadowValue}
                  size="small"
                  popupClassName="designer-dropdown"
                >
                  <Select.Option value="large">large</Select.Option>
                  <Select.Option value="middle">middle</Select.Option>
                  <Select.Option value="small">small</Select.Option>
                  <Select.Option value="none">none</Select.Option>
                  <Select.Option value="default">default</Select.Option>
                  <Select.Option value="custom">custom</Select.Option>
                </Select>
              </div>
              <div className="newStyle-smallItem">
                <Col>color</Col>
                <Col>
                  <FormItem name={['boxShadow', 'color']} noStyle>
                    <ColorPicker />
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col>X offset</Col>
                <Col>
                  <FormItem name={['boxShadow', 'x', 'value']} noStyle>
                    <InputNumber
                      style={{ width: 180 }}
                      type="number"
                      size="small"
                      addonAfter={gen_unitSelect(['boxShadow', 'x', 'unit'], ['px', '%'])}
                    />
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col>Y offset</Col>
                <Col>
                  <FormItem name={['boxShadow', 'y', 'value']} noStyle>
                    <InputNumber
                      style={{ width: 180 }}
                      type="number"
                      size="small"
                      addonAfter={gen_unitSelect(['boxShadow', 'y', 'unit'], ['px', '%'])}
                    />
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col>blur</Col>
                <Col>
                  <FormItem name={['boxShadow', 'blur', 'value']} noStyle>
                    <InputNumber
                      style={{ width: 180 }}
                      type="number"
                      size="small"
                      addonAfter={gen_unitSelect(['boxShadow', 'blur', 'unit'], ['px', '%'])}
                    />
                  </FormItem>
                </Col>
              </div>
              <div className="newStyle-smallItem">
                <Col>spread</Col>
                <Col>
                  <FormItem name={['boxShadow', 'spread', 'value']} noStyle>
                    <InputNumber
                      style={{ width: 180 }}
                      type="number"
                      size="small"
                      addonAfter={gen_unitSelect(['boxShadow', 'spread', 'unit'], ['px', '%'])}
                    />
                  </FormItem>
                </Col>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
        <div className="newStyle-item" style={{ alignItems: 'center' }}>
          <span className="newStyle-item-title">opacity</span>
          <Slider
            style={{ width: 100 }}
            min={0}
            max={100}
            defaultValue={100}
            // todo
            onChange={onChangeOpacity}
            tooltip={{
              formatter: (value) => {
                if (value === 0) {
                  return 'transparent'
                } else if (value === 100) {
                  return 'opacification'
                } else {
                  return `${value}%`
                }
              },
            }}
            value={typeof opacityValue === 'number' ? opacityValue : 100}
          />
          <InputNumber
            style={{ width: 100 }}
            type="number"
            size="small"
            placeholder="100"
            defaultValue={100}
            min={0}
            max={100}
            value={opacityValue}
            onChange={onChangeOpacity}
            addonAfter={'%'}
          />
        </div>
        <div className="newStyle-item">
          <span className="newStyle-item-title">cursor</span>
          <FormItem name="cursor" noStyle>
            <Select style={{ width: 180 }} size="small" popupClassName="designer-dropdown">
              <Select.Option value="default">
                <img src={cursor_default} /> default
              </Select.Option>
              <Select.Option value="pointer">
                <img src={cursor_pointer} /> pointer
              </Select.Option>
            </Select>
          </FormItem>
        </div>
      </div>
    </Form>
  )
})

export default Index
