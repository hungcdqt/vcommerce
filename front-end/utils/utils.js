var utls = exports;
var _clogMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var _clogFixed2Digits = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
var should = require('should');
var assert = require('assert');

//=====================================================================
// SYSTEM FUNCTION OVERRIDES
//=====================================================================

// Add timestamp prefix to console.log
var _clog = console.log;
console.log = function() {
    var d = new Date();
    var yearStr = d.getFullYear();
    var monthStr = _clogMonth[d.getMonth()];
    var dateStr = _clogFixed2Digits[d.getDate()];
    var timeStr = d.toLocaleTimeString();
    var milliStr = d.getMilliseconds();
    var dateTimeStamp = "[" + dateStr + "/" + monthStr + "/" + yearStr + ":" + timeStr + ":" + milliStr + "]";
    if (arguments.length > 0) {
        var args = arguments;
        args[0] = dateTimeStamp + " " + arguments[0];
        _clog.apply(this, args);
    } else {
        _clog(dateTimeStamp);
    }
};

//=====================================================================
// PAGE UTILS
//=====================================================================

utls.page = {

    /**
     * Assert brower's status load success
     * @param  {[type]} browser [description]
     * @return {[type]}         [description]
     */
    assertLoadSuccess: function(browser) {
        browser.should.have.property('resources');
        browser.resources.should.be.instanceOf(Array);
        browser.resources[0].should.have.property('response');
        browser.resources[0].response.should.have.property('headers');
        browser.resources[0].response.statusCode.should.equal(200);
    },

    /**
     * Wait page load all script before check
     * @param  {Brower}   brower   [description]
     * @param  {Function} callback [description]
     * @param  {Number}   time     [optional] default is 30s
     */
    waitLoadScripts: function(brower, callback, time) {
        time = time || 30000;
        brower.wait(time, callback);
    },

    /**
     * get cookie by name
     * @param  {Brower}   brower   [description]
     * @param  {cookiName}
     */
    getCookie: function(browser, name) {
        cName = "";
        pCOOKIES = browser.document.cookie.split('; ');
        for (bb = 0; bb < pCOOKIES.length; bb++) {
            NmeVal = pCOOKIES[bb].split('=');
            if (NmeVal[0] == name) {
                cName = unescape(NmeVal[1]);
            }
        }
        var inforCookie = JSON.parse(cName.split('j:')[1]);
        return JSON.parse(inforCookie.toString());
    }

};

//=====================================================================
// CSS UTILS
//=====================================================================

utls.css = {

    /**
     * Check if element has css or not
     *
     * @param  {[type]} browser   [description]
     * @param  {Element|Selector} selector        [description]
     * @param  {String} className [description]
     */
    assertClass: function(browser, selector, className) {
        if (browser.window.$) {
            browser.window.$(selector).hasClass(className).should.ok;
        } else {
            // TODO: implement check page without jquery
        }
    }

};