import React, { memo, useState, useEffect, Fragment } from 'react'
import classNames from 'classnames'
import { Button, Carousel } from 'antd'
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
    >
      <Carousel>
        {attrs.imgList?.map((item, index) => (
          <div title={item?.title} key={item?.src || index}>
            <img src={item?.src} style={{ width: '100%', height: '100%' }} />
          </div>
        ))}
      </Carousel>
    </div>
  )
})
export default Index
