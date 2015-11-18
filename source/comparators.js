var d3 = require('d3');

// d3.csv('size-data.csv',function(data){
// 	console.log( JSON.stringify(data) );
// });

//all images should be default be 100x100, & aligned to the bottom of that area
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
			.append('g').attr('transform', function(d){
				var xPos = position[0] + (scale(d.width*100));
				var yPos = position[1] - (scale(d.height*100));
				return 'translate(' + [xPos, yPos] + ')';
			})
			.append('use');

		parent.selectAll('use')
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