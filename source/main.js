'use strict';

var d3 = require('d3');
var drawBox = require('./box-draw.js');
var axonometric = require('./axonometric.js');
var box = require('./box-model.js')();
var comparator = require('./comparators.js');
var valueFormat = d3.format('.2r');
var width = 400;
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

function rescale(){
	var max = 0;
	d3.selectAll('input[type="range"]')
		.each(function(){
			max = Math.max(max, Number(this.value));
		});

		max = roundUpNice(max);
		var domain = [0, projection( [-max, 0, 0] )[1]];

		return d3.scale.linear()
			.domain( domain )
			.range([ 0, - (width/4 - (margin.left+margin.right)) ]);
}

var scale = rescale();
var origin = [width/2, height-margin.bottom];

d3.select('.visualisation')
	.append('svg')
		.attr({
			'width':width,
			'height':height
		});

comparisonDrawer
	.scale( scale )
	.position( [origin[0]+20,origin[1]] );

boxDrawer.origin(origin)
	.scale( scale );

box.dispatcher.on('change', function(m){
	
	//rescale
	scale = rescale();
	boxDrawer.scale( scale );
	comparisonDrawer.scale( scale );
	d3.select('svg')
		.call(boxDrawer, [m.width,m.height,m.depth]);
	
	d3.select('svg')
		.call(comparisonDrawer);
	
	d3.select('.data')
		.html('Volume: <b>' + valueFormat (m.volume/(1000000)) + 'm<sup>3</sup></b>');

	d3.selectAll('label').each(function(){
		var property = this.dataset['property'];
		d3.select(this)
			.html(capitalize(property) + ' <b>' + valueFormat( (m[property])/100 ) + 'm</b>')
	});
});

d3.selectAll('input[type="range"]')
	.each(setByValue)
	.on('input', setByValue);

function setByValue(){
	box.set({ 
		[this.dataset.property]:Number(this.value)
	});
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function roundUpNice(x){
	return Math.pow( 10, Math.log10(x) );
}
