import update from 'immutability-helper'
import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd'
import { uuid } from '../utils'
import copyTOClipboard from 'copy-text-to-clipboard'

const traverse = (oldArray, id, callback) => {
  const _traverse = (array, id, callback) => {
    const newArray = []
    for (let i = 0; i < array.length; i++) {
      const item = array[i]
      let d = { ...item }
      if (item.i === id) {
        callback?.(d, newArray)
        continue
      }
      if (item.children && item.children.length > 0) {
        d.children = _traverse(item.children, id, callback)
      } else {
      }
      newArray.push(d)
    }
    return newArray
  }
  return _traverse(oldArray, id, callback)
}

export const pageEditorSlice = createSlice({
  name: 'pageEditor',
  initialState: {
    edited: false,
    selected: null,
    pageConfig: {
      deviceType: 'mobile',
      dataSource: ['1'],
      variables: [],
    },
    pageSetting: {},
    pageHeader: null,
    pageContent: [],
    pageFooter: null,
    dataSource: [], // Staging the selected data source details
  },
  reducers: {
    setInitData(state, params) {
      const { json } = params.payload
      if (Object.keys(json)?.length > 0) {
        const newState = update(state, {
          $set: {
            ...json,
          },
        })
        return newState
      }
      return state
    },
    clearLayoutData(state, params) {
      const newState = update(state, {
        pageContent: { $set: [] },
        selected: { $set: null },
        pageHeader: { $set: null },
        pageFooter: { $set: null },
      })
      return newState
    },
    unmount(state, params) {
      const newState = update(state, {
        edited: { $set: false },
        pageConfig: {
          $set: {
            deviceType: 'mobile',
            dataSource: [],
            variables: [],
          },
        },
        pageContent: { $set: [] },
        pageSetting: { $set: {} },
        selected: { $set: null },
        pageHeader: { $set: null },
        pageFooter: { $set: null },
        dataSource: { $set: [] },
      })
      return newState
    },
    addComponentByDrag(state, params) {
      const newState = update(state, {
        pageContent: { $push: [params.payload.point] },
        selected: { $set: params.payload.point },
      })
      return newState
    },
    addSliderByContainerId(state, params) {
      console.log('addSliderByContainerId', params)
      let newState = update(state, {
        pageContent: {
          $apply: (oldLayout) => {
            const newArray = traverse(oldLayout, params.payload.i, (item, newArray) => {
              item.children.push(params.payload.newSlider)
              newArray.push(item)
            })
            return newArray
          },
        },
      })
      return newState
    },
    removeComponentById(state, params) {
      console.log('removeComponentById', params)
      let newState = update(state, {
        pageContent: {
          $apply: (oldLayout) => {
            const newArray = traverse(oldLayout, params.payload.i, (item, newArray) => {})
            return newArray
          },
        },
      })
      return newState
    },
    addComponentByClick(state, params) {
      // todo
      return state
    },
    onClickComponent(state, params) {
      const newState = update(state, {
        selected: { $set: params.payload },
      })
      return newState
    },
    onNewStyleChange(state, params) {
      console.log('onNewStyleChange', params.payload)
      let newSelected = Object.assign({}, state.selected)
      let newState = update(state, {
        pageContent: {
          $apply: (oldLayout) => {
            const newArray = traverse(oldLayout, state.selected.i, (item, newArray) => {
              newSelected = update(item, { styles: { $merge: params.payload } })
              newArray.push(newSelected)
            })
            return newArray
          },
        },
      })
      newState = update(newState, { selected: { $set: newSelected } })
      return newState
    },
    setNewStyle(state, params) {
      console.log('setNewStyle', params.payload)
      let newSelected = Object.assign({}, state.selected)
      let newState = update(state, {
        pageContent: {
          $apply: (oldLayout) => {
            const newArray = traverse(oldLayout, state.selected.i, (item, newArray) => {
              newSelected = update(item, { styles: { $set: params.payload } })
              newArray.push(newSelected)
            })
            return newArray
          },
        },
      })
      newState = update(newState, { selected: { $set: newSelected } })
      return newState
    },
    onAttrsChange(state, params) {
      console.log('onAttrsChange', params.payload)
      let newSelected = Object.assign({}, state.selected)
      let newState = update(state, {
        pageContent: {
          $apply: (oldLayout) => {
            const newArray = traverse(oldLayout, state.selected.i, (item, newArray) => {
              newSelected = update(item, { attrs: { $merge: params.payload } })
              newArray.push(newSelected)
            })
            return newArray
          },
        },
      })
      newState = update(newState, { selected: { $set: newSelected } })
      return newState
    },
    setEvents(state, params) {
      console.log('setEvents', params.payload)
      let newSelected = Object.assign({}, state.selected)
      let newState = update(state, {
        pageContent: {
          $apply: (oldLayout) => {
            const newArray = traverse(oldLayout, state.selected.i, (item, newArray) => {
              newSelected = update(item, { listeners: { $set: params.payload } })
              newArray.push(newSelected)
            })
            return newArray
          },
        },
      })
      newState = update(newState, { selected: { $set: newSelected } })
      return newState
    },
    onDropIntoContainer(state, params) {
      const { sourceItem, targetItem } = params.payload
      if (state.selected.i !== sourceItem.i) {
        console.warn('onDropIntoContainer, state.selected.i !== sourceItem.i')
        return state
      }
      const traverse = (oldArray, sourceItem, targetItem) => {
        const _traverse = (array, sourceItem, targetItem) => {
          const newArray = []
          for (let i = 0; i < array.length; i++) {
            const item = array[i]
            let d = { ...item }
            if (item.i === sourceItem.i) {
              continue
            } else if (item.i === targetItem.i) {
              d.children = [...d.children, sourceItem]
              newArray.push(d)
              continue
            }

            if (item.children && item.children.length > 0) {
              d.children = _traverse(item.children, sourceItem, targetItem)
            } else {
            }
            newArray.push(d)
          }
          return newArray
        }
        return _traverse(oldArray, sourceItem, targetItem)
      }
      const newState = update(state, {
        pageContent: {
          $apply: (oldArray) => {
            const newArray = traverse(oldArray, sourceItem, targetItem)
            return newArray
          },
        },
      })
      return newState
    },
    onMyTabsAddTab(state, params) {
      const i = state?.selected?.i
      if (!i) return state
      let newSelected = Object.assign({}, state.selected)
      const newState = update(state, {
        pageContent: {
          $apply: (oldLayout) => {
            const newArray = traverse(oldLayout, state.selected.i, (item, newArray) => {
              newSelected = update(item, { children: { $push: [params.payload] } })
              newArray.push(newSelected)
            })
            return newArray
          },
        },
      })
      return newState
    },
    onMyTabsRemoveTab(state, params) {
      const i = state?.selected?.i
      if (!i) return state
      let newSelected = Object.assign({}, state.selected)
      const newState = update(state, {
        pageContent: {
          $apply: (oldLayout) => {
            const newArray = traverse(oldLayout, state.selected.i, (item, newArray) => {
              newSelected = update(item, { children: { $splice: [[params.payload, 1]] } })
              newArray.push(newSelected)
            })
            return newArray
          },
        },
      })
      return newState
    },
    onDropIntoMyTabs(state, params) {
      const { sourceItem, targetItem, tabIndex } = params.payload
      if (state.selected.i !== sourceItem.i) {
        console.warn('onDropIntoMyTabs, state.selected.i !== sourceItem.i')
        return state
      }
      const traverse = (oldArray, sourceItem, targetItem, tabIndex) => {
        const _traverse = (array, sourceItem, targetItem, tabIndex) => {
          const newArray = []
          for (let i = 0; i < array.length; i++) {
            const item = array[i]
            let d = { ...item }
            if (item.i === sourceItem.i) {
              continue
            } else if (item.i === targetItem.i) {
              d.children[tabIndex].children.push(sourceItem)
              newArray.push(d)
              continue
            }

            if (item.children && item.children.length > 0) {
              d.children = _traverse(item.children, sourceItem, targetItem, tabIndex)
            } else {
            }
            newArray.push(d)
          }
          return newArray
        }
        return _traverse(oldArray, sourceItem, targetItem, tabIndex)
      }
      const newState = update(state, {
        pageContent: {
          $apply: (oldArray) => {
            const newArray = traverse(oldArray, sourceItem, targetItem, tabIndex)
            return newArray
          },
        },
      })
      return newState
    },
    setContent(state, params) {
      console.log('setContent', params)
      const newState = update(state, {
        pageContent: { $set: params.payload },
      })
      return newState
    },
    onChangeDataSource(state, params) {
      console.log('onChangeDataSource', params)
      const newState = update(state, {
        pageConfig: { dataSource: { $set: params.payload } },
      })
      return newState
    },
    onCacheDataSource(state, params) {
      console.log('onCacheDataSource', params)
      const newState = update(state, {
        dataSource: { $set: params.payload },
      })
      return newState
    },
    onChangePageSetting(state, params) {
      console.log('onChangePageSetting', params)
      const newState = update(state, {
        pageSetting: { $set: params.payload },
      })
      return newState
    },
    addVariable(state, params) {
      console.log('addVariable', params)
      const newState = update(state, {
        pageConfig: { variables: { $push: [params.payload] } },
      })
      return newState
    },
    editVariable(state, params) {
      console.log('editVariable', params)
      const { id } = params.payload
      const newState = update(state, {
        pageConfig: {
          variables: {
            $apply: (list) => {
              const newList = []
              for (let i = 0; i < list.length; i++) {
                const item = list[i]
                if (item.id === id) {
                  newList.push(params.payload)
                } else {
                  newList.push(item)
                }
              }
              return newList
            },
          },
        },
      })
      return newState
    },
    deleteVariable(state, params) {
      console.log('deleteVariable', params)
      const newState = update(state, {
        pageConfig: {
          variables: {
            $apply: (list) => {
              const id = params.payload
              const newList = []
              for (let i = 0; i < list.length; i++) {
                const item = list[i]
                if (item.id !== id) {
                  newList.push(item)
                }
              }
              return newList
            },
          },
        },
      })
      return newState
    },

    keyboardCancelSelect(state, params) {
      if (!state?.selected?.i) return state
      const newState = update(state, {
        selected: { $set: null },
      })
      return newState
    },
    keyboardCopyPointData(state, params) {
      if (!state?.selected?.i) return state
      copyTOClipboard(JSON.stringify(state.selected))
      message.success('Copy successfully')
      return state
    },
    keyboardPastePointData(state, params) {
      if (!state?.selected?.i) return state
      const text = params.payload
      let data
      try {
        data = JSON.parse(text)
      } catch {
        return state
      }
      const copy = (item) => {
        let d = { ...item }
        const id = uuid(8)
        d.i && (d.i = d.i + '_' + id)
        d.key && (d.key = d.key + '_' + id)
        if (item.children && item.children.length > 0) {
          d.children = item.children.map((child) => copy(child))
        } else {
        }
        return d
      }
      const copyData = copy(data)
      let newState = update(state, {
        pageContent: {
          $apply: (oldLayout) => {
            const newArray = traverse(oldLayout, state.selected.i, (item, newArray) => {
              newArray.push(item)
              newArray.push(copyData)
            })
            return newArray
          },
        },
      })
      newState = update(newState, { selected: { $set: copyData } })
      return newState
    },
    keyboardDelPointData(state, params) {
      if (!state?.selected?.i) return state
      let newState = update(state, {
        pageContent: {
          $apply: (oldLayout) => {
            const newArray = traverse(oldLayout, state.selected.i, (item, newArray) => {})
            return newArray
          },
        },
      })
      newState = update(newState, { selected: { $set: null } })
      return newState
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setInitData,
  clearLayoutData,
  unmount,
  addComponentByDrag,
  addSliderByContainerId,
  removeComponentById,
  addComponentByClick,
  onClickComponent,
  onNewStyleChange,
  setNewStyle,
  onAttrsChange,
  setEvents,
  onDropIntoContainer,
  onMyTabsAddTab,
  onMyTabsRemoveTab,
  onDropIntoMyTabs,
  setContent,
  onChangeDataSource,
  onCacheDataSource,
  onChangePageSetting,
  addVariable,
  editVariable,
  deleteVariable,
  keyboardCancelSelect,
  keyboardCopyPointData,
  keyboardPastePointData,
  keyboardDelPointData,
} = pageEditorSlice.actions

export default pageEditorSlice.reducer
