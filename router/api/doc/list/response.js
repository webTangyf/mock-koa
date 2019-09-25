/*
* 出参定义
*/
var Random = require('mockjs').Random;

var response = function () {
  return {
	  "returnCode": "0000",
	  "returnMsg": "成功",
	  "size": "15",
	  "totalNumber": "90",
	  "totalPage": "6",
	  "page": "0",
	  "first": true,
	  "last": false,
	  "data": [
	  	{
	  		"publishDate": "@datetime()",
	  		"content": "资本京华一号",
	  		"createTime": "@datetime()",
	  		"id": 1,
	  		"lang": "en",
	  		"priv": "0",
	  		"status": "1",
	  		"title": "资本京华一号",
	  		"type": "0"
	  	},
	  	{
	  		"publishDate": "@datetime()",
	  		"content": "资本京华一号",
	  		"createTime": "@datetime()",
	  		"id": 2,
	  		"lang": "en",
	  		"priv": "0",
	  		"status": "1",
	  		"title": "资本京华一号",
	  		"type": "0"
	  	}
	  ]
	}
}

module.exports = response;