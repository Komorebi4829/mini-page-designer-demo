import React, { memo, useState, useEffect, Fragment } from 'react'
import classNames from 'classnames'
import { Button } from 'antd'
import { useDrag } from 'react-dnd'

const Index = memo((props) => {
  const { item, className, onClick, onDragStart, styles } = props
  const { attrs } = item || {}
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

  const styleInAttr = {
    textOverflow: attrs?.textOverflow ? 'ellipsis' : null,
  }

  return (
    <div
      className={classNames(className)}
      style={{
        ...styles,
        cursor: 'move',
      }}
      onClick={onClick}
      ref={drag}
    >
      <a style={{ ...styleInAttr }}>{attrs.content}</a>
    </div>
  )
})

export default Index
