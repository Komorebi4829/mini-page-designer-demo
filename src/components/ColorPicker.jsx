import React, { useState, useEffect } from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

const SketchExample = (props) => {
  const { popoverStyle = {} } = props
  const [displayColorPicker, setdisplayColorPicker] = useState(false)
  // const [color, setcolor] = useState(props.value)
  const handleClick = () => {
    setdisplayColorPicker(!displayColorPicker)
  }

  const handleClose = () => {
    setdisplayColorPicker(false)
  }

  // const handleChange = (color) => {
  //   setcolor(color.hex)
  //   props.onChange?.(color)
  // }
  const transformValue = (color) => {
    /* convert color, from {r: 84, g: 70, b: 150, a: 0.4} to rgb(84, 70, 150, 0.4) */
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
  }

  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: props.value,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
        right: 0,
        bottom: 34,
        ...popoverStyle,
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  })

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <SketchPicker
            color={props.value}
            onChange={(e) => {
              console.log(e)
              const v = transformValue(e.rgb)
              props.onChange?.(v, e)
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

export default SketchExample
