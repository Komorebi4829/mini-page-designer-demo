import React, { memo, useState, useEffect, Fragment } from 'react'
import { CheckCircleTwoTone } from '@ant-design/icons'
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
    width: attrs.fontSize ? `${attrs.fontSize}px` : undefined,
    height: attrs.fontSize ? `${attrs.fontSize}px` : undefined,
  }

  return (
    <div
      className={classNames(className)}
      style={{
        cursor: 'move',
      }}
      onClick={onClick}
      ref={drag}
    >
      {attrs.iconUrl ? (
        <img
          src={attrs.iconUrl}
          style={{ objectFit: 'contain', ...styles, ...styleInAttrs }}
          alt="Icon"
        />
      ) : (
        <CheckCircleTwoTone style={{ width: '100%', height: '100%', fontSize: attrs.fontSize }} />
      )}
    </div>
  )
})
export default Index
