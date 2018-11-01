/*
* 出参定义
*/
var Random = require('mockjs').Random;

var response = function () {
  return {
    returnCode: "0000",
    returnMsg: "成功",
    email: '@date()'
  };
}

module.exports = response;