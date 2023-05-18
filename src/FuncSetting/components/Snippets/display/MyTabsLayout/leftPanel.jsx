const info = {
  category: 'display',
  name: 'MyTabsLayout',
  type: 'complexContainer',
}

export default {
  title: 'Tabs',
  ...info,
  icon: null,
}

const dragItem = {
  ...info,
  prefix: 'tabsLayout',
}
export { dragItem }
