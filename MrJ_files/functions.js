var g_allSettings   = null,
    postTimer       = null,
    gXHR            = null;

function ucfirst(str) {
    var text = str;
    var parts = text.split(' '),
        len = parts.length,
        i, words = [];
        
    for (i = 0; i < len; i++) {
        var part = parts[i];
        var first = part[0].toUpperCase();
        var rest = part.substring(1, part.length);
        var word = first + rest;
        words.push(word);

    }
    return words.join(' ');
};

var pad = function(num, totalChars) {
    var pad = '0';
    num = num + '';
    while (num.length < totalChars) {
        num = pad + num;
    }
    return num;
};
/***********************************************Colors Functions*************************************************/
// Ratio is between 0 and 1
var changeColor = function(color, ratio, darker) {
    // Trim trailing/leading whitespace
    color = color.replace(/^\s*|\s*$/, '');

    // Expand three-digit hex
    color = color.replace(
        /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
        '#$1$1$2$2$3$3'
    );

    // Calculate ratio
    var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
        // Determine if input is RGB(A)
        rgb = color.match(new RegExp('^rgba?\\(\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '\\s*,\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '\\s*,\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '(?:\\s*,\\s*' +
            '(0|1|0?\\.\\d+))?' +
            '\\s*\\)$'
        , 'i')),
        alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

        // Convert hex to decimal
        decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
            /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
            function() {
                return parseInt(arguments[1], 16) + ',' +
                    parseInt(arguments[2], 16) + ',' +
                    parseInt(arguments[3], 16);
            }
        ).split(/,/),
        returnValue;

    // Return RGB(A)
    return !!rgb ?
        'rgb' + (alpha !== null ? 'a' : '') + '(' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
            ) +
            (alpha !== null ? ', ' + alpha : '') +
            ')' :
        // Return hex
        [
            '#',
            pad(Math[darker ? 'max' : 'min'](
                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
            ).toString(16), 2),
            pad(Math[darker ? 'max' : 'min'](
                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
            ).toString(16), 2),
            pad(Math[darker ? 'max' : 'min'](
                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
            ).toString(16), 2)
        ].join('');
};
var lighterColor = function(color, ratio) {
    return changeColor(color, ratio, false);
};
var darkerColor = function(color, ratio) {
    return changeColor(color, ratio, true);
};
function convertRgbToHex(color){
     if(color.indexOf("rgb") != -1) {
        var rgbRegex    = /.*\((\d{1,3})\s*\,\s*(\d{1,3})\s*\,\s*(\d{1,3}).*/;
        var arr         = color.match(rgbRegex);
        color           = rgbToHex(arr[1], arr[2], arr[3]);
    }
    return color;
}
function getOpacity(color){
    if(color.indexOf("rgba") != -1) {
        var rgbRegex    = /.*\((\d{1,3})\s*\,\s*(\d{1,3})\s*\,\s*(\d{1,3})\s*,\s*(.*)\s*\)/;
        var arr         = color.match(rgbRegex);
        if (arr.length<5) return 1;
        return arr[4];
    }

    return 1;
}
//Function to convert hex format to a rgb color
function rgbS2Comps(rgb) {
    return rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9\.]+))?\)$/);
}
/**
 * @name: clearHashTag
 * @param: value - color (can be rgb, rgba, hex with hash tag)
 * @description: return hex code color without hashtag
 */
