document.write("<style>#drop,#plus{opacity:0;}</style>");

$.fn.delay = function(time, callback){
	jQuery.fx.step.delay = function(){};
	return this.animate({delay:1}, time, callback);
}

if($.browser.msie){
$(document).ready(function(){
	$("#drop").delay(500).animate({
		top:50
	},800);
});
}
else {
$(document).ready(function(){
	$("#drop").delay(500).animate({
		top:100, opacity:1
	},800);
	$("#plus").delay(800).animate({
		opacity:1
	},800);	
});
}