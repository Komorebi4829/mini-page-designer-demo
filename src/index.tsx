import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { store } from './store'
import { Provider } from 'react-redux'
import Container from './Container'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import './index.less'

function render(props: any) {
  const { container } = props
  const root = ReactDOM.createRoot(
    container
      ? (container.getElementById('root') as HTMLElement)
      : (document.getElementById('root') as HTMLElement),
  )

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <div className="root">
          <ConfigProvider locale={enUS}>
            <DndProvider backend={HTML5Backend}>
              <Container {...props} />
            </DndProvider>
          </ConfigProvider>
        </div>
      </Provider>
    </React.StrictMode>,
  )
}

render({})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
