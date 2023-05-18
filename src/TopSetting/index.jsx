import update from 'immutability-helper'
import {
  UndoOutlined,
  RedoOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  CopyOutlined,
  DownOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeTwoTone,
  EyeOutlined,
  ImportOutlined,
  DatabaseOutlined,
  PaperClipOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import {
  Button,
  message,
  Select,
  Menu,
  Tooltip,
  Space,
  Modal,
  Input,
  Popconfirm,
  Typography,
  Divider,
} from 'antd'
import copyTOClipboard from 'copy-text-to-clipboard'
import ReactJson from 'react-json-view'
import { saveAs } from 'file-saver'
import './index.less'
import { editAppPage, queryAppPageById } from '@/mockService'
import { queryAppDataById } from '@/mockService'
import { useSelector, useDispatch } from 'react-redux'
import undoable, { ActionCreators } from 'redux-undo'
import DataSource from './components/DataSource'
import Variable from './components/Variable'

const Index = (props) => {
  const editor = useSelector((state) => state.present.pageEditor)
  const dispatch = useDispatch()

  const id = 0
  const appClientId = 0

  const [res, setres] = useState([])
  const [initLoading, setInitLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [importDataModal, setimportDataModal] = useState(false)
  const [importData, setimportData] = useState('')
  const [displaySchema, setDisplaySchema] = useState('')
  const [clearDataVisible, setclearDataVisible] = useState(false)
  const [dataSourceModal, setdataSourceModal] = useState(false)
  const [variableModal, setvariableModal] = useState(false)

  useEffect(() => {
    setInitLoading(true)
    queryAppPageById({ id }).then((res) => {
      let json = res.pageJson || '{}'
      json = localStorage.getItem('json') || json
      const type = 1
      json = JSON.parse(json)
      dispatch({ type: 'pageEditor/setInitData', payload: { json } })
      // Get data source details
      json?.pageConfig?.dataSource?.length > 0 &&
        Promise.all(json?.pageConfig?.dataSource?.map((id) => queryAppDataById({ id: id }))).then(
          (arr) => {
            dispatch({ type: 'pageEditor/onCacheDataSource', payload: arr })
          },
        )
      setInitLoading(false)
    })

    return () => {
      setres([])
    }
  }, [])

  const createMenus = (res) => {
    const options = res.map((item) => ({
      value: item.pageId,
      label: (
        <div>
          <div>{item.title}</div>
          <div style={{ fontSize: 11 }}>{item.vurl}</div>
        </div>
      ),
      disabled: item.pageType !== 1,
    }))
    return options
  }

  const changePage = (value) => {
    if (id === value) return
    window.location.reload()
  }

  const onIpmortData = () => {
    let json = '{}'
    try {
      json = JSON.parse(importData)
    } catch {
      message.error('The JSON format is incorrect and cannot be parsed')
      return
    }
    dispatch({ type: 'pageEditor/setInitData', payload: { json: json, rawData: importData } })
    setimportDataModal(false)
    setimportData('')
  }

  const viewJson = (e) => {
    const json = {
      pageConfig: editor.pageConfig,
      pageSetting: editor.pageSetting,
      pageHeader: editor.pageHeader,
      pageContent: editor.pageContent,
      pageFooter: editor.pageFooter,
    }
    setDisplaySchema(json)
    setShowExportModal(true)
  }
  // copy to clipboard
  const copyJson = () => {
    const json = {
      pageConfig: editor.pageConfig,
      pageSetting: editor.pageSetting,
      pageHeader: editor.pageHeader,
      pageContent: editor.pageContent,
      pageFooter: editor.pageFooter,
    }
    copyTOClipboard(JSON.stringify(json, null, 2))
    message.success('Copy successfully')
  }
  const downloadJson = () => {
    const json = JSON.stringify({
      pageConfig: editor.pageConfig,
      pageSetting: editor.pageSetting,
      pageHeader: editor.pageHeader,
      pageContent: editor.pageContent,
      pageFooter: editor.pageFooter,
    })
    const blob = new Blob([json], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `page.json`)
  }
  const undohandler = (e) => {
    dispatch(ActionCreators.undo())
  }
  const redohandler = (e) => {
    dispatch(ActionCreators.redo())
  }
  const copySchema = () => {
    copyTOClipboard(displaySchema)
    message.success('Copy successfully')
    setShowExportModal(false)
  }
  const clearLayoutData = () => {
    dispatch({ type: 'pageEditor/clearLayoutData' })
    setclearDataVisible(false)
  }
  const onSave = () => {
    const json = {
      pageConfig: editor.pageConfig,
      pageSetting: editor.pageSetting,
      pageHeader: editor.pageHeader,
      pageContent: editor.pageContent,
      pageFooter: editor.pageFooter,
    }
    localStorage.setItem('json', JSON.stringify(json)) // or post API
    message.success('Saved successfully')
  }

  const onChangeDataSource = (ids) => {
    const hide = message.loading('Saving...', 0)
    const json = {
      pageConfig: {
        ...editor.pageConfig,
        dataSource: ids,
      },
      pageSetting: editor.pageSetting,
      pageHeader: editor.pageHeader,
      pageContent: editor.pageContent,
      pageFooter: editor.pageFooter,
    }
    const jsonStr = JSON.stringify(json)
    localStorage.setItem('json', JSON.stringify(jsonStr)) // or post API
    dispatch({ type: 'pageEditor/onChangeDataSource', payload: ids })
    message.success('Saved successfully')

    Promise.all(ids.map((id) => queryAppDataById({ id: id }))).then((arr) => {
      dispatch({ type: 'pageEditor/onCacheDataSource', payload: arr })
    })
  }

  const onAddVariable = (params) => {
    const hide = message.loading('Saving...', 0)
    const json = {
      pageConfig: {
        ...editor.pageConfig,
        variables: update(editor.pageConfig.variables, { $push: [params] }),
      },
      pageSetting: editor.pageSetting,
      pageHeader: editor.pageHeader,
      pageContent: editor.pageContent,
      pageFooter: editor.pageFooter,
    }
    const jsonStr = JSON.stringify(json)
    localStorage.setItem('json', JSON.stringify(jsonStr)) // or post API
    dispatch({ type: 'pageEditor/addVariable', payload: params })
    message.success('Saved successfully')
  }

  const onEditVariable = (params) => {
    const hide = message.loading('Saving...', 0)
    const json = {
      pageConfig: {
        ...editor.pageConfig,
        variables: update(editor.pageConfig.variables, {
          $apply: (list) => {
            const { id } = params
            const newList = []
            for (let i = 0; i < list.length; i++) {
              const item = list[i]
              if (item.id === id) {
                newList.push(params)
              } else {
                newList.push(item)
              }
            }
            return newList
          },
        }),
      },
      pageSetting: editor.pageSetting,
      pageHeader: editor.pageHeader,
      pageContent: editor.pageContent,
      pageFooter: editor.pageFooter,
    }
    const jsonStr = JSON.stringify(json)
    localStorage.setItem('json', JSON.stringify(jsonStr)) // or post API
    dispatch({ type: 'pageEditor/editVariable', payload: params })
    message.success('Saved successfully')
  }

  const onDeleteVariable = (_id) => {
    const hide = message.loading('Saving...', 0)
    const json = {
      pageConfig: {
        ...editor.pageConfig,
        variables: update(editor.pageConfig.variables, {
          $apply: (list) => {
            const newList = []
            for (let i = 0; i < list.length; i++) {
              const item = list[i]
              if (item.id !== _id) {
                newList.push(item)
              }
            }
            return newList
          },
        }),
      },
      pageSetting: editor.pageSetting,
      pageHeader: editor.pageHeader,
      pageContent: editor.pageContent,
      pageFooter: editor.pageFooter,
    }
    const jsonStr = JSON.stringify(json)
    localStorage.setItem('json', JSON.stringify(jsonStr)) // or post API
    dispatch({ type: 'pageEditor/deleteVariable', payload: _id })
    message.success('Saved successfully')
  }

  const onChangePageSetting = (values) => {
    dispatch({ type: 'pageEditor/onChangePageSetting', payload: values })
  }

  return (
    <div className="top-area">
      <div className="top-area-common top-area-left">
        <Space>
          <Typography.Title level={3}>Mini Page Designer Demo</Typography.Title>
        </Space>
      </div>
      <div className="top-area-common top-area-center">
        <Tooltip title={'Import JSON'}>
          <Button
            type="link"
            onClick={() => setimportDataModal(true)}
            icon={<ImportOutlined rotate={-90} />}
          ></Button>
        </Tooltip>
        <Tooltip title={'View JSON'}>
          <Button type="link" onClick={viewJson} icon={<EyeOutlined />}></Button>
        </Tooltip>
        <Tooltip title={'Copy JSON'}>
          <Button type="link" onClick={copyJson} icon={<CopyOutlined />}></Button>
        </Tooltip>
        <Tooltip title={'Download JSON'}>
          <Button type="link" onClick={downloadJson} icon={<DownloadOutlined />}></Button>
        </Tooltip>
        <Tooltip title="Undo">
          <Button
            type="link"
            onClick={undohandler}
            icon={<UndoOutlined />}
            disabled={!editor.pageContent.length}
          ></Button>
        </Tooltip>
        <Tooltip title="Redo">
          <Button type="link" onClick={redohandler} icon={<RedoOutlined />}></Button>
        </Tooltip>
        <Popconfirm
          title="Are you sure to clear the data?"
          open={clearDataVisible}
          onConfirm={() => clearLayoutData()}
          onCancel={() => setclearDataVisible(false)}
        >
          <Button
            type="link"
            style={{ marginRight: '9px' }}
            onClick={() => setclearDataVisible(true)}
            icon={<DeleteOutlined />}
          ></Button>
        </Popconfirm>

        <Divider type="vertical" />
        <Tooltip title="Data sources">
          <Button
            type="link"
            onClick={() => setdataSourceModal(editor.pageConfig.dataSource)}
            icon={<DatabaseOutlined />}
          ></Button>
        </Tooltip>
        <Tooltip title="Variables">
          <Button
            type="link"
            onClick={() => setvariableModal(true)}
            icon={<PaperClipOutlined />}
          ></Button>
        </Tooltip>
      </div>
      <div className="top-area-common top-area-right">
        <Space>
          <Tooltip title="Save">
            <Button type="primary" onClick={() => onSave()} loading={submitLoading}>
              Save
            </Button>
          </Tooltip>
        </Space>
      </div>

      <Modal
        width={'70%'}
        open={showExportModal}
        title="View JSON"
        onOk={copySchema}
        onCancel={() => setShowExportModal(false)}
        afterClose={() => setDisplaySchema({})}
        okText="Copy"
        cancelText="Cancel"
        style={{ marginLeft: '15%' }}
      >
        <ReactJson src={displaySchema} displayDataTypes={false} onEdit={false} name={false} />
      </Modal>

      <Modal
        width={'50%'}
        open={importDataModal}
        title="Import JSON"
        onOk={onIpmortData}
        onCancel={() => setimportDataModal(false)}
        okText="Import"
        cancelText="Cancel"
        style={{ marginLeft: '15%' }}
      >
        <Input.TextArea
          style={{ fontSize: 12 }}
          onChange={(e) => setimportData(e.currentTarget.value)}
          value={importData}
          autoSize={{ minRows: 10, maxRows: 30 }}
        />
      </Modal>

      <DataSource
        onCancel={() => setdataSourceModal(false)}
        data={dataSourceModal}
        onChangeDataSource={onChangeDataSource}
      />
      <Variable
        onCancel={() => setvariableModal(false)}
        data={variableModal}
        variables={editor.pageConfig.variables || []}
        onAddVariable={onAddVariable}
        onEditVariable={onEditVariable}
        onDeleteVariable={onDeleteVariable}
        dataSource={editor.pageConfig.dataSource || []}
        dataSourceDetailList={editor.dataSource || []}
        editor={editor}
      />
    </div>
  )
}

export default Index
