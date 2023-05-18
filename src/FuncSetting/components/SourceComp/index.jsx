import React from 'react'
import { AppleOutlined, SearchOutlined } from '@ant-design/icons'
import { Typography, Divider, Collapse } from 'antd'
import Box from './Box'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'
import Snippets from '../Snippets'

const Index = (props) => {
  const { activeComps } = props
  return (
    <div className="source-components">
      <Typography.Title level={5}>Component library</Typography.Title>
      {/* <Input placeholder="search" suffix={<SearchOutlined />} onChange={() => null} /> */}
      <Divider style={{ margin: '12px 0' }}></Divider>

      <Collapse
        ghost
        bordered={false}
        defaultActiveKey={['layout', 'basic', 'display', 'advanced']}
      >
        <Collapse.Panel header={<Typography.Text strong>Layout</Typography.Text>} key="layout">
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {activeComps.layout.map((key, index) => {
              const Comp = Snippets.layout[key]
              if (Comp) {
                const { leftPanel, dragItem, defaultVal } = Comp
                return (
                  <Box key={key} config={leftPanel} dragItem={dragItem} defaultVal={defaultVal} />
                )
              } else {
                console.warn(`cannot find Component <<${key}>>!`)
              }
            })}
          </div>
        </Collapse.Panel>
        <Collapse.Panel header={<Typography.Text strong>Basic</Typography.Text>} key="basic">
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {activeComps.basic.map((key, index) => {
              const Comp = Snippets.basic[key]
              if (Comp) {
                const { leftPanel, dragItem, defaultVal } = Comp
                return (
                  <Box key={key} config={leftPanel} dragItem={dragItem} defaultVal={defaultVal} />
                )
              } else {
                console.warn(`cannot find Component <<${key}>>!`)
              }
            })}
          </div>
        </Collapse.Panel>
        <Collapse.Panel header={<Typography.Text strong>Display</Typography.Text>} key="display">
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {activeComps.display.map((key, index) => {
              const Comp = Snippets.display[key]
              if (Comp) {
                const { leftPanel, dragItem, defaultVal } = Comp
                return (
                  <Box key={key} config={leftPanel} dragItem={dragItem} defaultVal={defaultVal} />
                )
              } else {
                console.warn(`cannot find Component <<${key}>>!`)
              }
            })}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export default Index
