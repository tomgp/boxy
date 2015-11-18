'use strict';

var d3 = require('d3');
var drawBox = require('./box-draw.js');
var axonometric = require('./axonometric.js');
var box = require('./box-model.js')();

var width = 400, height = 400;
var margin = {
	top:20,
	left:20,
	bottom:20,
	right:20
}

var max = 0;
var boxDrawer = drawBox();
var projection = boxDrawer.projection()

d3.selectAll('input[type="range"]')
	.each(function(){
		max = Math.max(max, Number(this.max));
	});

var domain = [0, projection([-max, -max, max])[1]];

var scale = d3.scale.linear()
				.domain(domain)
				.range([0, height - (margin.top+margin.bottom)])


boxDrawer.origin([width/2, height-margin.bottom])
	.scale( scale );


box.dispatcher.on('change', function(m){
	d3.select('svg').call(boxDrawer, [m.width,m.height,m.depth]);
});

box.set({ 
	width:100,
	height:100,
	depth:100
});

d3.selectAll('input[type="range"]')
	.each(setByValue)
	.on('input', setByValue);

function setByValue(){
	box.set({ 
		[this.dataset.property]:Number(this.value)
	});
}

