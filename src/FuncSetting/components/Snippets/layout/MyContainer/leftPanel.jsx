const info = {
  category: 'layout',
  name: 'MyContainer',
  type: 'container',
}

export default {
  title: 'Container',
  ...info,
  icon: null,
}

const dragItem = {
  ...info,
  prefix: 'div',
}
export { dragItem }
