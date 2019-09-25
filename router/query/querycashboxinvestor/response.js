/*
* 出参定义
*/
var Random = require('mockjs').Random;
var response = function () {
  return {
    retcode: "0000",
    retmsg: "成功",
    'retdata': {
        'marketvalue|0-100.2': 1,
        'yestincome|-10-10.2': 1,
        'totalincome|-1000-1000.2': 1,
        'incomeratio|3-4.3': 1,
        'navdate': '@date("yyyy-MM-dd")',
        'funddetaillist|7-10':[
        	{
        		'fundcode': '@string("number", 8)',
        		'fundname': '@string("lower", 6, 10)',
        		'submarketvalue|1.2': 1,
        		'yesterdayincome|-4-4.2': 1,
        		'accumulatedincome|-4-4.2': 1,
        		'ratio': '12.80%',
        	}
        ] 
    }
  };
}

module.exports = response;