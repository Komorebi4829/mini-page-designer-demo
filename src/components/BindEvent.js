import React, { useState, useEffect, useMemo, useRef } from 'react'
import { PaperClipOutlined } from '@ant-design/icons'
import { Row, Col, Modal, Tabs, Tree, Input, Button } from 'antd'
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-form'
import { useSelector, useDispatch } from 'react-redux'
import { uuid } from '@/utils'

const Index = (props) => {
  const editor = useSelector((state) => state.present.pageEditor)
  const dispatch = useDispatch()
  const { data: dict, onCancel, callback } = props
  const [tabKey, settabKey] = useState('navigateTo')
  const form = useRef()
  const isNew = dict?.mode === 'add'

  useEffect(() => {
    if (!!dict) {
      if (!isNew) {
        const data = dict.data
        const tabKey = data?.handler.name
        settabKey(tabKey)
        setTimeout(() => {
          form?.current?.setFieldsValue({ params: data.handler.params })
        }, 50)
      }
    }
    return () => {
      form?.current?.resetFields?.()
    }
  }, [dict])

  const onChangeAction = (e) => {
    settabKey(e)
    form?.current?.resetFields?.()
  }

  const Actions = (
    <Tabs
      tabPosition={'left'}
      size="small"
      tabBarGutter={4}
      defaultActiveKey={tabKey}
      onChange={onChangeAction}
      destroyInactiveTabPane
      items={[
        {
          key: 'navigateTo',
          label: 'navigateTo',
          children: (
            <>
              <ProFormRadio.Group
                options={[
                  { value: 'real', label: 'real page' },
                  { value: 'virtual', label: 'virtual page' },
                ]}
                name={['params', 'pageType']}
                label="page type"
              />
              <ProFormText name={['params', 'url']} />
            </>
          ),
        },
        {
          key: 'navigateBack',
          label: 'navigateBack',
          children: 'No Configuration Item',
        },
        {
          key: 'redirectTo',
          label: 'redirectTo',
          children: (
            <>
              <ProFormRadio.Group
                options={[
                  { value: 'real', label: 'real page' },
                  { value: 'virtual', label: 'virtual page' },
                ]}
                name={['params', 'pageType']}
                label="page type"
              />
              <ProFormText name={['params', 'url']} />
            </>
          ),
        },
      ]}
    ></Tabs>
  )
  const onValuesChange = (values) => {}

  const onOk = () => {
    const params = form?.current?.getFieldsValue?.(true)
    let e = Object.assign({}, params)
    const id = isNew ? `${tabKey}_${uuid(10)}` : dict.data.id
    e = {
      id: id,
      eventName: 'tap',
      handler: {
        name: tabKey,
        ...params,
      },
    }
    callback?.(e)
  }

  const cleanup = () => {}
  return (
    <Modal
      width="60%"
      destroyOnClose
      title={isNew ? 'Add event' : 'Edit event'}
      open={!!dict}
      onCancel={onCancel}
      onOk={onOk}
      afterClose={cleanup}
    >
      <ProForm
        onFinish={() => null}
        initialValues={{}}
        submitter={{ render: () => null }}
        formRef={form}
        onValuesChange={onValuesChange}
      >
        <Tabs
          tabPosition={'left'}
          size="small"
          destroyInactiveTabPane
          items={[
            {
              key: 'tap',
              label: 'tap',
              children: Actions,
            },
          ]}
        ></Tabs>
      </ProForm>
    </Modal>
  )
}

export default Index
