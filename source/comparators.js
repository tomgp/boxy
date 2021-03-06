var d3 = require('d3');

//all images should be default be 100x100, & the bottom of the shape should be aligned to y=0
var data = [{
	"item":"Tennis ball",
	"file":"ball.svg",
	"id":"ball",
	"width":0.065,
	"depth":0.065,
	"height":0.065
}];

module.exports = function(){
	var scale = d3.scale.linear(); //get the pixel size for a given m size
	var position = [400,400];

	function draw(parent){
		d = data[0]; //add more items and selection logic

		parent.selectAll('use').data([d])
			.enter()
				.append('g').attr('id','comparator-anchor')
				.append('use');

		parent.select('g#comparator-anchor')
			.attr('transform', function(d){
				return 'translate(' + position + ')';
			});

		parent.select('g#comparator-anchor')
			.selectAll('use')
			.attr({
				'xlink:href':function(d){
					return d.file + '#' + d.id;
				},
				'transform':function(d){
					return 'scale(' + (scale(1) * d.width) + ')';
				}
			});
	}

	draw.position = function(p){
		if(!p) return position;
		position = p;
		return draw;
	};

	draw.scale = function(s){
		if(!s) return scale;
		scale = s;
		return draw;
	};

	return draw;
}