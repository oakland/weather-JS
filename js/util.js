(function(window) {
	let util = {};

	util.getRandomInt = function(min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;	
	};

	util.getRandomRange = function(n, min, max) {
	    let arr = [];
	    for (let i = 0; i < n; i++) {
	        arr.push(this.getRandomInt(min, max))
	    };
	    return arr;
	};

	return window.util = util;
})(this);