import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { useDispatch } from 'react-redux'
import { unmount } from '@/store/pageEditorSlice'
import AttrPanel from './AttrPanel'
import FuncSetting from './FuncSetting'
import TopSetting from './TopSetting'
import App from './App'
import { activeComps } from './config'
import './index.less'

const Container = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(unmount())
    }
  }, [])
  return (
    <div className="Container">
      <TopSetting />
      <div style={{ height: 'calc(100% - 76px)', width: '100%', display: 'flex' }}>
        <FuncSetting />
        <App
          allType={[
            ...activeComps.basic,
            ...activeComps.layout,
            ...activeComps.advanced,
            ...activeComps.display,
          ]}
        />
        <AttrPanel />
      </div>
    </div>
  )
}

export default Container
