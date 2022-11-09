/**
 * @name WidgetCtrl 
 * @Discreption:    Main controller.
 *                  Controlls display and changing of the settings parameters
 */
angular.module(objParams.appName).controller("MainCtrl",["$scope","$window","$http","$timeout","OBJECT_PARAMS","$log","StyleSrvice",
    function($scope,$window, $http,$timeout,OBJECT_PARAMS,$log,StyleSrvice){
    "use strict";
    $scope.inited               = false;
    $scope.settings             = OBJECT_PARAMS.settings;
    $scope.translation          = OBJECT_PARAMS.translation;
    $scope.styleParams          = {colors:{}};
    $scope.firstDay             = $scope.settings.first_day;
    
    var constants               = OBJECT_PARAMS.constants,
        eventsListeners         = {};
    g_isLiveSite                = isLiveSite;
    
    
    function isLiveSite(){
        return (Wix.Utils.getViewMode() === 'site');
    };
    
    var isEmpty = function(val){
        return (val === undefined || val === "");
    };
    
    function safeApply(fn) {
        $timeout(fn);
    }
    
    $scope.isHorizontal = function(){
        return ($scope.settings.layout === constants.LAYOUT_HORIZONTAL);
    };
    
    $scope.isShowTitle = function(){
        return (!isEmpty($scope.settings.title) && !isEmpty($scope.settings.title.message) && $scope.settings.title.show === 1);
    };
    
    $scope.isShowClosedDays = function(day){
        return (!isEmpty(day.message) && $scope.settings.show_closed_days === 1);
    };
    
    $scope.isShowCloseMessage = function(){
        return (!isEmpty($scope.settings.close_message.message) && $scope.settings.close_message.is_closed === 1);
    };
    
    $scope.isShowDay = function(day){
        return ($scope.isShowClosedDays(day) || ($scope.isOpenCloseHours(day,0) || $scope.isOpenCloseHours(day,1) || $scope.isOpenCloseHours(day,2)));
    };
    
    $scope.getDayByIndex = function($index){
        var index = ($scope.firstDay+$index)%7;
        return $scope.arrDays[index];
    };
    
    $scope.getDayName = function(day, index){
       if(index === 0) return day.name;
       return "&nbsp;";
    };
    
    $scope.isOpenCloseHours = function(day, index){
        if( day.hours === undefined ||
            day.hours[index] === undefined  ||
            day.hours[index].open === undefined ||
            day.hours[index].close === undefined
          ) {
              return false;
              
          }else{
        
        return true;
        }
    };
    
    $scope.getOpenCloseHours = function(day,index){
        return day.hours[index].open +"-"+ day.hours[index].close;
    };

	function convertAMPM(days){
		if ((""+parseInt($scope.settings.display_time,10)) === "12"){
	    	angular.forEach(days,function(day,index){
	    		var hours = day.hours;
	        	angular.forEach(hours,function(val,index2){
	        		days[index].hours[index2].open = tConvert(days[index].hours[index2].open);
	        		days[index].hours[index2].close = tConvert(days[index].hours[index2].close);
	        	});            		
	    	});
	    }
    	return days;		
	}
	
    function applyNewSettings(data, translation){
        safeApply(function(){
            $scope.settings     = data.settings;
			data.days           = convertAMPM(data.days);
            $scope.arrDays      = data.days;
            $scope.translation  = translation;
            $scope.firstDay     = $scope.settings.first_day*1;    
            $scope.initApp();
            
            //change the app size
            if(!g_isLiveSite) {
                $timeout(function(){
                    var width   = (data.settings.layout == 'vertical') ? 300 :  968,  
                        height  = $scope.getWinHeight();
                    
                    Wix.Settings.resizeComponent({ width:width, height: height});
                },300);
            }
        });
    }
    
    /**
     * @name    trackWixEvents
     * @params  none
     * @return  none
     * @desc    Listen to wix styles params changes and apply them by calling applyWixStyles()
     */
    function trackWixEvents() {
        var evid = eventsListeners.SPC || "-1";
        
        if (evid === "-1"){
            eventsListeners.SPC = Wix.addEventListener(Wix.Events.STYLE_PARAMS_CHANGE, function(styleParams){
            	$scope.styleParams = styleParams;
            	applyWixStyles(styleParams);
            });
            
            Wix.addEventListener(Wix.Events.EDIT_MODE_CHANGE, function(message){
                g_isLiveSite = (message.editMode === 'site');
            });

            Wix.addEventListener(Wix.Events.SETTINGS_UPDATED, function(params) {
                applyNewSettings(params,params.translation);
            });
        }
        
        Wix.Styles.getStyleParams(function(styleParams){
            $scope.styleParams = styleParams;
            applyWixStyles(styleParams);    
        });
        
        Wix.getCurrentPageId(function(pageId) {
            //if (supports_html5_storage()) sessionStorage[getCookieKey()+"_pageId"] = pageId;
        });
    }  
     /**
     * @name: getWinHeight
     * @param none
     * @returns (int) window (iframe) innerHeight
     * Called on $scope.$watch, reports height changes
     */
    $window.getWinHeight = $scope.getWinHeight = function () {
        return angular.element(".container").outerHeight(true)+10;
    };

    /**
     * @name: getWinWidth
     * @param none
     * @returns (int) window (iframe) innerWidth
     * Called on $scope.$watch, reports width changes
     */
    $scope.getWinWidth = function () {
        return angular.element($window).width();
    };
    
    $scope.isMobile = function(layout) {
        return (layout === OBJECT_PARAMS.mobile) ;
    };
     
    $scope.documentReady = function () {
        return $scope.inited;
    };
    
    function applyWixStyles(styleParams){   
        safeApply(function(){
            styleParams                 = styleParams || $scope.styleParams;
            $scope.styleParams          = styleParams;
            $scope.styleParams.colors   = styleParams.colors || {};
            StyleSrvice.applyLayoutStyle($scope.settings,$scope.styleParams,$scope.isMobile());
            $scope.$broadcast('stylechange',$scope.styleParams);
        }); 
    }
    
    $scope.isMobile = function(){
        return (Wix.Utils.getDeviceType() === OBJECT_PARAMS.mobile);
    };
    
    $scope.initApp = function(){
        safeApply(function(){
            $scope.inited = true;
            trackWixEvents();
        });
    };
    
    $scope.$on('$applyStyles',function(evt,data){
        StyleSrvice.applyLayoutStyle($scope.settings,$scope.styleParams,$scope.isMobile());          
    });
    
    $scope.arrDays = convertAMPM(OBJECT_PARAMS.days);
}]).run(function($log) { //Start running the app 
    try{
        Wix.Performance.applicationLoaded();
    }catch(err){
        $log.log('Wix.Performance (server 110): ', err);
    }
});
