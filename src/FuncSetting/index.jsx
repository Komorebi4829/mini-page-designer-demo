import React, { useState } from 'react'
import {
  AppleOutlined,
  SearchOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'
import { Button, Tabs, Tooltip, Typography, Input, Divider } from 'antd'
import SourceComp from './components/SourceComp'
import ViewTree from './components/ViewTree'
import './index.less'
import { activeComps } from '../config'

export default function Index(props) {
  const [tab, settab] = useState('components')

  const callback = (key) => {
    settab(key)
  }

  return (
    <div className="func-setting" style={{ width: tab === 'outlineTree' ? 400 : undefined }}>
      <Tabs
        defaultActiveKey="components"
        onChange={callback}
        tabPosition="left"
        items={[
          {
            key: 'outlineTree',
            label: (
              <Tooltip title={'Outlines tree'} placement="right" mouseEnterDelay={0.05}>
                <div>
                  <ApartmentOutlined style={{ fontSize: 16, marginRight: 0 }} />
                </div>
              </Tooltip>
            ),
            children: (
              <>
                <Typography.Title level={5}>Outlines tree</Typography.Title>
                <Divider style={{ margin: '12px 0' }}></Divider>
                <ViewTree activeComps={activeComps} />
              </>
            ),
          },
          {
            key: 'components',
            label: (
              <Tooltip title={'Component library'} placement="right" mouseEnterDelay={0.05}>
                <div>
                  <AppstoreOutlined style={{ fontSize: 16, marginRight: 0 }} />
                </div>
              </Tooltip>
            ),
            children: <SourceComp activeComps={activeComps} />,
          },
        ]}
      ></Tabs>
    </div>
  )
}
