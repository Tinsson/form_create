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
	function addborder(obj,index){
		if(index == 0){
			$(".nav_head").css("border-color","#2D8FD9");
		}else{
			obj.prev().css("border-color","#2D8FD9");
		}
		obj.css("border-color","#2D8FD9");
	}
	function removeborder(obj,index){
		if(index == 0){
			$(".nav_head").css("border-color","#E6E9EF");
		}else{
			obj.prev().css("border-color","#E6E9EF");
		}
		obj.css("border-color","#E6E9EF");
	}
	$(".f_li").hammer().bind("tap",function(e){
		var that = $(this);
		var index = that.index();
		if(that.find(".operation").is(":animated")){
			return false;
		}
		if(that.hasClass("active")){
			height = 0;
			that.removeClass("active");
			removeborder(that,index);
		}else{
			height = ".5rem";
			that.siblings().each(function(){
				if($(this).hasClass("active")){
					slide_li($(this),0);
					$(this).removeClass("active");
					removeborder($(this),$(this).index());
				}
			})
			that.addClass("active");
			addborder(that,index);
		}
		slide_li(that,height);
	})
	//重命名操作
	$(".rename_f").hammer().bind("tap",function(){
		var name = $(this).closest(".f_li").find(".f_con").text();
		var fid = $(this).closest(".f_li").find(".fid").val();
		$("#newname").val(name);
		$("#oldname").val(name);
		$("#fid").val(fid);
		$("#rename").show();
	})
	$(".successBtn").hammer().bind("tap",function(){
		var oldname = $("#oldname").val(),
		    newname = $("#newname").val(),
		    fid = $("#fid").val();
		if(oldname == newname){
			alert("与旧表单名相同，请再确认！");
			return false;
		}else{
			$.ajax({
				type: "post",
				url: "",
				data: {newname: newname,fid: fid},
				dataType: "json",
				success: function(d){
					alert(d.msg);
					window.location.reload();
				}
			})
		}
	})
	$(".cancelBtn").hammer().bind("tap",function(){
		$("#rename").hide();
	})
	//删除操作
	$(".delete_f").hammer().bind("tap",function(){
		var fid = $(this).closest(".f_li").find(".fid").val();
		if(confirm("确认删除此表单？")){
			$.ajax({
				type: "post",
				url: "",
				data: {fid: fid},
				dataType: "json",
				success: function(d){
					alert(d.msg);
					window.location.reload();
				}
			})
		}
	})
});