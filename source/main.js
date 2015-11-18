'use strict';

var d3 = require('d3');
var drawBox = require('./box-draw.js');
var axonometric = require('./axonometric.js');
var box = require('./box-model.js')();
var comparator = require('./comparators.js');

var width = 600;
var height = 400;
var margin = {
	top:20,
	left:20,
	bottom:20,
	right:20
}

var boxDrawer = drawBox();
var projection = boxDrawer.projection(); //use the default projection from the drawer (isometric)
var comparisonDrawer = comparator();

//get the max slider value
var max = 0;
d3.selectAll('input[type="range"]')
	.each(function(){
		max = Math.max(max, Number(this.max));
	});
var origin = [width/2, height-margin.bottom];

var domain = [0, projection( [-max, 0, 0] )[1]];

var scale = d3.scale.linear()
				.domain( domain )
				.range([ 0, - (width/4 - (margin.left+margin.right)) ])

d3.select('.output')
	.append('svg')
		.attr({
			'width':width,
			'height':height
		});


comparisonDrawer
	.scale( scale )
	.position(origin);

boxDrawer.origin(origin)
	.scale( scale );

box.dispatcher.on('change', function(m){
	d3.select('svg').call(boxDrawer, [m.width,m.height,m.depth]);
	d3.select('svg').call(comparisonDrawer);

	d3.selectAll('label').each(function(){
		var property = this.dataset['property'];
		d3.select(this)
			.text(property + ' ' + m[property] + 'cm')
	});
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

