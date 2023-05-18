import React, { useState, useEffect, useMemo } from 'react'
import { PaperClipOutlined } from '@ant-design/icons'
import { Row, Col, Modal, Tabs, Tree, Input, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { getSchema } from '@/mockService'

const traverse = (oldArray, id, callback) => {
  const _traverse = (array, id, callback) => {
    const newArray = []
    for (let i = 0; i < array.length; i++) {
      const item = array[i]
      let d = { ...item }
      if (item.fieldCode === id) {
        callback?.(d, newArray)
        continue
      }
      if (item.children && item.children.length > 0) {
        d.children = _traverse(item.children, id, callback)
      } else {
      }
      newArray.push(d)
    }
    return newArray
  }
  return _traverse(oldArray, id, callback)
}

const VarText = (props) => {
  const { children, varModal, setvarModal } = props

  return (
    <span>
      <span>{children}</span>
      <span style={{ marginLeft: 4 }}>
        <PaperClipOutlined onClick={() => setvarModal?.()} style={{ fontSize: 14 }} />
      </span>
    </span>
  )
}

const VarModal = (props) => {
  const editor = useSelector((state) => state.present.pageEditor)
  const dispatch = useDispatch()

  const { data, onCancel, onSave, prefix } = props
  const { selected } = editor
  const [tabIndex, settabIndex] = useState()
  const [initLoading, setinitLoading] = useState(false)
  const [variablesData, setvariablesData] = useState([])
  const [paramsData, setparamsData] = useState([])
  const [forLoopData, setforLoopData] = useState([])
  const [selectedVariable, setselectedVariable] = useState()
  const [selectedForItem, setselectedForItem] = useState()
  const [inputValue, setinputValue] = useState('')
  const [parentHasFor, setparentHasFor] = useState(false)

  useEffect(() => {
    if (!!data) {
      const _forPath = findForPath(editor.pageContent, selected.i)
      setparentHasFor(!!_forPath)
      console.log('_forPath', _forPath, editor)

      // status tab
      setselectedVariable(data.replace('$page.state.params.', '').replace('$page.state.', ''))
      if (editor?.pageConfig?.variables?.length > 0) {
        setinitLoading(true)
        Promise.all(
          editor.pageConfig.variables
            .filter((item) => item.type === 'model')
            .map((item) => _getSchema(item.id, item.type, item.dataSourceId, item.methodId)),
        ).then((array) => {
          const list = [
            ...array,
            ...editor.pageConfig.variables
              .filter((item) => item.type !== 'model')
              .map((item) => ({ ...item, fieldCode: item.id })),
          ]
          const statusVariables = generateTreeNode(list)
          setvariablesData(statusVariables)

          const paramsVariables = generateParamsTreeNode(list)
          setparamsData(paramsVariables)

          if (_forPath) {
            const forLoopData = findSchemaByForPath(list, _forPath)
            setforLoopData(forLoopData)
          }

          setinitLoading(false)
        })
      }
    }

    return () => {
      setvariablesData([])
    }
  }, [data])

  const findForPath = (oldArray, id) => {
    const _traverse = (array, id, forPath) => {
      let tempForPath
      for (let i = 0; i < array.length; i++) {
        const item = array[i]
        if (item.i === id) {
          return forPath
        }
        let newForPath = item.attrs?.[':for'] || forPath
        if (item.children && item.children.length > 0) {
          tempForPath = _traverse(item.children, id, newForPath)
          if (tempForPath) return tempForPath
        } else {
        }
      }
      return tempForPath
    }
    const forPath = undefined
    return _traverse(oldArray, id, forPath)
  }

  const findSchemaByForPath = (variables, forPath) => {
    for (let i = 0; i < variables.length; i++) {
      const item = variables[i]
      if (item.type === 'model') {
        let forLoopData = []
        traverse(item.fields, forPath.split('.').at(-1), (result) => {
          forLoopData = result.children.map((child) => {
            return {
              ...child,
              title: _generateChildNode(child.fieldCode, child.fieldType),
              key: child.fieldCode,
            }
          })
        })
        return forLoopData
      } else {
        // A list of custom variables is not currently supported
        continue
      }
    }
  }

  const _getSchema = (fieldCode, type, dataId, methodId) => {
    return getSchema({ dataId, methodId }).then((res) => ({ ...res, fieldCode, type }))
  }

  const _generateChildNode = (fieldCode, dataType) => {
    const symbols = {
      string: '"Example String"',
      number: 123456,
      boolean: true,
      array: '[]',
      object: '{}',
    }
    return (
      <>
        <span>{fieldCode}:</span>
        <span style={{ marginLeft: 8 }}>{symbols[dataType]}</span>
      </>
    )
  }

  const generateTreeNode = (list) => {
    const traverse = (parentKey, oldArray) => {
      const _traverse = (parentKey, array) => {
        const newArray = []
        for (let i = 0; i < array.length; i++) {
          const item = array[i]
          const key = `${parentKey}.${item.fieldCode}`
          let d = {
            ...item,
            title: _generateChildNode(item.fieldCode, item.fieldType),
            key: key,
          }
          if (item.children && item.children.length > 0) {
            d.children = _traverse(key, item.children)
          } else {
          }
          newArray.push(d)
        }
        return newArray
      }
      return _traverse(parentKey, oldArray)
    }
    const tree = []
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      const { type, fieldCode } = item
      if (type === 'model') {
        tree.push({
          title: _generateChildNode(item.fieldCode, 'object'),
          key: item.fieldCode,
          children: traverse(item.fieldCode, item.fields),
        })
      } else if (type === 'normal') {
        const node = {
          title: _generateChildNode(fieldCode, item.dataType),
          key: fieldCode,
          children: [],
        }
        tree.push(node)
      }
    }
    const result = [{ title: 'index: {}', key: 'index', children: tree, selectable: false }]
    // console.log('result', result)
    return result
  }

  const generateParamsTreeNode = (list) => {
    const tree = []
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      const { type, id, example, isRequire } = item
      if (type === 'params') {
        tree.push({
          title: (
            <>
              <span>
                {isRequire && <span style={{ color: 'red' }}>*</span>}
                {id}:
              </span>
              <span style={{ marginLeft: 8 }}>{example}</span>
            </>
          ),
          key: id,
          // children: traverse(item.fieldCode, item.fields),
        })
      }
    }
    const result = [{ title: 'current page', key: 'index', children: tree, selectable: false }]
    // console.log('result', result)
    return result
  }

  const callback = (key) => {
    settabIndex(key)
  }

  const onSelect = (selectedKeys, e) => {
    if (selectedKeys?.[0]) {
      setselectedVariable(prefix + selectedKeys?.[0])
    } else {
      setselectedVariable(undefined)
    }
  }

  const onSelectForItem = (selectedKeys, e) => {
    if (selectedKeys?.[0]) {
      setselectedVariable('$ForItem.' + selectedKeys?.[0])
    } else {
      setselectedVariable(undefined)
    }
  }

  const onOk = () => {
    onSave?.(inputValue || selectedVariable)
    onCancel()
  }

  const onUnbind = () => {
    onSave?.(undefined)
    onCancel()
  }

  const onInputChange = (e) => {
    const v = e.currentTarget.value
    setinputValue(v)
  }

  const cleanup = () => {
    setselectedVariable(undefined)
    setinputValue('')
  }
  return (
    <Modal
      width="60%"
      destroyOnClose
      title="Binding data"
      open={!!data}
      onCancel={onCancel}
      afterClose={cleanup}
      footer={
        <Row justify="space-between">
          <Col>
            <Button style={{ color: 'red' }} onClick={onUnbind} danger>
              Remove binding
            </Button>
          </Col>
          <Col>
            <Button type="default" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" onClick={onOk}>
              OK
            </Button>
          </Col>
        </Row>
      }
    >
      <Tabs
        defaultActiveKey="state"
        onChange={callback}
        items={[
          {
            key: 'state',
            label: 'State variable',
            children: (
              <>
                <div>Currently selected binding path:{data}</div>
                {variablesData.length > 0 && (
                  <Tree
                    treeData={variablesData}
                    defaultExpandAll={true}
                    autoExpandParent={true}
                    defaultSelectedKeys={[selectedVariable]}
                    onSelect={onSelect}
                    blockNode
                  />
                )}
              </>
            ),
          },
          {
            key: 'params',
            label: 'Parameter variable',
            children: (
              <>
                <div>Currently selected binding path:{data}</div>
                <Tree
                  treeData={paramsData}
                  defaultExpandAll={true}
                  autoExpandParent={true}
                  defaultSelectedKeys={[selectedVariable]}
                  onSelect={onSelect}
                  blockNode
                />
              </>
            ),
          },
          {
            key: 'expression',
            label: 'Expression',
            children: (
              <>
                <div>Currently selected binding path:{data}</div>
                <Input.TextArea
                  onChange={onInputChange}
                  placeholder="Page variables: $page.state.name"
                  style={{ marginTop: 10 }}
                />
              </>
            ),
          },
          {
            key: 'foritem',
            label: 'Loop variable',
            children:
              parentHasFor && forLoopData?.length > 0 ? (
                <Tree
                  treeData={forLoopData}
                  defaultExpandAll={true}
                  autoExpandParent={true}
                  onSelect={onSelectForItem}
                  blockNode
                />
              ) : (
                'The parent container of the current component has not set a loop yet, please set the loop body for the [parent container] first'
              ),
          },
        ]}
      ></Tabs>
    </Modal>
  )
}

export default VarText
export { VarModal }
