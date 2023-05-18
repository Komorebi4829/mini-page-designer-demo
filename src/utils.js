export function uuid(len, radix) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = [],
    i
  radix = radix || chars.length

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

// Convert rgba string object to rgba object
export function rgba2Obj(rgba = '') {
  let reg = /rgba\((\d+),(\d+),(\d+),(\d+)\)/g
  let rgbaObj = { r: 0, g: 0, b: 0, a: 0 }

  rgba.replace(reg, (_m, r, g, b, a) => {
    rgbaObj = { r, g, b, a }
    return rgba
  })
  return rgbaObj
}

export function unParams(params = '?a=1&b=2&c=3') {
  let obj = {}
  params &&
    // eslint-disable-next-line no-useless-escape
    params.replace(/((\w*)=([\.a-z0-9A-Z]*)?)?/g, (m, a, b, c) => {
      if (b || c) obj[b] = c
    })
  return obj
}

export function throttle(fn, delay) {
  let flag = true
  return (...args) => {
    if (flag) {
      flag = false
      fn(...args)
      setTimeout(() => {
        flag = true
      }, delay)
    }
  }
}

export function connectValueUnit(value, unit) {
  const unit2 = unit === 'rpx' ? 'px' : unit
  return `${value}${unit2}`
}

export function transformStyles(styles) {
  // Processing unit, spliced and then passed to the component for rendering
  const hasUnit = [
    'width',
    'height',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'fontSize',
    'lineHeight',
    // 'borderWidth',
    'borderTopWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderBottomWidth',
    // 'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    //position
    'top',
    'left',
    'right',
    'bottom',
  ]
  const copyStyles = { ...styles }
  for (let key in hasUnit) {
    const item = hasUnit[key]
    const d = copyStyles[item]
    if (!!d && typeof d === 'string') {
      copyStyles[item] = d
    } else {
      if ((d?.value || d?.value === 0) && d?.unit) {
        copyStyles[item] = connectValueUnit(d.value, d.unit)
      } else {
        copyStyles[item] = undefined
      }
    }
  }
  // handle shadows
  if (copyStyles.boxShadow) {
    const d = copyStyles.boxShadow
    let str = ''
    if (d.color) str += d.color
    if (d.x.value) str += ' ' + connectValueUnit(d.x.value, d.x.unit)
    if (d.y.value) str += ' ' + connectValueUnit(d.y.value, d.y.unit)
    if (d.blur.value) str += ' ' + connectValueUnit(d.blur.value, d.blur.unit)
    if (d.spread.value) str += ' ' + connectValueUnit(d.spread.value, d.spread.unit)
    // console.log('handle shadows', str)
    copyStyles.boxShadow = str
  }
  return copyStyles
}
