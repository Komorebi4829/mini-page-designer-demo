import React, { memo, useState, useEffect, Fragment } from 'react'
import classNames from 'classnames'
import { useDrag, useDrop } from 'react-dnd'

const Index = memo((props) => {
  const { item, className, onClick, onDragStart, onDropIntoContainer, styles, children } = props
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

  const [{ isOver, canDrop, isOverCurrent }, drop] = useDrop({
    accept: ['dragInApp'],
    drop: (item2, monitor) => {
      const sourceItem = item2
      const targetItem = item
      onDropIntoContainer(sourceItem, targetItem)
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
      {item?.children && item.children.length > 0 ? (
        children
      ) : (
        <div
          style={{
            minHeight: 60,
            height: '100%',
            width: '100%',
            backgroundColor: isOver && isOverCurrent && canDrop ? 'lightblue' : '#f0f0f0',
            border: '1px dotted',
            color: '#a7b1bd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
          ref={drop}
        >
          {attrs.content}
        </div>
      )}
    </div>
  )
})

export default Index
