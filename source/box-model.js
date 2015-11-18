var d3 = require('d3');

module.exports = function (){
	var model = {
		width:undefined, 
		height:undefined,
		depth:undefined,
		dispatcher:d3.dispatch('change')
	}

	model.set = function(o){
		if(!isNaN(o.width)) model.width = o.width;
		if(!isNaN(o.height)) model.height = o.height;
		if(!isNaN(o.depth)) model.depth = o.depth;
		model.dispatcher.change(model);	//notify of a change
	}

	return model;
};