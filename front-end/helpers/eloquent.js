// Crockford on JavaScript - Act 3: Function the Ultimate

//later method
if (typeof Object.prototype.later !== 'function') {
	Object.prototype.later = function (msec, method) {
		var that = this,
			args = Array.prototype.slice.apply(arguments, [2]);
		if (typeof method === 'string') {
			method = that[method];
		}
		setTimeout(function(){
			method.apply(that, args);
		},msec);
	};
}


//Partial Application
function curry(func) {
	var args = arguments.slice(1);
	return function () {
		return func.apply(null,args.concat(arguments.slice()));
	};
}
var inc = curry(function add(a,b){
	return a + b;
},1);

console.log(inc(6));//7


//Make promise()
function make_promise(){

}


//Sealer/Unsealer
function make_sealer(){
	var boxes = [], values = [];
	return {
		sealer: function (value) {
			var i = boxes.length, box = {};
			boxes[i] = box;
			values[i] = value;
			return box;
		},
		unsealer: function (box) {
			return values[boxes.indexOf(box)];
		};
	};
}


//Eloquent JavaScript
function negate(func){
	return function(){
		return !func.apply(null, arguments);
	};
}

//A Module Pattern
var singleton = (function () {
	
}());