/*
*	入参定义
*/
var request = {
  type: "get",
  params: [
    "@type",
    "version"
  ],
  if: [
  	{
  		mockIf: {
  			page: '1',
  		},
  		mockType: 'cover',
  		mockReturn : {
        "returnCode": "0000",
        "returnMsg": "成功",
        "size": "15",
        "totalNumber": "90",
        "totalPage": "6",
        "page": "1",
        "first": true,
        "last": false,
        "data|15": [
          {
            "content": "资本京华一号",
            "publishDate": "@datetime()",
            "createTime": "@datetime()",
            "id": 1,
            "lang": "en",
            "priv": "0",
            "status": "1",
            "title": "资本京华一号",
            "type": "0"
          }
        ]
      }
  	},
    {
      mockIf: {
        page: '2',
      },
      mockType: 'cover',
      mockReturn : {
        "returnCode": "0000",
        "returnMsg": "成功",
        "size": "15",
        "totalNumber": "90",
        "totalPage": "6",
        "page": "2",
        "first": true,
        "last": false,
        "data|15": [
          {
            "content": "资本京华一号",
            "publishDate": "@datetime()",
            "createTime": "@datetime()",
            "id": 1,
            "lang": "en",
            "priv": "0",
            "status": "1",
            "title": "资本京华一号",
            "type": "0"
          }
        ]
      }
    },
    {
      mockIf: {
        page: '3',
      },
      mockType: 'cover',
      mockReturn : {
        "returnCode": "0000",
        "returnMsg": "成功",
        "size": "15",
        "totalNumber": "90",
        "totalPage": "6",
        "page": "3",
        "first": true,
        "last": false,
        "data|15": [
          {
            "content": "资本京华一号",
            "publishDate": "@datetime()",
            "createTime": "@datetime()",
            "id": 1,
            "lang": "en",
            "priv": "0",
            "status": "1",
            "title": "资本京华一号",
            "type": "0"
          }
        ]
      }
    },
  	{
  		mockIf: {
  			type: '1',
  			version: '2'
  		},
  		mockType: 'cover',
  		mockReturn : {
  			type: '2',
  		}
  	},
  ]
};

module.exports = request;