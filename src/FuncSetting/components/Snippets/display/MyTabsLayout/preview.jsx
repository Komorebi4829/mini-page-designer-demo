import React, { memo, useState, useEffect, Fragment } from 'react'
import classNames from 'classnames'
import { Button, Tabs, message } from 'antd'
import { useDrag, useDrop } from 'react-dnd'
import { useSelector, useDispatch } from 'react-redux'

import MyRenderer from '@/App/Components/MyRenderer'
import './index.less'

const { TabPane } = Tabs

const Index = (props) => {
  const {
    item,
    className,
    onClick,
    onDragStart,
    styles,
    children,
    onClickComponent,
    onDropIntoContainer,
    dispatch,
  } = props

  const { attrs } = item || {}
  const [tabIndex, settabIndex] = useState()
  const [{ isDragging }, drag] = useDrag({
    type: 'dragInApp',
    item: () => {
      onDragStart?.(item)
      return {
        ...item,
        name: item.name,
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      // console.log('drag end')
    },
  })

  const [{ isDragging2 }, drag2] = useDrag({
    type: 'dragInApp',
    item: () => {
      onDragStart?.(item)
      return {
        ...item,
        name: item.name,
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      // console.log('drag end')
    },
  })

  const [{ isOver, canDrop, isOverCurrent }, drop] = useDrop({
    accept: ['dragInApp'],
    drop: (item2, monitor) => {
      const sourceItem = item2
      const targetItem = item
      message.info('TODO')
      // console.log('tabs drop', sourceItem, targetItem)
      // dispatch({
      //   type: 'pageEditor/onDropIntoMyTabs',
      //   payload: { sourceItem, targetItem, tabIndex },
      // })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
      item: monitor.getItem(),
    }),
    canDrop: (item2, monitor) => {
      return item2.i !== item.i
    },
  })

  const styleInAttr = {}
  const tranformAttrs = {
    animated: attrs?.animated,
    type: attrs?.theme,
  }

  const onChange = (key) => {
    settabIndex(key)
  }

  return (
    <div
      className={classNames(className, 'tabs-layout')}
      style={{
        cursor: 'move',
      }}
      onClick={onClick}
      ref={drag}
    >
      <Tabs
        destroyInactiveTabPane
        {...tranformAttrs}
        onChange={onChange}
        activeKey={tabIndex}
        style={{ ...styles }}
      >
        {item.children?.map((childItem, index) => {
          return (
            <TabPane
              tab={attrs.tabList?.[index]?.title}
              key={childItem.i}
              data-id={`tabPane-${index}`}
            >
              {childItem.children?.length > 0 ? (
                <MyRenderer
                  content={childItem.children}
                  onClickComponent={onClickComponent}
                  onDragStart={onDragStart}
                  onDropIntoContainer={onDropIntoContainer}
                />
              ) : (
                <div className="tabs-content-placeholder">Drag and drop using the outline tree</div>
              )}
            </TabPane>
          )
        })}
      </Tabs>
    </div>
  )
}

export default Index
