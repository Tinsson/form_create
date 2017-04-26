$(document).ready(function(){
	// 控制rem的尺寸
	var clientWid = document.body.clientWidth,
	    doc = document.documentElement;
	doc.style.fontSize = clientWid / 5 + "px";
	console.log(clientWid);
	$(window).resize(function(){
		var clientWid = document.body.clientWidth,
		    doc = document.documentElement;
		doc.style.fontSize = clientWid / 5 + "px";
	})
	//创建一个hammer对象
	var navHD = $(".nav_head")[0];
	var manager = new Hammer.Manager(navHD);

	//创建操作
	var Pan = new Hammer.Pan();
	var Pinch = new Hammer.Pinch();
	var Tap = new Hammer.Tap({
		taps: 1
	});
	manager.add(Pan);
	manager.add(Pinch);
	manager.add(Tap);
	var deltaX = 0;
	var deltaY = 0;
	manager.on("tap",function(e){
		console.log(e);
	})
	manager.on('panmove', function(e) {
	  // do something cool
	  var dX = deltaX + (e.deltaX);
	  var dY = deltaY + (e.deltaY);
	  $.Velocity.hook(navHD, 'translateX', dX + 'px');
	  $.Velocity.hook(navHD, 'translateY', dY + 'px');
	});
	manager.on('panend', function(e) {
	  /*deltaX = deltaX + e.deltaX;
	  deltaY = deltaY + e.deltaY;*/
	  deltaX = 0;
	  deltaY = 0;
	  $.Velocity.hook(navHD, 'translateX', '0px');
	  $.Velocity.hook(navHD, 'translateY', '0px');
	});
});