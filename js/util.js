(function(window) {
	let util = {};

	// return an integer which belongs to min and max,
	// if only one argument provided, return a integer between 0 and max(this function is still under processing)
	util.getRandomInt = function(min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;
	};

	// return an array, each element of the array is integer and belongs to min and max
	util.getRandomRange = function(n, min, max) {
	    let arr = [];
	    for (let i = 0; i < n; i++) {
	        arr.push(this.getRandomInt(min, max))
	    };
	    return arr;
	};

	return window.util = util;
})(this);