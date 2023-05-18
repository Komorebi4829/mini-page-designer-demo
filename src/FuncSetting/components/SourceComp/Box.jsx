import React, { useMemo, memo, ReactNode, useContext, CSSProperties } from 'react'
import { Tooltip } from 'antd'
import { useDrag } from 'react-dnd'
import { useSelector, useDispatch } from 'react-redux'
import './index.less'

const Box = (props) => {
  const { config, dragItem, dispatch, defaultVal } = props
  const [{ isDragging }, drag] = useDrag({
    type: config.name,
    item: dragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const common = (
    <div
      className="box-list-wrap-module"
      style={{
        opacity: isDragging ? 0.4 : 1,
      }}
      ref={drag}
    >
      <div
        style={{
          height: '30px',
          lineHeight: '30px',
          textAlign: 'center',
          fontSize: 12,
        }}
      >
        <span style={{ marginRight: 6 }}>{config.icon}</span>
        <span>{config.title}</span>
      </div>
    </div>
  )

  const onClickLeftComponent = (e) => {
    e.stopPropagation()
    if (config.name.startsWith('My')) {
      onAddComponentByClick(config, dragItem, defaultVal)
    }
  }
  const onAddComponentByClick = (config, dragItem, defaultVal) => {
    // TODO
    // dispatch({ type: 'pageEditor/addComponentByClick', payload: { config, dragItem, defaultVal } })
    // dispatch({ type: 'pageManage/onSelectComponent', payload: point })
  }

  return (
    <div className="box-list-wrap" onClick={onClickLeftComponent}>
      {config.tooltipImg ? <Tooltip title={config.tooltipImg}>{common}</Tooltip> : common}
    </div>
  )
}

export default Box