function clearHashTag(value) {
    var myColor = value;
    // if the color is rgb or rgba format convert it to hex code
    if(myColor.indexOf("rgba") != -1) {
        var str = myColor;
        var arr = str.split(",");
        var first = arr[0].split("(");
        myColor  = rgbToHex(first[1], arr[1], arr[2]);
    } else if(myColor.indexOf("rgb") != -1) {
        var str = myColor;
        var arr = str.split(",");
        var first = arr[0].split("(");
        var last = arr[2].split(")");
        myColor  = rgbToHex(first[1], arr[1], last[0]);
    }

    try {
        if (myColor[0] == '#') return myColor.substring(1);
        else return myColor;
    } catch (e) { return myColor; }
}
//convert RGBA color data to hex
function componentToHex(c) {
    var hex = (c*1).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hexToR(h) {
    return parseInt((cutHex(h)).substring(0,2),16);
}
function hexToG(h) {
    return parseInt((cutHex(h)).substring(2,4),16);
}
function hexToB(h) {
    return parseInt((cutHex(h)).substring(4,6),16);
}
function cutHex(h) {
    return (h.charAt(0)=="#") ? h.substring(1,7):h;
}
function hexToRGBA(color, opacity){
    var myColor =  "rgba("+ hexToR(color) +"," + hexToG(color) +"," + hexToB(color) + "," + opacity/100 + ")";
    return  myColor;
}
function brightnessColor(color, percent) {
    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}
function shadeRGBColor(color, percent) {
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].split('(')[1]),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}
/************************************************************************************/
function checkURL(str) {
    var options =  {/*require_protocol:false*/};
    return validator.isURL(str,options);
}
function isIE(){
    //Test if the browser is IE
    var userAgent = window.navigator.userAgent.toLowerCase();
    return (/(msie|trident)/i.test(userAgent || ''));
}
function isSafari(){
    // Test if the browser is IE
    var userAgent = window.navigator.userAgent.toLowerCase();
    return (/(safari)/i.test(userAgent || ''));
}
function openPopup(url, width, height, title, scroller){
    var w       = width,
        h       = height,
        left    = (window.screen.width/2)-(w/2),
        top     = (window.screen.height/2)-(h/2);
    
    resizable = scroller  = (scroller) ? 'yes' : 'no';
    var win = window.open(url, "settingspopup", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars='+scroller+', resizable='+resizable+', copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    
    try{
        if (win!=null && win.moveTo) win.moveTo(left,top);
        if (win!=null) win.focus();
    }catch(e){ }
}
function canResize(){
    switch (Wix.Utils.getViewMode()) {
        case 'site':
        case 'preview': return false;
    }
    return true;
}
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}
/**
 * @name    wixHandlers
 * @params  none
 * @return  none
 * @desc    Listen to wix component deleted
 */
function wixHandlers(){
    if (Wix.Utils.getDemoMode()) return;
    
    Wix.addEventListener(Wix.Events.COMPONENT_DELETED,function(params){
        $.ajax({
            type: "DELETE",
            url: '/delete'+ document.location.search
        });
    });
    
    onResizeWindow();
}
function adjustHeight(){
    $(window).ready(function(){
        setTimeout(function(){
            //console.log("adjustHeight:",getWinHeight());
            Wix.setHeight(getWinHeight());    
        },1500);
    });
}
function onResizeWindow(){
    $(window).resizeEnd({
        delay : 500
    }, function() {
        resizeWindow();
    });
}
function resizeWindow(){
    if(!canResize()) return;
    adjustHeight();
}
function saveSettingsOnCloseSettingsWindow(){
    var key             = "settings_"+Wix.Utils.getCompId(),
        data            = localStorage.getItem(key),
        allSettings     = JSON.parse(data),
        searchString    = document.location.search + "&origCompId="+Wix.Utils.getCompId();
    
    if(allSettings){
        $.post('settings/save'+ searchString, allSettings , function(result){
            location.reload();            
        },'json');
        
        localStorage.removeItem(key);
    }
}
function setWidgetActionListener(){
    $(window).bind('storage', saveSettingsOnCloseSettingsWindow);
}

function getCookieKey(){
    return [Wix.Utils.getInstanceId(),Wix.Utils.getCompId()].join("_");
}
/**
 *@Name: refreshWidget
 *@Description:  refresh current widget by id
 */
function refreshWidget(){
    Wix.Settings.refreshAppByCompIds([Wix.Utils.getOrigCompId()]);
}