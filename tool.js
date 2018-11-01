/*
*   道乐基本类型操作工具
*	@method DLTool
*	@author 唐钰丰
*	@createDate 2018-10-24
*	@modifedDate 2018-10-24
*	@return {Object} toolObj
*/
function DLTool () {

	//  类型报错信息的集成函数
	function typeError (functionName, position, type) {
		console.error(
			'DLTool ' + functionName + 
			' params ' + position + ' Cannot handle type:' + type + 
			', pleace cheched your code, thank!'
		);
	}
	//  为止报错信息的集成函数
	function unKnowError (functionName) {
		console.error('Sorry! ' + functionName + ' Cannot run for some unknow quention, pleace cheack document to position this quention');
	}

	//  空警告
	function nullError (val) {
		console.error('Sorry! ' + val + ' is null pleace cheack your option');
	}

	/**
	*	获取类型
	*	@method getType
	*	@param {Any} obj 用于判断类型的对象
	*	@return {String} 参数类型
	**/
	function getType (obj) {
		return Object.prototype.toString.call(obj).replace(/\[object|\]|\s/g, '').toLocaleLowerCase();
	}

	/**
	*	获取到一个对应的深拷贝过后的数组
	*	@method getDeepArray
	*	@param {Array} oldArray 原数组
	*	@return {Array} 深拷贝过后的结果
	*	@warning 本方法只支持到IE9 因为 Array.map 的兼容只到IE9
	**/
	function getDeepArray (oldArray) {
		var oldArrayType = getType(oldArray);
		if (oldArrayType !== 'array') {
			typeError('getDeepArray', 'One', oldArrayType);
			return false;
		}
		return oldArray.map(function (item) {
			var itemType = getType(item);
			if (itemType === 'array') {
				return getDeepArray(item);
			}
			if (itemType === 'object') {
				return mergeData({}, item);
			}
			return item;
		})
	}

	/**
	*	合并对象，返回合并后的结果
	*	@method mergeData
	*	@param {Object} oldObj 原本的对象
	*	@param {Object} currentObj 新的对象
	*	@return {Object} 合并后的结果
	**/
	function mergeData (oldObj, currentObj) {
		var oldObjType = getType(oldObj);
		var currentObjType = getType(currentObj);
		if (oldObjType !== 'object') {
			typeError('mergeData', 'One', oldObjType);
			return false
		}
		if (currentObjType !== 'object') {
			typeError('mergeData', 'Two', currentObjType);
			return false;
		}
		for (var currentObjKey in currentObj) {
			if (!currentObj.hasOwnProperty(currentObjKey)) {
				return false;
			}
			var keyType = getType(currentObj[currentObjKey]);
			var oldObjVal = oldObj[currentObjKey];
			var currentObjVal = currentObj[currentObjKey];
			// TODO: 目前只支持到ie9
			if (keyType === 'array') {
				oldObj[currentObjKey] = getDeepArray(currentObjVal);
			} else if (keyType === 'object' && getType(oldObjVal) === 'object') {
				oldObj[currentObjKey] = mergeData(oldObjVal, currentObjVal);
			} else if (keyType === 'object') {
				oldObj[currentObjKey] = mergeData({}, currentObjVal);
			} else {
				oldObj[currentObjKey] = currentObjVal;
			}
		}
		return oldObj;
	}

	/**
	*	实现对象的深拷贝, mergeData的语法糖
	*	@method getDeepObject
	*	@param {Object} obj 需要拷贝的对象
	*	@return {Object} 返回拷贝的结果
	**/
	function getDeepObject (obj) {
		var objType = getType(obj);
		if (objType !== 'object') {
			typeError('getDeepObject', 'One', objType);
			return false
		}
		return mergeData({}, obj);
	}

	/**
	*	获取对象深层的值
	*	@method 
	*	@param {Object} obj 需要访问的对象
	*	@param {String} str 访问值的深度
	*	@return {Any} 返回对应的值 或者 false
	**/
	function getObjNestVal (obj, str) {
		var objType = getType(obj);
		var strType = getType(str);
		if (objType !== 'object') {
			typeError('getObjNestVal', 'One', objType);
			return false
		}
		if (strType !== 'string') {
			typeError('getObjNestVal', 'Two', strType);
			return false
		}
		var strArray = str.split('.');
		var strArrayLength = strArray.length;
		if (strArrayLength === 0) {
			return obj
		}
		var objVal;
		for (var i = 0; i < strArrayLength ; i++) {
			var key = strArray[i];
			if (i === 0 && obj[key]) {
				objVal = obj[key];
				continue;
			}
			if (objVal[key]) {
				objVal = objVal[key];
				continue;
			}
			objVal = false;
			break;
		}
		return objVal
	}

	/**
	*	获取对应值的计算
	*	@method calculate
	*	@param {Number} fullVal 计算值的为百分比时的大小
	*	@param {String} 要获取的值
	*	@return {Number} 返回计算结果
	**/

	function calculate (fullVal, val) {
		var fullValType = getType(fullVal);
		var valType = getType(val);
		if (fullValType !== 'number') {
			typeError('calculate', 'One', fullValType);
			return false
		}
		if (valType !== 'string') {
			typeError('calculate', 'Two', valType);
			return false
		}
		/*
		* 当值为百分比时候的处理方式
		*/
		if (val.indexOf('%') >= 0) {
			val = val.replace(/%/g, '');
			val = Number(val);
			if (isNaN(val)) {
				console.error('calculate params had some quention pleace cheack your params!');
				return false;
			}
			val = fullVal / 100 * val;
			return val;
		}
		/*
		* normal handle
		*/
		val = Number(val)
		if (isNaN(val)) {
			console.error('calculate params had some quention pleace cheack your params!');
			return false;
		}
		return val
	}

	/**
	*	获取一个数组中数字类型的最大值
	*	@method getMax
	*	@param {Array} numList 数字集合， 非数字会被忽略
	*	@return {Number} 返回最大值
	**/
	
	function getMax (numList) {
		var length = numList.length;
		var max;
		for (var i = 0; i < length; i++) {
			var item = numList[i];
			var itemType = getType(item);
			var maxType = getType(max);
			if (itemType !== 'number') {
				continue;
			}
			if (maxType === 'undefined') {
				max = item;
				continue;
			}
			if (item > max) {
				max = item;
			}
		}
		return max;
	}

	return {
		typeError: typeError,
		nullError: nullError,
		getType: getType,
		mergeData: mergeData,
		getDeepArray: getDeepArray,
		getDeepObject: getDeepObject,
		getObjNestVal: getObjNestVal,
		calculate: calculate,
		getMax: getMax
	}
}
module.exports = DLTool();
