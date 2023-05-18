import React, { memo } from 'react'
import classNames from 'classnames'
import { useDrag, useDrop } from 'react-dnd'
import './index.less'
import MyRenderer from '@/App/Components/MyRenderer'

const Index = memo((props) => {
  const {
    item,
    className,
    onClick,
    onDragStart,
    onDropIntoContainer,
    children,
    onClickComponent,
    styles,
  } = props
  const { value, attrs } = item || {}

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
        rowGap: attrs?.rowGap,
        columnGap: attrs?.columnGap,
        gridTemplateColumns: 'repeat(12, 1fr)',
        placeItems: 'stretch',
        gridAutoRows: 'auto',
        gridArea: 'span 1 / span 1 / auto / auto',
        display: 'grid',
        position: 'relative',
        cursor: 'move',
      }}
      onClick={onClick}
      ref={drag}
    >
      {item?.children && item.children.length > 0 ? (
        <MyRenderer
          content={item?.children}
          onClickComponent={onClickComponent}
          onDragStart={onDragStart}
          onDropIntoContainer={onDropIntoContainer}
        ></MyRenderer>
      ) : (
        attrs?.columnRatio?.split(':')?.map((item, index) => {
          let v = /\d+/.test(item) ? item : 1
          v = attrs?.mobileLayout === 'vertical' ? 12 : v
          return (
            <div
              key={index}
              style={{
                flexFlow: 'column nowrap',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                display: 'flex',
                position: 'relative',
                gridArea: `span 1 / span ${v} / auto / auto`,
                minWidth: 'auto',
              }}
            >
              <div className="container-placeholder">
                Drag and drop components or templates here
              </div>
            </div>
          )
        })
      )}
    </div>
  )
})
export default Index
