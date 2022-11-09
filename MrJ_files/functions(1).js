var g_origDocumentHeight    = 0,
    g_site_url              = '',
    g_isLiveSite            = false;
/**
 * @name:  openPopup
 * @param: url
 * @param: width
 * @param: height 
 * @param: title
 * @description: 
 */
function openPopup(url, width, height, title, scrollbars){
    var left            = (window.screen.width/2)-(width/2),
        top             = (window.screen.height/2)-(height/2),
        myScrollbars    = (scrollbars !== 'undefined') ? scrollbars : 0,
        win             = null;
        
    if(myScrollbars === 1)
        win = window.open(url,title ,'scrollbars=yes, width='+width+', height='+height+', top='+top+', left='+left);
    else    
        win = window.open(url,'_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+width+', height='+height+', top='+top+', left='+left);

    try{    
        if (win !== null && win.moveTo) win.moveTo(left,top);
        if (win !== null) win.focus();
    }catch(e){
               
    }
}

function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

/**
 * @name:  openModalWix
 * @param: url
 * @param: w
 * @param: h
 * @description: Open RSVP popup in Wix Modal window
 */
function openModalWix(url, w, h){
    url += "?wCompId="+Wix.Utils.getCompId();
    var onClose = function(message) { /*console.log("modal closed", message); */};
    Wix.openModal(url, w, h, onClose);
}
/**
 * @name:  openPopupWix
 * @param: url
 * @param: w
 * @param: h
 * @description: 
 */
function openPopupWix(url, w, h){
    // the following call will open a popup window positioned in the center of the screen
    var position =  {origin: Wix.WindowOrigin.FIXED, placement: Wix.WindowPlacement.CENTER};
    var onClose = function(message) { /*console.log("popup closed", message); */};
    Wix.openPopup(url, w, h, position, onClose);
}  

/**
 * @name:  strip_tags
 * @param: input
 * @param: allowed
 * @description: 
 */
function strip_tags (input, allowed) {
    allowed             = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags            = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags  = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

/**
 *@Name: setSiteInfo
 *@Description:  get current site URL form Wix settings     
 */
function setSiteInfo(){
    Wix.Settings.getSiteInfo( function(siteInfo) {
        //console.log("siteUrl:" + siteInfo.baseUrl); 
        g_site_url = siteInfo.baseUrl;
    });     
}


$(document).ready(function(){
    Wix.Styles.getStyleParams( function(styleParams) {
        if (false === g_isLiveSite){
            Wix.setHeight($("body").outerHeight());
        }
     });
});