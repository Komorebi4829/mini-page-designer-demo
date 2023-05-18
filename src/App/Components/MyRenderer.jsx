import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Snippets from '@/FuncSetting/components/Snippets'
import { transformStyles } from '@/utils'

const Inner_MyRenderer = (props) => {
  const editor = useSelector((state) => state.present.pageEditor)
  const dispatch = useDispatch()
  const { content, onClickComponent, onDragStart, onDropIntoContainer } = props

  return (
    <>
      {content.map((item) => {
        const { i, category, name, children, type, attrs } = item
        // Unified processing styles
        const styles = transformStyles(item.styles)
        // class
        let className = `app-root-content-item ${
          editor.selected?.i === item.i ? 'app-root-content-selected' : ''
        }`
        // Whether `for` attribute
        const isFor = attrs[':for']
        const Comp = Snippets?.[item.category][item.name]
        if (Comp) {
          const compProps = {
            className,
            item,
            key: item.i,
            'data-i': item.i,
            onClick: (e) => {
              e.stopPropagation()
              onClickComponent?.(item)
            },
            onClickComponent,
            onDragStart,
            onDropIntoContainer,
            Snippets,
            styles,
          }
          const innerProps = {
            content: item.children,
            editor,
            onClickComponent,
            onDragStart,
            onDropIntoContainer,
          }
          if (item.children && item.children.length > 0) {
            // The for attribute is set, rendering 3
            if (isFor) {
              return (
                <React.Fragment key={item.i}>
                  <Comp.preview {...compProps} key={item.i + '1'}>
                    <Inner_MyRenderer {...innerProps} />
                  </Comp.preview>
                  <Comp.preview {...compProps} key={item.i + '2'}>
                    <Inner_MyRenderer {...innerProps} />
                  </Comp.preview>
                  <Comp.preview {...compProps} key={item.i + '3'}>
                    <Inner_MyRenderer {...innerProps} />
                  </Comp.preview>
                </React.Fragment>
              )
            } else {
              return (
                <Comp.preview {...compProps}>
                  <Inner_MyRenderer {...innerProps} />
                </Comp.preview>
              )
            }
          } else {
            return <Comp.preview {...compProps} />
          }
        } else {
          console.warn('component not found', item)
          return (
            <div key={item.i}>
              {item.type},{item.name} component not found
            </div>
          )
        }
      })}
    </>
  )
}

const MyRenderer = (props) => {
  const { editor, onClickComponent, onDragStart, onDropIntoContainer } = props
  // return <>{props.children}</>
  return (
    <Inner_MyRenderer
      content={props.content}
      editor={editor}
      onClickComponent={onClickComponent}
      onDragStart={onDragStart}
      onDropIntoContainer={onDropIntoContainer}
    />
  )
}

export default MyRenderer
