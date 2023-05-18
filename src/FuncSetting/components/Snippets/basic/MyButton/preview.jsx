import React, { memo, useState, useEffect, Fragment } from 'react'
import classNames from 'classnames'
import { Button } from 'antd'
import { useDrag } from 'react-dnd'

const Index = memo((props) => {
  const { item, className, onClick, onDragStart, styles } = props
  const { value = 'Button', attrs } = item || {}
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

  const transformAttrs = {
    type: attrs?.type === 'warn' ? 'primary' : attrs?.type,
    danger: attrs?.type === 'warn' ? true : false,
    size: attrs?.size === 'mini' ? 'small' : attrs?.size,
    disabled: attrs?.disabled,
    loading: attrs?.loading,
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
      data-id={item.i}
    >
      <Button {...transformAttrs} onClick={() => null} block>
        {attrs?.content || value}
      </Button>
    </div>
  )
})
export default Index
