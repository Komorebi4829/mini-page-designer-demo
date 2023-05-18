import { DeleteOutlined } from '@ant-design/icons'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Button, Tooltip, Modal, Row, Col, Card, Tree, Empty } from 'antd'
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormDependency,
  ProFormSwitch,
} from '@ant-design/pro-form'
import VarText, { VarModal } from '@/components/BindVar'

const ruleRequired = {
  required: true,
  message: 'This field is required',
}

const Index = (props) => {
  const {
    data,
    onCancel,
    variables,
    onAddVariable,
    onEditVariable,
    onDeleteVariable,
    dataSource,
    dataSourceDetailList,
    editor,
  } = props
  const [expandedKeys, setexpandedKeys] = useState([])
  const [selectedKeys, setselectedKeys] = useState([])
  const [mode, setmode] = useState(0) // 0 initial; 1 add variable; 2 edit variable
  const [newVariables, setnewVariables] = useState({})
  const [varModal, setvarModal] = useState(false)
  const formEditRef = useRef()
  const formAddRef = useRef()
  const currentVar = useRef()

  const _onAddVariable = (params) => {
    onAddVariable?.(params)
    setmode(0)
    // message.success('Saved successfully')
  }

  const _onEditVariable = (params) => {
    onEditVariable?.(params)
    // setmode(0)
    // message.success('Saved successfully')
  }

  const treeData = useMemo(() => {
    const children = variables.map((item) => ({
      ...item,
      key: item.id,
      title: (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{item.id}</span>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              onDeleteVariable(item.id)
              setmode(0)
            }}
          ></Button>
        </div>
      ),
    }))
    return [
      {
        key: 'nowPage',
        title: (
          <span>
            current page{' '}
            <span style={{ fontSize: 10 }}>
              <Tooltip title="options, pageJson, params">reserved keywords</Tooltip>
            </span>
          </span>
        ),
        selectable: false,
        children,
      },
    ]
  }, [variables])

  const onExpand = (expandedKeys) => {
    setexpandedKeys(expandedKeys)
  }

  const onSelect = (selectedKeys, e) => {
    setselectedKeys(selectedKeys)
    if (selectedKeys.length > 0) {
      setmode(2)
      setTimeout(() => {
        formEditRef?.current?.resetFields()
        formEditRef?.current?.setFieldsValue(e.selectedNodes?.[0])
      }, 100)
    } else {
      setmode(0)
    }
  }

  const onChange = (e) => {}

  const onValuesChange = (params) => {}

  const commonFormItem = (
    <>
      <ProFormText
        name="id"
        label="Variable ID"
        disabled={mode === 2}
        rules={[
          ruleRequired,
          {
            pattern: /[a-zA-Z_]+\w+/,
            message: 'variable name format error',
          },
        ]}
      />
      <ProFormRadio.Group
        options={[
          { value: 'normal', label: 'normal' },
          { value: 'model', label: 'model' },
          { value: 'params', label: 'params' },
          { value: 'props', label: 'props' },
        ]}
        name="type"
        label="variable type"
        rules={[ruleRequired]}
      />
      <ProFormDependency name={['type']}>
        {({ type }) => {
          if (type === 'normal') {
            return (
              <ProFormSelect
                name="dataType"
                label="data type"
                options={[
                  { value: 'string', label: 'string' },
                  { value: 'number', label: 'number' },
                  { value: 'boolean', label: 'boolean' },
                  { value: 'array', label: 'array' },
                  { value: 'object', label: 'object' },
                ]}
                rules={[ruleRequired]}
              />
            )
          } else if (type === 'model') {
            return (
              <>
                <ProFormSelect
                  name="dataSourceId"
                  label="data source"
                  options={dataSource}
                  rules={[ruleRequired]}
                />
                <ProFormDependency name={['dataSourceId']}>
                  {({ dataSourceId }) => {
                    if (dataSourceId) {
                      const detail = dataSourceDetailList.find((item) => item.id === dataSourceId)
                      const options =
                        detail?.methodList?.map((item) => ({
                          value: item.id,
                          label: `${item.methodName}-${item.methodKey}`,
                        })) || []
                      return (
                        <>
                          <ProFormSelect
                            name="methodId"
                            label="select method"
                            options={options}
                            rules={[ruleRequired]}
                          />
                          <ProFormDependency name={['methodId']}>
                            {({ methodId }) => {
                              if (methodId) {
                                const methodDetail = detail?.methodList.find(
                                  (item) => methodId === item.id && item.type === 1,
                                )
                                if (methodDetail) {
                                  const paramsList = methodDetail.methodParams
                                  return paramsList.map((item) => (
                                    <ProFormText
                                      key={item.fieldCode}
                                      name={['params', item.fieldCode]}
                                      label={
                                        <VarText
                                          varModal={varModal}
                                          setvarModal={(value) => {
                                            const formRef = mode === 1 ? formAddRef : formEditRef
                                            const formVal = formRef?.current?.getFieldValue([
                                              'params',
                                              item.fieldCode,
                                            ])
                                            setvarModal(formVal || '$page.state')
                                            currentVar.current = item.fieldCode
                                          }}
                                        >
                                          {item.fieldName}
                                        </VarText>
                                      }
                                      required={Boolean(item.isMust)}
                                      placeholder="input constant or bind variable"
                                    />
                                  ))
                                }
                              }
                            }}
                          </ProFormDependency>
                        </>
                      )
                    }
                  }}
                </ProFormDependency>
              </>
            )
          } else if (type === 'params') {
            return (
              <>
                <ProFormSwitch
                  name="isRequired"
                  label="required"
                  checkedChildren="yes"
                  unCheckedChildren="no"
                  tooltip="If the parameter is required, it must be provided when jumping to this page from other pages"
                />
                <ProFormText name="example" label="example" />
              </>
            )
          } else if (type === 'props') {
            return (
              <>
                <ProFormSwitch
                  name="isRequire"
                  label="required"
                  checkedChildren="yes"
                  unCheckedChildren="no"
                />
                <ProFormText name="example" label="example" />
              </>
            )
          }
        }}
      </ProFormDependency>

      <ProFormText name="desc" label="desccription" />
    </>
  )

  const cleanup = () => {
    setmode(0)
  }

  return (
    <Modal
      width="60%"
      destroyOnClose
      title="variable management"
      open={!!data}
      onCancel={onCancel}
      // okText="Save"
      // onOk={() => null}
      footer={null}
      afterClose={cleanup}
    >
      <Row justify="space-between">
        <Col span={12}>
          <Card bordered={false} bodyStyle={{ padding: 4 }}>
            {/* <Input.Search style={{ marginBottom: 8 }} placeholder="search" onChange={onChange} /> */}
            {variables?.length > 0 ? (
              <Tree
                onSelect={onSelect}
                autoExpandParent={true}
                treeData={treeData}
                defaultExpandAll
                blockNode
              />
            ) : (
              <Empty
                description={
                  <span>
                    <span>No variable,</span>
                    <Button type="link" onClick={() => setmode(1)}>
                      click to add
                    </Button>
                  </span>
                }
              />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={mode === 1 ? 'add variable' : mode === 2 ? selectedKeys?.[0] : 'variable'}
            size="small"
            extra={
              mode !== 1 && (
                <Button type="link" onClick={() => setmode(1)}>
                  Add
                </Button>
              )
            }
          >
            {mode === 2 && (
              <ProForm
                onFinish={_onEditVariable}
                initialValues={{}}
                formRef={formEditRef}
                submitter={{
                  render: (props, doms) => [
                    <Row style={{ marginTop: 24 }}>
                      <Col span={24}>
                        <Button
                          type="primary"
                          key="add"
                          onClick={() => props.form?.submit?.()}
                          style={{ marginBottom: 12 }}
                          block
                        >
                          Save
                        </Button>
                      </Col>
                      <Col span={24}>
                        <Button key="cancel" onClick={() => setmode(0)} block>
                          Cancel editing
                        </Button>
                      </Col>
                    </Row>,
                  ],
                }}
                onValuesChange={onValuesChange}
              >
                {commonFormItem}
              </ProForm>
            )}
            {mode === 1 && (
              <ProForm
                onFinish={_onAddVariable}
                initialValues={{}}
                formRef={formAddRef}
                submitter={{
                  render: (props, doms) => [
                    <Row style={{ marginTop: 24 }}>
                      <Col span={24}>
                        <Button
                          type="primary"
                          key="add"
                          onClick={() => props.form?.submit?.()}
                          style={{ marginBottom: 12 }}
                          block
                        >
                          Save
                        </Button>
                      </Col>
                      <Col span={24}>
                        <Button key="cancel" onClick={() => setmode(0)} block>
                          Cancel
                        </Button>
                      </Col>
                    </Row>,
                  ],
                }}
              >
                {commonFormItem}
              </ProForm>
            )}
            {mode === 0 && <Empty description="Please select a variable from the left" />}
          </Card>
        </Col>
      </Row>
      <VarModal
        data={varModal}
        onCancel={() => setvarModal(false)}
        onSave={(path) => {
          const formRef = mode === 1 ? formAddRef : formEditRef
          formRef?.current?.setFieldsValue({ params: { [currentVar.current]: path } })
        }}
        prefix="$page.state.params."
      />
    </Modal>
  )
}

export default Index
