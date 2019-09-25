/*
* 出参定义
*/
var Random = require('mockjs').Random;
var response = function () {
  return {
    retcode: "0000",
    retmsg: "成功",
    'retdata': {
	    'incomeratio|1-10.3': 1,
	    'cashboxpluscode': '@string("number", 8)',
	    'navdate': '@date("yyyy-MM-dd")',
	    'componentlist|6-10': [
	    	{
	    		'fundcode': '@string("number", 8)',
	    		'fundname': '@string(6.10)',
	    		'ratio': '12.10%'
	    	}
	    ]
    }
  };
}

module.exports = response;