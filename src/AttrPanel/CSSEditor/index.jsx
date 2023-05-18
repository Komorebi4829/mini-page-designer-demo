import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Row, Col, Popover, Button, Tabs, Input, Select, Space, Modal, message, Alert } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import CSSStr2Obj from './util'
import format from './format'
import obj2css, { css2obj } from './obj2css'
import MonacoEditor from 'react-monaco-editor'
import { transformStyles } from '@/utils'

const Index = (props) => {
  const editor = useSelector((state) => state.present.pageEditor)
  const dispatch = useDispatch()

  const [code, setcode] = useState([''].join('\n'))
  const [value, setvalue] = useState('')
  const [showEditor, setshowEditor] = useState(false)

  useEffect(() => {
    if (!!showEditor) {
      const styles = transformStyles(editor.selected.styles)
      delete styles.borderWidthAll
      delete styles.borderRadiusAll
      delete styles.borderStyleAll
      delete styles.borderColorAll
      delete styles.backgroundPositionAll
      delete styles.backgroundSize_2
      delete styles.backgroundSizeWidth
      delete styles.backgroundSizeHeight
      delete styles.borderType
      delete styles.borderRadiusType
      delete styles.fillType
      const str = JSON.stringify({ self: styles })
      obj2css(str)
        .then((res) => setvalue(res))
        .catch((e) => {
          console.log(e)
          message.warning('styles parse failed')
        })
    }

    return () => {
      setvalue('')
    }
  }, [showEditor])

  const editorDidMount = (editor, monaco) => {
    editor.focus()
  }
  const onChange = (newValue, e) => {
    setvalue(newValue)
  }
  const onChangeInput = (e) => {
    setvalue(e.currentTarget.value)
  }
  const onOk = () => {
    const formatted = format(value, { indent: '  ' })
    setvalue(formatted)
    let style
    try {
      // style = CSSStr2Obj(formatted)

      // css to obj
      // https://transform.tools/css-to-js
      style = css2obj(formatted)
    } catch (e) {
      message.info('cannot transform style')
      console.log(e)
      return
    }
    console.log('style', style)
    dispatch({ type: 'pageEditor/setNewStyle', payload: style.self })
  }
  const cleanup = () => {
    setvalue('')
  }

  return (
    <Popover
      placement="left"
      title="edit CSS source code"
      content={
        <div>
          {/* <Input.TextArea value={value} style={{ width: 350, height: 280 }} onChange={onChangeInput} /> */}
          <MonacoEditor
            width="400"
            height="350"
            language="css"
            theme="vs-dark"
            value={value}
            options={{
              selectOnLineNumbers: true,
              tabSize: 2,
              minimap: {
                enabled: false,
              },
            }}
            onChange={onChange}
            editorDidMount={editorDidMount}
          />
          <Space style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <Button type="primary" size="small" onClick={onOk}>
              ok
            </Button>
            <Button size="small" onClick={() => setshowEditor(false)}>
              close
            </Button>
          </Space>
        </div>
      }
      trigger="click"
      open={showEditor}
    >
      <Button
        type="dashed"
        onClick={() => setshowEditor((val) => !val)}
        style={{ marginBottom: 10 }}
        block
      >
        edit CSS source code
      </Button>
    </Popover>
  )
}

export default Index
