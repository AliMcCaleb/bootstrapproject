angular.module(objParams.appName).directive('truncatedTooltip',["$timeout","$window","$log","OBJECT_PARAMS",function ($timeout,$window,$log,OBJECT_PARAMS) {
	var setTooltip = function (element,content){
	    //$log.log("setTooltip",element,content);
        element.popover({
            placement:  'top',
            content: content
        })     
        .on("mouseenter", function() {
            element.popover("show");
            element.siblings(".popover").on("mouseleave", function() {
                element.popover('hide');
            });
            
            var winWidth    = $(window).width(),             
                position    = element.position(),
                context     = element.siblings(".popover"),
                ctxWidth    = angular.element(context).width(), 
                ctxPos      = angular.element(context).position();
            
            if (ctxPos.left + ctxWidth + 10> winWidth) {
                angular.element(context).css('left', winWidth - ctxWidth   +"px");
                angular.element(context).css('width', ctxWidth - 10 +"px");
                ctxPos      = angular.element(context).position();
                ctxWidth    = angular.element(context).width();  
            }
            
            if (ctxPos.left < 4) angular.element(context).css('left', "4px");
            angular.element(context).find(".arrow").css("left",(position.left + element.width()/2 - ctxPos.left) + 8 +"px");            
        }).on("mouseleave", function() { 
            $timeout(function() {
                if (!angular.element(".popover:hover").length) {
                    element.popover("hide");
                }
            }, 100);
        });
	};
	
	return {
		restrict:"=A",
		link: function(scope,element,attrs,ctrl){
		    var str = attrs.tooltipContent;
		    if (str.length) {           
                element.dotdotdot({watch: "window",ellipsis : '...'});
            }
            //$log.log("attrs",attrs,element.triggerHandler("isTruncated"),str.length);
            element.trigger("isTruncated", function(isTruncated) {
                //$log.log("isTruncated:",isTruncated);
                if ( isTruncated ) {
                    var newStr = $.trim(str);
                    element.text(newStr.substring(0, newStr.length - 3)+" ...");
                    //$log.log("attrs",attrs.needTooltip);
                    if(attrs.needTooltip === 1) {
                        setTooltip(element,str);
                    }
                }
            });
		}
	};
}]);