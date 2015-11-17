module.exports = function(radians){
	var angle = Math.PI/8;
	if(radians) angle = radians;
	var sinAngle = Math.sin(angle);
	var cosAngle = Math.cos(angle);

	function projector(p){
		var x = (p[0]-p[2]) * cosAngle;
		var y = -p[1] + (p[0]+p[2]) * sinAngle;
		return [x, y];
	}

	return projector;
}