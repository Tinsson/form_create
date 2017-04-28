// jquery调用hammer
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'hammerjs'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'), require('hammerjs'));
    } else {
        factory(jQuery, Hammer);
    }
}(function($, Hammer) {
    function hammerify(el, options) {
        var $el = $(el);
        if(!$el.data("hammer")) {
            $el.data("hammer", new Hammer($el[0], options));
        }
    }

    $.fn.hammer = function(options) {
        return this.each(function() {
            hammerify(this, options);
        });
    };

    // extend the emit method to also trigger jQuery events
    Hammer.Manager.prototype.emit = (function(originalEmit) {
        return function(type, data) {
            originalEmit.call(this, type, data);
            $(this.element).trigger({
                type: type,
                gesture: data
            });
        };
    })(Hammer.Manager.prototype.emit);
}));

$(document).ready(function(){
	// 控制rem的尺寸
	var clientWid = document.body.clientWidth,
	    doc = document.documentElement;
	doc.style.fontSize = clientWid / 5 + "px";
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



	/*表单列表里操作*/
	function slide_li(obj,height){
		obj.find(".operation").animate({
			height: height
		},200);
	}
	$(".f_li").hammer().bind("tap",function(e){
		var that = $(this);
		if(that.find(".operation").is(":animated")){
			return false;
		}
		if(that.hasClass("active")){
			height = 0;
			that.removeClass("active");
		}else{
			height = ".5rem";
			that.addClass("active");
			that.siblings().each(function(){
				if($(this).hasClass("active")){
					slide_li($(this),0);
				}
			})
		}
		slide_li(that,height);
	})
});