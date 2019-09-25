/*
* 出参定义
*/
var Random = require('mockjs').Random;
var response = function () {
  return {
    retcode: "0000",
    retmsg: "成功",
    result: {
      'resultlist|20': [
        {
          createTime: "@datetime()",
          fundType: '@pick(["1", "2", "3", "4", "5", "6", "A"])',
          fundcode: Random.string('number', 6),
          fundname: andom.string('aeiou', 6, 10),
          'id|+1': 1,
          restandfall: "@float(-99, 99)%",
          valuation: "@float(-5, 5)"
        }
      ]
    }
  };
}

module.exports = response;