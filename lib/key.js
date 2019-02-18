/* Prom Key script
* By Pierre-Etienne ALBINET
* Started 20190213
* Changed 20190213
*/

var Internal = Internal || {};
var convert = Internal.convert;

(function() {
    'use strict';

    var crypto = window.crypto;

    if (!crypto || !crypto.subtle || typeof crypto.getRandomValues !== 'function') {
        throw new Error('WebCrypto not found');
    };

    Internal.key = {
      generate: function() {
        crypto.subtle.generateKey(
          {
              name: 'AES-CBC',
              length: 256,
          },
          true,
          ['encrypt', 'decrypt']
        ).then(function(key) {
          crypto.subtle.exportKey(
            "raw",
            key
          ).then(function(keyRaw) {
            return keyData = convert.bytesToHex(new Uint8Array(keyRaw));
          }).catch(function(err) {
            console.error(err);
          });
        }).catch(function(err) {
          console.error(err);
        });
      },
      derive: function(id, user, pass, salt) {
        var saltPBKDF2 = new TextEncoder('utf-8').encode(pass + id + user)

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
          window.crypto.subtle.deriveKey(
            {
              'name': 'PBKDF2',
              salt: salt,
              iterations: 1000,
              hash: {name: 'SHA-1'},
            },
            key,
            {
              name: 'AES-CBC',
              length: 256,
            },
            true,
            ['encrypt', 'decrypt']
          )
          .then(function(key) {
            crypto.subtle.exportKey(
              "raw",
              key
            ).then(function(keyRaw) {
              return keyData = convert.bytesToHex(new Uint8Array(keyRaw))
            }).catch(function(err) {
              console.error(err);
            });
          })
          .catch(function(err) {
            console.error(err);
          })
        })
        .catch(function(err) {
            console.error(err);
        });
      },
    };
})();
