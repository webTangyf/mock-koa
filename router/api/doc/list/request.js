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
  			type: '1',
  		},
  		mockType: 'merge',
  		mockReturn : {
  			type: '1',
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