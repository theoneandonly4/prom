/* Prom Key script
* By Pierre-Etienne ALBINET
* Started 20190213
* Changed 20190213
*/

var Internal = Internal || {};
var crypt = Internal.crypt;

(function() {
    'use strict';

    var crypto = window.crypto;

    if (!crypto || !crypto.subtle || typeof crypto.getRandomValues !== 'function') {
        throw new Error('WebCrypto not found');
    };

    Internal.key = {
      generate: function(res) {
        crypto.subtle.generateKey(
          {
              name: 'AES-CBC',
              length: 256,
          },
          true,
          []
        ).then(function(key) {
          res(key);
        }).catch(function(err) {
          console.error(err);
        });
      },
      derive: function(id, prson, pass, res) {
        var saltPBKDF2 = new TextEncoder('utf-8').encode(pass + id + prson)

      //1 - Derive PBKDF2 key from saltPBKDF2
        window.crypto.subtle.importKey(
          'raw',
          saltPBKDF2,
          {
              name: 'PBKDF2',
          },
          false,
          ['deriveKey']
        )
        .then(function(key) {
          var saltKey = crypt.getRandomBytes(16)
          window.crypto.subtle.deriveKey(
            {
              'name': 'PBKDF2',
              salt: saltKey,
              iterations: 1000,
              hash: {name: 'SHA-1'},
            },
            key,
            {
              name: 'AES-CBC',
              length: 256,
            },
            false,
            ['wrapKey', 'unwrapKey']
          )
          .then(function(key) {
            res(key);
          })
          .catch(function(err) {
            console.error(err);
          })
        })
        .catch(function(err) {
            console.error(err);
        });
      },
      wrap: function(key, wrappingKey, res) {
        var salt = crypt.getRandomBytes(16)
        window.crypto.subtle.wrapKey(
          'jwk',
          key,
          wrappingKey,
          {
              name: 'AES-CBC',
              iv: salt,
          }
        )
        .then(function(wrapped) {
          //Usage of Array.from to be able to store the value
          var wrappedKey = Array.from(new Uint8Array(wrapped));
          var wrapSalt = Array.from(new Uint8Array(salt));
          console.log(wrappedKey);
          console.log(salt);
          console.log(wrapSalt);
          var wrap = [...wrappedKey, ...wrapSalt];
          res(wrap);
        })
        .catch(function(err) {
          console.error(err);
        });
      },
      unwrap: function(wrap, key, res) {
        var wrappedKey = new Uint8Array(wrap.slice(0, wrap.length - 16))
        var salt = new Uint8Array(wrap.slice(wrap.length - 16, wrap.length)).buffer
        console.log(wrappedKey);
        console.log(salt);
        window.crypto.subtle.unwrapKey(
          "jwk",
          wrappedKey,
          key,
          {
              name: "AES-CBC",
              iv: salt
          },
          {
              name: "AES-CBC",
              length: 256
          },
          true,
          ["encrypt", "decrypt"]
        )
        .then(function(key) {
          res(key)
        })
        .catch(function(err) {
          console.error(err);
        })
      }
    };
})();
