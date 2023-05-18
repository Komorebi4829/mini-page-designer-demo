import postcss from 'postcss'
import postcssJs from 'postcss-js'
import autoprefixer from 'autoprefixer'

function promiseParseJson(inputReactObjText) {
  return new Promise((resolve) => resolve(JSON.parse(inputReactObjText)))
}

export default function obj2css(input) {
  return promiseParseJson(input)
    .then((obj) => postcss([autoprefixer]).process(obj, { parser: postcssJs }))
    .then((result) => {
      return result.css
    })
}

export function css2obj(input) {
  const res = postcssJs.objectify(postcss.parse(input))
  return res
}
