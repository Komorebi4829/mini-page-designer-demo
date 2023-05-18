import React, { useState, useEffect } from 'react'
import { Button, Tabs, message } from 'antd'
import { useDrop } from 'react-dnd'
import { useSelector, useDispatch } from 'react-redux'
import { uuid } from '../utils'
import './index.less'
import Snippets from '../FuncSetting/components/Snippets'
import MyRenderer from './Components/MyRenderer'
import key from 'keymaster'

const App = (props) => {
  const editor = useSelector((state) => state.present.pageEditor)
  const dispatch = useDispatch()
  const { allType } = props
  const [previewSize, setpreviewSize] = useState(null)
  const accept = [...allType, 'dragInApp']
  // const {width, height} = drop.current
  const [{ isOver, canDrop, isOverCurrent }, drop] = useDrop({
    accept: accept,
    drop: (item, monitor) => {
      console.log('drop item', item, isOverCurrent)
      // isOverCurrent: It is used to determine whether the component is placed on the
      // container or the App. If it is placed on the container, the App drop should not respond
      if (isOverCurrent) {
        if (item.name?.startsWith('My')) {
          if (item?.i) {
            // TODO Already exists, judge the boundary to move the position (placed on the APP)
          } else {
            // does not exist, add
            return onDrop(item, monitor)
          }
        } else if (item.name?.startsWith('dragInApp')) {
          console.log(item)
        } else {
          console.warn(`unRecognize type: <<${item.name}>>`)
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      isOverCurrent: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
      item: monitor.getItem(),
    }),
  })

  useEffect(() => {
    const rect = document.getElementById('app-root').getBoundingClientRect()
    setpreviewSize(rect)

    key('⌘+c, ctrl+c', () => {
      console.log('COPY')
      dispatch({ type: 'keyboardCopyPointData' })
    })
    key('delete, backspace', () => {
      dispatch({ type: 'keyboardDelPointData' })
    })
    key('esc', () => {
      dispatch({ type: 'keyboardCancelSelect' })
    })
    key('⌘+v, ctrl+v', (params) => {
      if (!navigator?.clipboard?.readText) {
        message.warn('browser does not support')
        return
      }
      navigator.clipboard
        .readText?.()
        .then((text) => {
          dispatch({ type: 'pageEditor/keyboardPastePointData', payload: text })
        })
        .catch((err) => {
          console.error('Failed to read clipboard contents: ', err)
        })
    })

    return () => {
      key.unbind('⌘+c, ctrl+c')
      key.unbind('⌘+v, ctrl+v')
      key.unbind('delete, backspace')
      key.unbind('esc')
      key.unbind('⌘+v, ctrl+v')
    }
  }, [])

  const onDrop = (item, monitor) => {
    const id = `${item.prefix ? item.prefix + '_' : ''}${uuid(8)}`
    const Comp = Snippets[item.category][item.name]
    const point = {
      i: id,
      key: id,
      name: item.name,
      category: item.category,
      title: Comp.leftPanel.title,
      ...Comp.defaultVal,
    }
    dispatch({ type: 'pageEditor/addComponentByDrag', payload: { point } })
  }

  const onClickComponent = (item) => {
    dispatch({ type: 'pageEditor/onClickComponent', payload: item })
  }

  const onDragStart = (item) => {
    // dispatch({ type: 'pageEditor/onClickComponent', payload: item })
    onClickComponent(item)
  }

  /**
   *
   * @param {item} sourceItem The item of the basic component (can also be a container component)
   * @param {item} targetItem drop target item (container component)
   */
  const onDropIntoContainer = (sourceItem, targetItem) => {
    dispatch({ type: 'pageEditor/onDropIntoContainer', payload: { sourceItem, targetItem } })
  }

  return (
    <div
      id="app"
      className="app"
      style={{ marginLeft: 4, boxSizing: 'border-box', position: 'relative' }}
    >
      <div ref={drop} id="app-root" className="app-root">
        <div className="app-root-header"></div>
        <div
          className="app-root-content"
          style={{ minHeight: 40, padding: 0, backgroundColor: '#fff', height: '100%' }}
        >
          <MyRenderer
            content={editor.pageContent}
            onClickComponent={onClickComponent}
            onDragStart={onDragStart}
            onDropIntoContainer={onDropIntoContainer}
          ></MyRenderer>

          {editor.pageContent.length === 0 && (
            <div className="app-root-content-placeholder">
              Drag and drop components or templates here
            </div>
          )}
        </div>
        <div className="app-root-footer"></div>
      </div>
    </div>
  )
}

export default App
