import React, { memo, useState, useEffect, Fragment } from 'react'
import classNames from 'classnames'
import { Typography } from 'antd'
import { useDrag } from 'react-dnd'

const Index = memo((props) => {
  const { item, className, onClick, onDragStart, styles } = props
  const { value = 'Text', attrs } = item || {}
  const [{ isDragging }, drag] = useDrag({
    type: 'dragInApp',
    item: () => {
      console.log('dragInApp')
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
  const styleInAttr = attrs?.maxLine
    ? {
        WebkitLineClamp: attrs?.maxLine,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }
    : {}

  let content
  if (attrs?.content && attrs?.content.startsWith('$page.state')) {
    content = 'Example text'
  } else {
    content = attrs?.content || value
  }

  return (
    <div
      className={classNames(className)}
      style={{
        ...styles,
        ...styleInAttr,
        cursor: 'move',
      }}
      onClick={onClick}
      ref={drag}
      data-id={item.i}
    >
      {content}
    </div>
  )
})
export default Index
