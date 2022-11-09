angular.module(objParams.appName).service("StyleSrvice",["OBJECT_PARAMS","$timeout","$log",function(OBJECT_PARAMS,$timeout,$log){
	var constants = OBJECT_PARAMS.constants;
	var settings,styleParams,isDisplayTime12, isShowSeparator ,boxBorderRadius,boxBorderWidth,maxHours,columnWidth,css,isMobile;
	
	function initParams(aSettings,aStyleParams,aisMobile){
	    isMobile        = aisMobile,
	    settings        = aSettings,
        styleParams     = aStyleParams,
        css             = '',
        isDisplayTime12 = (settings.display_time === constants.DISPLAY_TIME_12),
        isShowSeparator = (settings.separator.show === 1),
        maxHours        = (settings.max_hours * 24)+'px',  
        columnWidth     = 100/Math.max(1,settings.max_column)+'%',
        boxBorderRadius = (isMobile) ? '1px' : ~~(settings.box['border-radius'])+'px',
        boxBorderWidth  = (isMobile) ? '1px' : ~~(settings.box['border-width'])+'px';
        //$log.log('columnWidth:',columnWidth,settings.max_hours,settings.max_column);
	}
	
	function styleVerticalMobile(){
	    css = '#box{-webkit-border-radius:'+boxBorderRadius+';-moz-border-radius:'+boxBorderRadius+';border-radius:'+boxBorderRadius+';border-width:'+boxBorderWidth+';}';
	    
	    if(isShowSeparator){
            css += '#box .box-inside table.tbl_days tr td.separator{border-top-width: 1px; border-top-style: dashed; clear: both; margin-top:5px; font-size: 14px;}';
            css += '#box .box-inside table.tbl_days tr td.top_separator{border-bottom-width: 2px; border-bottom-style: solid; margin-top: 0; margin-bottom: 5px;width: 100%;}';          
            css += '#box .box-inside table.tbl_close_message tr td.top_separator {border-top-width: 2px; border-top-style: solid; width: 100%;}';
            css += '#box .box-inside table.tbl_close_message tr td.bottom_separator {border-bottom-width: 2px; border-bottom-style: solid; width: 100%;margin-bottom: 20px;}';
            
        }else{
            css += '#box .box-inside table.tbl_days tr td.separator{border:0;display:none;height: 0;}';
            css += '#box .box-inside table.tbl_days tr td.top_separator{border: 0; margin: 0;}';
            css += '#box .box-inside table.tbl_close_message tr td.top_separator, #box .box-inside table.tbl_close_message tr td.bottom_separator{border:0}';
        }    
	    //$log.log('VerticalMobile css:',css); 
	    return css;
	   
	}
	
    function styleVertical(){
        css = '#bh-box-vertical{-webkit-border-radius:'+boxBorderRadius+';-moz-border-radius:'+boxBorderRadius+';border-radius:'+boxBorderRadius+';border-width:'+boxBorderWidth+';}';
                
        if(isDisplayTime12) {
            css += '#bh-box-vertical { min-width:335px;}';
            css += '#bh-box-inside-vertical {min-width:285px;}';
            css += '.start-hour-vertical{ min-width:60px;}';
        }else{
            css += '#bh-box-vertical {min-width:285px;}';
            css += '#bh-box-inside-vertical {min-width:235px;}';
            css += '.start-hour-vertical { min-width:50px; /*margin-left: 10px;*/}';
        }
        
        if(isShowSeparator){
            css += '#bh-box-top-line-vertical{ border-bottom-width: 2px; border-bottom-style: solid; margin-top: 0; margin-bottom: 5px;}';
            css += 'div.slot-day-vertical + div.slot-day-vertical {border-top-width: 2px;border-top-style: dashed;clear: both; margin-top:5px;font-size: 14px;}';
            css += '#closeMsg-vertical{border-top-width:2px; border-top-style:solid;border-bottom-width: 2px;border-bottom-style:solid;}';            
        }else{
            css += '#bh-box-top-line-vertical{border: 0; margin: 0;}';
            css += 'div.slot-day-vertical + div.slot-day-vertical {border:0;}';
            css += '#closeMsg-vertical{border:0;}';
        }
                
        css += '@media only screen and (min-width:' + ((isDisplayTime12) ? '336px': '286px') + '){'+
                    '#bh-box-inside-vertical{' +
                        'margin-right: 25px !important;' +
                        'margin-left: 25px !important;' +
                    '}' +
                '}';
        //$log.log('Vertical css:',css); 
        return css;  
    }
        
    function styleHorizontal(){
        css = '#bh-box-horizontal{-webkit-border-radius:'+boxBorderRadius+';-moz-border-radius:'+boxBorderRadius+';border-radius:'+boxBorderRadius+';border-width:'+boxBorderWidth+';}';
        css += '#bh-box-days-horizontal{height:'+maxHours+';}';
        css += '#bh-box-days-horizontal ul li {width:'+columnWidth+';}';
        
        if(isDisplayTime12) {
            css += '#bh-box-horizontal{ min-width:938px;}';
            css += '#bh-box-inside-horizontal {min-width:918px;}';
            css += '#bh-box-days-horizontal ul li{ min-width:130px;}';
        }else{
            css += '#bh-box-horizontal {min-width:790px;}';
            css += '#bh-box-inside-horizontal {min-width:770px;}';
            css += '#bh-box-days-horizontal ul li{min-width:100px;}';
        }
        
        if(isShowSeparator){
            css += '#bh-box-top-line-horizontal{border-bottom-width: 2px; border-bottom-style:solid;margin-top: 0; margin-bottom: 5px;}';
            css += 'li.separator-horizontal + li.separator-horizontal{border-left-width: 1px; border-left-style:dashed; height:'+maxHours+';}';
            css += '#closeMsg-horizontal{border-top-width: 2px; border-top-style: solid; border-bottom-width: 2px; border-bottom-style: solid;}';            
        }else{
            css += '#bh-box-top-line-horizontal{border: 0; margin: 0;}';
            css += 'li.separator-horizontal + li.separator-horizontal{border-left:0;}';
            css += '#closeMsg-horizontal{border:0;}';
        }
        
        css += '@media only screen and (min-width:' + ((isDisplayTime12) ? '939px': '791px') + '){'+
                    '#bh-box-inside-horizontal{' +
                        'margin-right: 25px !important;' +
                        'margin-left: 25px !important;' +
                    '}' +
                '}';
        //$log.log('Horizontal css:',css);
       	return css;
    }
    
    function applyCssStyle(){
        if(!isMobile){ 
            var close_height = angular.element("#closeMsg").height();
            if(close_height < 40){
               angular.element("#closeMsg-horizontal").css("line-height","28px");
               angular.element("#closeMsg-vertical").css("line-height","28px");
               angular.element(".close_msg").css("height","28px");
            }else{
                angular.element("#closeMsg-horizontal").css("padding-top","5px");
                angular.element("#closeMsg-horizontal").css("padding-bottom","5px");
                angular.element("#closeMsg-vertical").css("padding-top","5px");
                angular.element("#closeMsg-vertical").css("padding-bottom","5px");
            }
        }     
        
        $timeout(function(){
            adjustHeight();
        },100);
    }
    
    this.applyLayoutStyle = function(aSettings,aStyleParams, aisMobile) {
   		initParams(aSettings, aStyleParams,aisMobile);
   		
        var styleCSS   = '',
            styleId    = 'myStyleInject'+settings.layout;
       
        if(isMobile) {
            styleCSS = styleVerticalMobile();
        } else{
            switch(settings.layout) {
                case constants.LAYOUT_VERTICAL:     styleCSS = styleVertical();    break; 
                case constants.LAYOUT_HORIZONTAL:   styleCSS = styleHorizontal();  break;
            }
        }
        
        angular.element('#'+styleId).remove();
        angular.element('<style type="text/css" id="'+styleId+'">'+styleCSS+'</style>').appendTo('head');
        applyCssStyle();
    };
}]);