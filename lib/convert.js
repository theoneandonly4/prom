/* Prom convertion script
* By Pierre-Etienne ALBINET
* Started 20190218
* Changed 20190218
*/

var Internal = Internal || {};

(function() {
    'use strict';

    Internal.convert = {
    bytesToHex: function(byteArray) {
      return byteArray.reduce((output, elem) =>
        (output + ('0' + elem.toString(16)).slice(-2)),
        '');
      // //Less performant
      // return Array.from(byteArray, function(byte) {
      //   return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      // }).join('')
    },
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    }
  }
})()
