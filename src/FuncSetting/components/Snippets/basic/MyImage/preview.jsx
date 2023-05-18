import React, { memo, useState, useEffect, Fragment } from 'react'
import classNames from 'classnames'
import { Image } from 'antd'
import { useDrag } from 'react-dnd'

const Index = memo((props) => {
  const { item, className, onClick, onDragStart, styles } = props
  const { attrs } = item || {}
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

  const styleInAttrs = {
    objectFit: attrs?.objectFit,
  }

  const attrs_2 = (() => {
    if (!attrs) return attrs
    let newAttrs = { ...attrs }
    delete newAttrs.objectFit
    return newAttrs
  })()

  return (
    <div
      className={classNames(className)}
      style={{
        cursor: 'move',
        width: styles.width,
        height: styles.height,
        display: styles.display,
      }}
      onClick={onClick}
      ref={drag}
      data-id={item.i}
    >
      <img style={{ ...styles, ...styleInAttrs }} {...attrs_2} />
    </div>
  )
})
export default Index
