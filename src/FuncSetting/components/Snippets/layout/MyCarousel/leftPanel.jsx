const info = {
  category: 'layout',
  name: 'MyCarousel',
  type: 'container',
}

export default {
  title: 'Carousel',
  ...info,
  icon: null,
}

const dragItem = {
  ...info,
  prefix: 'carousel',
}
export { dragItem }
