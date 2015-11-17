'use strict';

var d3 = require('d3');

var axonometric = require('./axonometric.js');
var projection = axonometric();

function boxFactory(){
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
}

function drawBox(width,height,depth){
	var edges = [	//for a back-face occluded box
		[ [0,height,depth], [0,height,0] ],
		[ [0,height,0], [width,height,0] ],
		[ [width,height,0], [width,0,0] ],
		[ [width,0,0], [width,0,depth] ],
		[ [width,0,depth], [0,0,depth] ],
		[ [0,0,depth], [0,height,depth] ],
		[ [0,height,depth], [width,height,depth] ],
		[ [width,height,depth], [width,height,0] ],
		[ [width,height,depth], [width,0,depth] ]
	];

	var projectedEdges = edges.map(function(d){
		return {
			start:projection(d[0]),
			end:projection(d[1])
		}
	});

	console.log(projectedEdges.length)

	var cardinalPoints = [
		{
			attr:'width',
			position:[width,0,0]
		},
		{
			attr:'height',
			position:[0,height,0]
		},
		{
			attr:'depth',
			position:[0,0,depth]
		}
	];

	d3.select('svg')
		.selectAll('g.origin').data([[200,200]]).enter()
		.append('g').attr({
			'transform': function(d){ return 'translate('+d[0]+','+d[1]+')'; },
			'class': 'origin'
		})

	d3.select('.origin')
		.selectAll('.edge')
			.data(projectedEdges)
		.enter()
			.append('line').attr('class', 'edge');

	d3.selectAll('.edge')
		.attr({
			x1:function(d){ return d.start[0]; },
			y1:function(d){ return d.start[1]; },
			x2:function(d){ return d.end[0]; },
			y2:function(d){ return d.end[1]; }
		});

}

var box = boxFactory();

box.dispatcher.on('change', function(m){
	drawBox(m.width, m.height, m.depth);
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

