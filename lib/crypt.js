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
      encrypt: function(data, key) {
        key = new Uint8Array(convert.hexToBytes(key)).buffer
        var iv = crypt.getRandomBytes(16);
        var cryptData;
        if (data instanceof Uint8Array) {
          cryptData = data
        }
        else {
          cryptData = new TextEncoder('utf-8').encode(data)
        }
        return crypto.subtle.importKey('raw', key, {name: 'AES-CBC'}, false, ['encrypt']).then(function(key) {
          return crypto.subtle.encrypt({name: 'AES-CBC', iv: new Uint8Array(iv)}, key, cryptData).then(function(res){
            return convert.bytesToHex(new Uint8Array(iv)) + convert.bytesToHex(new Uint8Array(res));
          });
        });
      },
      decrypt: function(data, key) {
        key = new Uint8Array(convert.hexToBytes(key)).buffer;
        var iv = convert.hexToBytes(data.slice(0, 32));
        console.log(data.slice(0, 32));
        var cryptData = new Uint8Array(convert.hexToBytes(data.slice(32, data.length)));
        return crypto.subtle.importKey('raw', key, {name: 'AES-CBC'}, false, ['decrypt']).then(function(key) {
          return crypto.subtle.decrypt({name: 'AES-CBC', iv: new Uint8Array(iv)}, key, cryptData).then(function(res) {
            return new TextDecoder('utf-8').decode(new Uint8Array(res));
          });
        });
      }
    }
})();
