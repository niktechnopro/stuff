function test(){  //hoisted
	console.log('test')
}

var test = function(){//test is hoisted, but not the function definition
	console.log('test')
}