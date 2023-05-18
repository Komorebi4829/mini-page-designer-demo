import React, { useState, useEffect, useRef } from 'react'
import { Button, message, Modal } from 'antd'
import ProTable from '@ant-design/pro-table'
import { queryDataSourcesList } from '@/mockService'

const Index = (props) => {
  const { data, onCancel, onChangeDataSource } = props
  const actionRef = useRef()
  const [selectedRowKeys, setselectedRowKeys] = useState(data || [])

  useEffect(() => {
    if (!!data) {
      setselectedRowKeys(data)
    }
  }, [data])

  const columns = [
    { title: 'id', key: 'id', dataIndex: 'id' },
    { title: 'Name', key: 'dataName', dataIndex: 'dataName' },
    { title: 'Key', key: 'dataKey', dataIndex: 'dataKey' },
    { title: 'Type', key: 'dataType', dataIndex: 'dataType' },
    { title: 'Description', key: 'dataDescribe', dataIndex: 'dataDescribe' },
    { title: 'Status', key: 'dataStatus', dataIndex: 'dataStatus' },
    { title: 'createdDate', key: 'createdDate', dataIndex: 'createdDate' },
  ]

  const onOk = () => {
    message.info(
      'If the data source changes, please reconfirm variable management and variable binding',
      4,
    )
    onChangeDataSource(selectedRowKeys)
    onCancel()
  }

  return (
    <Modal
      width="80%"
      destroyOnClose
      title="Data Source"
      open={!!data}
      onCancel={onCancel}
      onOk={onOk}
    >
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        search={false}
        size="small"
        pagination={{ pageSize: 20 }}
        columns={columns}
        request={(params, sorter, filter) => {
          return queryDataSourcesList({ ...params, sorter, filter }).then((res) => {
            // If the json is copied, the data source may not be in this list, you need to delete the selected
            let newData = []
            res?.data?.map((item1) => {
              selectedRowKeys.map((item2) => {
                if (item1.id === item2) {
                  newData.push(item2)
                }
              })
            })
            setselectedRowKeys(newData)
            return res
          })
        }}
        rowSelection={{
          // defaultSelectedRowKeys: selectedRowKeys,
          selectedRowKeys: selectedRowKeys,
          preserveSelectedRowKeys: true,
          onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            setselectedRowKeys(selectedRowKeys)
          },
        }}
      />
    </Modal>
  )
}

export default Index
