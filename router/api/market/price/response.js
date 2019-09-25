/*
* 出参定义
*/
var Random = require('mockjs').Random;
var response = function () {
  return {
    retcode: "0000",
    retmsg: "成功",
    "data|10": [
    	{
    		"closePrice|1.2": 1,
    		"date": "2018-10-10"
    	}
    ]
  };
}

module.exports = response;