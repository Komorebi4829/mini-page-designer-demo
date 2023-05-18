import React, { memo, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { useDrag, useDrop } from 'react-dnd'
import { Carousel } from 'antd'
import MyRenderer from '@/App/Components/MyRenderer'

const Index = memo((props) => {
  const {
    item,
    className,
    onClick,
    onDragStart,
    onDropIntoContainer,
    onClickComponent,
    children,
    styles,
  } = props
  const { attrs } = item || {}
  const carouselRef = useRef()
  console.log('MyCarousel', props)

  useEffect(() => {
    carouselRef?.current?.goTo(attrs.current)
  }, [attrs.current])

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
      // onDropIntoContainer(sourceItem, targetItem)
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

  const onChange = (a, b, c) => {}

  const transformAttrs = {
    autoplay: false,
    dots: attrs?.indicatorDots,
    dotPosition: attrs?.vertical === true ? 'left' : 'bottom',
  }

  return (
    <>
      {item.children?.length > 0 ? (
        <div
          className={classNames(className)}
          style={{ ...styles, cursor: 'move' }}
          onClick={onClick}
          ref={drag}
          data-id={item.i}
        >
          <Carousel
            afterChange={onChange}
            style={{ ...styles }}
            {...transformAttrs}
            ref={carouselRef}
          >
            {item.children?.map((childItem, index) => {
              return (
                <div onClick={onClick} key={childItem.i} data-id={`carouselItem-${index}`}>
                  <MyRenderer
                    content={childItem.children}
                    onClickComponent={onClickComponent}
                    onDragStart={onDragStart}
                    onDropIntoContainer={onDropIntoContainer}
                  ></MyRenderer>
                </div>
              )
            })}
          </Carousel>
        </div>
      ) : (
        <div
          data-id="noCarouselItem"
          style={{
            minHeight: 60,
            height: 160,
            width: '100%',
            backgroundColor: isOver && isOverCurrent && canDrop ? '#d6d3d1' : '#f0f0f0',
            border: '1px dotted',
            color: '#a7b1bd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
        >
          Drag and drop using the outline tree
        </div>
      )}
    </>
  )
})
export default Index
