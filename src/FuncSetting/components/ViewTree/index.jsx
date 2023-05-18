import clonedeep from 'lodash.clonedeep'
import update from 'immutability-helper'
import React, { useState } from 'react'
import { BankOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Tabs, Tree } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'

const Index = (props) => {
  const editor = useSelector((state) => state.present.pageEditor)
  const dispatch = useDispatch()
  const defaultData = [
    {
      i: 'PageContent',
      key: 'PageContent',
      name: 'PageContent',
      title: 'page content',
      icon: <BankOutlined />,
      isLeaf: false,
      // selectable: false,
      children: editor.pageContent,
    },
  ]
  const [gdata, setgdata] = useState(defaultData)

  const onDrop = (e) => {
    const info = e
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          loop(data[i].children, key, callback)
        }
      }
    }
    const data = clonedeep(editor.pageContent)

    // Find dragObject
    let dragObj
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        // Example added to the head, can be anywhere
        item.children = update(item.children, { $unshift: [dragObj] })
      })
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        // Example added to the head, can be anywhere
        item.children = update(item.children, { $unshift: [dragObj] })
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      })
    } else {
      let ar
      let i
      loop(data, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    }
    dispatch({ type: 'pageEditor/setContent', payload: data })
  }

  const isInContainer = (dragNode, dropNode, dropPosition) => {
    const canDropNames = ['MyContainer', 'MyLinkBlock', 'MyCarousel', 'MyTabPane']
    const r = Boolean(canDropNames.find((name) => name === dropNode.name))
    if (dropNode.name === 'MyTabPane') {
      return dropPosition === 0 && r
    }
    return r
  }

  const allowDrop = (info) => {
    const { dragNode, dropNode, dropPosition } = info
    // dropPosition: the drop position of abstract-drop-node, inside 0, top -1, bottom 1
    // https://github.com/react-component/tree/blob/master/src/util.tsx
    return isInContainer(dragNode, dropNode, dropPosition)
  }

  const onSelect = (selectedKeys, info) => {
    dispatch({ type: 'pageEditor/onClickComponent', payload: info.node })
  }

  return (
    <div className="outlineTree">
      <Tree
        className="draggable-tree"
        // defaultExpandAll={true}
        // autoExpandParent={true}
        draggable={{ icon: false }}
        blockNode
        height={650}
        treeData={editor.pageContent}
        switcherIcon={<DownOutlined />}
        autoExpandParent
        onRightClick={(e) => e?.stopPropagation?.()}
        allowDrop={allowDrop}
        onDrop={onDrop}
        onSelect={onSelect}
        selectedKeys={[editor.selected?.i]}
      />
    </div>
  )
}

export default Index
