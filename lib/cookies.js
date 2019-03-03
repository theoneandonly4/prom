/* Basic Cookie handling functions
* By Pierre-Etienne ALBINET
* On 20181103
* >> getCookie(<cookieName>)
* >> setCookie(<cookieName>, <cookieValue>, (opt)<expiryInDays>)
* >> delCookie(<cookieName>)
*/

function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        };
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        };
    };
    return '';
};

function setCookie(cname, cvalue, exms) {
  var d = new Date();
  var expiry;
  if (!exms) {
    document.cookie = cname + '=' + cvalue + ';path=/';
  }
  else {
    d.setTime(d.getTime() + exms);
    expiry = 'expires='+ d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expiry + ';path=/';
  };
};

function delCookie(cname) {
  var cvalue = getCookie(cname);
  var expiry = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
  document.cookie = cname + '=' + cvalue + ';' + expiry + ';path=/';
};
