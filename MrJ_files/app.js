// Start loading angular 
angular.module(objParams.appName, ['ng-clamp']);
angular.module(objParams.appName).constant('OBJECT_PARAMS',objParams);

angular.module(objParams.appName).run(function($log,$timeout) { //Start running the app 
    $timeout(function(){
        wixHandlers();
        adjustHeight();
        setSiteInfo();
        //setWidgetActionListener();
    },100);
}).filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
}).filter('html', ['$sce', function ($sce) { 
    return function (text) {
        return $sce.trustAsHtml(text);
    };    
}]);