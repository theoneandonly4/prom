/* Prom crypt script
* By Pierre-Etienne ALBINET
* Started 20181111
* Changed 20190218
*/

var Internal = Internal || {};
var convert = Internal.convert;


(function() {
    'use strict';

    var crypto = window.crypto;

    if (!crypto || !crypto.subtle || typeof crypto.getRandomValues !== 'function') {
        throw new Error('WebCrypto not found');
    }

    Internal.crypt = {
      getRandomBytes: function(size) {
            var array = new Uint8Array(size);
            crypto.getRandomValues(array);
            return array.buffer;
      },
      encrypt: function(key, data, iv) {
        key = new Uint8Array(convert.hexToBytes(key)).buffer
        iv = convert.hexToBytes(iv)
        var cryptData
        if (data instanceof Uint8Array) {
          cryptData = data
          // Do Nothing
        }
        else {
          cryptData = new TextEncoder('utf-8').encode(data)
        }
        return crypto.subtle.importKey('raw', key, {name: 'AES-CBC'}, false, ['encrypt']).then(function(key) {
          return crypto.subtle.encrypt({name: 'AES-CBC', iv: new Uint8Array(iv)}, key, cryptData).then(function(res){
            return convert.bytesToHex(new Uint8Array(res));
          });
        });
      },
      decrypt: function(key, data, iv) {
        key = new Uint8Array(convert.hexToBytes(key)).buffer
        iv = convert.hexToBytes(iv)
        var cryptData = new Uint8Array(convert.hexToBytes(data))
        return crypto.subtle.importKey('raw', key, {name: 'AES-CBC'}, false, ['decrypt']).then(function(key) {
          return crypto.subtle.decrypt({name: 'AES-CBC', iv: new Uint8Array(iv)}, key, cryptData).then(function(res) {
            return new TextDecoder('utf-8').decode(new Uint8Array(res));
          });
        });
      }
    }
})();
