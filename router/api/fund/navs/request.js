/*
*	入参定义
*/
var request = {
  type: "get",
  "params": [
  	"@page",
  	"@size",
  	"search",
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
			  "size": 15,
			  "totalNumber": 30,
			  "totalPage": 2,
			  "page": 1,
			  "number": 15,
			  "first": false,
			  "last": true,
			  "data|15": [{
			  	"fundName": "艾方多策略对冲增强15号",
			  	"fundCode": "070001",
			  	"nav": 1.01,
			  	"totalNav": 1.0,
			  	"navDate": "2016-12-22"
			  }]
			}
		}
	]
};

module.exports = request;