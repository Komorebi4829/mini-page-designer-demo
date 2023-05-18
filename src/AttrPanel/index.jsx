import React from 'react'
import {
  AppleOutlined,
  FontColorsOutlined,
  DeploymentUnitOutlined,
  FormOutlined,
} from '@ant-design/icons'
import { Tabs } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import Snippets from '../FuncSetting/components/Snippets'
import NewStyle from './NewStyle'
import CSSEditor from './CSSEditor'
import './index.less'

const Index = (props) => {
  const editor = useSelector((state) => state.present.pageEditor)
  const dispatch = useDispatch()

  const onNewStyleChange = (params) => {
    // console.log('onValuesChange', params)
    dispatch({ type: 'pageEditor/onNewStyleChange', payload: params })
  }

  const onAttrsChange = (params) => {
    dispatch({ type: 'pageEditor/onAttrsChange', payload: params })
  }

  const onEventsChange = (params) => {
    dispatch({ type: 'pageEditor/setEvents', payload: params })
  }

  return (
    <div className="attr-panel">
      <div className="attr-panel-body">
        {editor.selected && (
          <>
            <Tabs
              onChange={() => null}
              tabBarStyle={{ width: '100%' }}
              centered={true}
              tabBarGutter={36}
              defaultActiveKey="style-new"
              items={[
                {
                  key: 'attribute',
                  label: (
                    <>
                      <FormOutlined />
                      Attributes
                    </>
                  ),
                  children: (() => {
                    const Attribute =
                      Snippets[editor.selected.category][editor.selected.name].rightSetting.tabAttr
                    return (
                      <Attribute
                        selected={editor.selected}
                        onAttrsChange={onAttrsChange}
                        onEventsChange={onEventsChange}
                        dispatch={dispatch}
                        editor={editor}
                      />
                    )
                  })(),
                },
                {
                  key: 'style-new',
                  label: (
                    <>
                      <FontColorsOutlined />
                      Styles
                    </>
                  ),
                  children: (
                    <>
                      <CSSEditor />
                      <NewStyle
                        onNewStyleChange={onNewStyleChange}
                        dynamicStyles={editor.selected.styles}
                        selected={editor.selected}
                      />
                    </>
                  ),
                },
              ]}
            ></Tabs>
          </>
        )}
        {!editor.selected && (
          <div className="attr-panel-body-notice">Please select the node on the left canvas</div>
        )}
      </div>
    </div>
  )
}

export default Index
