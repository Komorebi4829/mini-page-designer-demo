import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'antd'
import ProForm, { ProFormText, ProFormRadio } from '@ant-design/pro-form'

const Index = (props) => {
  const { data, onCancel, pageSetting, onChangePageSetting } = props
  const formRef = useRef()

  useEffect(() => {
    if (!!data) {
    }
  }, [data])

  const onFinish = (values) => {
    onChangePageSetting?.(values)
    onCancel()
  }

  return (
    <Modal
      width="40%"
      destroyOnClose
      title="Page Type"
      open={!!data}
      onCancel={onCancel}
      // onOk={onOk}
      footer={null}
    >
      <ProForm
        onFinish={onFinish}
        initialValues={pageSetting}
        formRef={formRef}
        onValuesChange={{ useType: data?.useType }}
      >
        <ProFormRadio.Group
          label="use type"
          name="useType"
          tooltip="It will affect whether to use url query or props"
          options={[
            { value: 'page', label: 'as page' },
            { value: 'component', label: 'as component' },
          ]}
        />
      </ProForm>
    </Modal>
  )
}

export default Index
