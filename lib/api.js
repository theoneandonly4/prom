// Prometeus api Client side javascript
// By Pierre-Etienne ALBINET
// Started 20190117
// Changed 20190218

var Internal = Internal || {};

(function() {
  'use strict';

  Internal.api = {
    citm: function(prt, typ, val, cry, callback) {
      var data =  'prt=' + prt +
                  '&typ=' + typ +
                  '&val=' + val +
                  '&cry=' + cry;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'citm', true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'JSON';
      xhr.onload = function(e) {
        var arrOfStrings = JSON.parse(xhr.response);
        return arrOfStrings
      };
      xhr.send(data);
    },

    ritm: function(id, prt, typ, val, callback) {
      var data =  'id=' + id +
                  '&prt=' + prt +
                  '&typ=' + typ +
                  '&val=' + val
      var xhr = new XMLHttpRequest()
      xhr.open('GET', 'ritm?' + data, true)
      xhr.responseType = 'JSON'
      xhr.onload = function(e) {
        var arrOfStrings = JSON.parse(xhr.response)
        callback(arrOfStrings)
      }
      xhr.send()
    },

    uitm: function(id, prt, typ, val, cry, callback) {
      var data =  'id=' + id +
                  '&prt=' + prt +
                  '&typ=' + typ +
                  '&val=' + val +
                  '&cry=' + cry
      var xhr = new XMLHttpRequest()
      xhr.open('POST', 'uitm', true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'JSON'
      xhr.onload = function(e) {
        var arrOfStrings = JSON.parse(xhr.response)
        callback(arrOfStrings)
      }
      xhr.send(data)
    }
  };
})()
