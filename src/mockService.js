import defaultSchema from '@/assets/default_schema.json'

export async function queryFileResourceListAll() {
  return [
    {
      fileName: 'test',
      fileUrl: 'https://avatars.githubusercontent.com/in/29110?s=48&v=4',
    },
  ]
}

export async function getSchema({ dataSourceId, methodId }) {
  return {
    fields: [
      {
        fieldCode: 'data',
        fieldType: 'object',
        children: [
          {
            fieldCode: 'id',
            fieldType: 'string',
          },
          {
            fieldCode: 'name',
            fieldType: 'string',
          },
          {
            fieldCode: 'type',
            fieldType: 'string',
          },
        ],
      },
    ],
    msg: '',
    code: 200,
  }
}

export async function editAppPage() {
  return {}
}

export async function queryAppPageById() {
  return {
    pageJson: JSON.stringify(defaultSchema),
  }
}

export async function queryAppDataById() {
  return {
    id: '1',
    methodList: [
      {
        id: '1',
        methodName: 'getFoodDetails',
        methodKey: 'getFoodDetails',
        type: 1,
        methodParams: [
          {
            fieldCode: 'foodId',
            fieldName: 'foodId',
            isMust: true,
          },
        ],
      },
    ],
  }
}

// data sources list
export async function queryDataSourcesList() {
  return {
    data: [
      {
        id: '1',
        dataName: 'getFoodDetails',
        dataKey: 'getFoodDetails',
        dataType: 'model',
        dataDescribe: '',
        dataStatus: '1',
        createdDate: '2022-06-10',
      },
    ],
    rows: 1,
    size: 1,
    total: 1,
  }
}

/*
http://h5.dooring.cn/uploads/image_176b4b2ad03.png
http://h5.dooring.cn/uploads/image_176b4b5f141.png
http://h5.dooring.cn/uploads/image_176b4b67c23.png
*/
