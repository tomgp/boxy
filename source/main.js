'use strict';

var d3 = require('d3');

var axonometric = require('./axonometric.js');
var projection = axonometric();

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
		.append('g').attr('transform','translate(200,200)')
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

drawBox(100,100,100);