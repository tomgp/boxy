'use strict'

var d3 = require('d3');
var axonometric = require('./axonometric.js');

function boxDrawer(){
	var projection = axonometric();
	var scale = d3.scale.linear();
	var origin = [0, 0];

	function draw(parent, dimensions){
		var width = -dimensions[0],
		height = dimensions[1],
		depth = -dimensions[2];

		var edges = [	
			[ [0,height,depth], [0,height,0] ],
			[ [0,height,0], [width,height,0] ],
			[ [width,height,0], [width,0,0] ],
			//[ [width,0,0], [width,0,depth] ],		//commented out edges effect backface culling
			//[ [width,0,depth], [0,0,depth] ],
			[ [0,0,depth], [0,height,depth] ],
			[ [0,height,depth], [width,height,depth] ],
			[ [width,height,depth], [width,height,0] ],
			//[ [width,height,depth], [width,0,depth] ],
			[ [0,0,0], [0,height,0] ],
			[ [0,0,0], [width,0,0] ],
			[ [0,0,0], [0,0,depth] ]
		];

		var projectedEdges = edges.map(function(d){
			return {
				start: projection(d[0]),
				end: projection(d[1])
			};
		});

		parent.selectAll('g.origin').data([origin]).enter()
			.append('g').attr({
				'transform': function(d){ return 'translate('+d[0]+','+d[1]+')'; },
				'class': 'origin'
			});

		d3.select('.origin')
			.selectAll('.edge')
				.data(projectedEdges)
			.enter()
				.append('line').attr('class', 'edge');

		d3.selectAll('.edge')
			.attr({
				x1:function(d){ return scale(d.start[0]); },
				y1:function(d){ return scale(d.start[1]); },
				x2:function(d){ return scale(d.end[0]); },
				y2:function(d){ return scale(d.end[1]); }
			});

	}

	draw.origin = function(a){
		if(!a) return origin;
		origin = a;
		return draw;
	}

	draw.projection = function(p){
		if(!p) return projection;
		projection = p;
		return draw;
	}

	draw.scale = function(s){
		if(!s) return scale;
		scale = s;
		return draw;
	}

	return draw;
}

module.exports = boxDrawer;