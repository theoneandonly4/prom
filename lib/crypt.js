/* Prom crypt script
* By Pierre-Etienne ALBINET
* Started 20181111
* Changed 20181129
*/

var Internal = Internal || {};

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
      en: function(plain, key){

      }
    }
})();


function cryptGen(res) {
  pageStatus('Generating User Encryption Key')
  var salt = window.crypto.getRandomValues(new Uint8Array(16))
  window.crypto.subtle.generateKey(
    {
        name: 'AES-CBC',
        length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  )
  .then(function(key) {
    //returns a key object
    res(key, salt)
  })
  .catch(function(err) {
    console.error(err)
  })
}

function cryptDerive(obj, res) {
  pageStatus('Deriving Key from Login or Session')
  var saltPBKDF2 = new TextEncoder('utf-8').encode(obj.pass + obj.id + obj.user)
  var saltKey = new TextEncoder('utf-8').encode(obj.user + obj.id + obj.pass)
  var saltCrypt // defined with deriveBits

//1 - Derive PBKDF2 key from saltPBKDF2
  window.crypto.subtle.importKey(
    'raw',
    saltPBKDF2,
    {
        name: 'PBKDF2',
    },
    false,
    ['deriveKey', 'deriveBits']
  )
  .then(function(key) {

//2 - Derive encryption Salt from PBKDF2 key
    window.crypto.subtle.deriveBits(
      {
        'name': 'PBKDF2',
        salt: new TextEncoder('utf-8').encode(obj.id + obj.pass + obj.user),
        iterations: 1000,
        hash: {name: 'SHA-1'},
      },
      key,
      128
    )
    .then(function(bits) {
      saltCrypt = new Uint8Array(bits)

//3 - Derive the AES256 key from the PBKDF2 key using saltKey
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
        true,
        ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
      )
      .then(function(key) {
        res(key, saltCrypt)
      })
      .catch(function(err) {
        console.error(err)
      })
    })
    .catch(function(err) {
      console.error(err)
    })
  })
  .catch(function(err) {
      console.error(err)
  })
}

function cryptWrap(key, wrappingKey, salt, res) {
  pageStatus('Wrapping Encryption key')
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
    var wrappedKey = Array.from(new Uint8Array(wrapped))
    res(wrappedKey, salt)
  })
  .catch(function(err) {
    console.error(err)
  })
}

function cryptUnwrap(wKey, wrappingKey, salt, res) {
  pageStatus('Unwrapping User Encryption Key')
  var key = new Uint8Array(wKey)
  window.crypto.subtle.unwrapKey(
    "jwk",
    key,
    wrappingKey,
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
    pageStatus('Failed to unwrap User Encryption Key - Check User & Password ')
    console.error(err)
  })
}

function cryptEncrypt(data, key, salt, res) {
  pageStatus('Encrypting Data')
  if (data instanceof Uint8Array) {
    cryptData = data
    // Do Nothing
  }
  else {
    cryptData = new TextEncoder('utf-8').encode(data)
  }
  window.crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv: salt,
    },
    key,
    cryptData
  )
  .then(function(encrypted) {
    //Usage of Array.from to be able to store the value
    var crypted = Array.from(new Uint8Array(encrypted))
    res(crypted)
  })
  .catch(function(err) {
    console.error(err)
  })
}

function cryptDecrypt(data, key, salt, decode, res) {
  pageStatus('Decrypting Data')
  var cryptData = new Uint8Array(data)
  window.crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv: salt,
    },
    key,
    cryptData
  )
  .then(function(decrypted) {
    //ArrayBuffer in variable decrypted converted and decoded to plain text
    var decrypt = new Uint8Array(decrypted)
    if (decode) {
      decrypt = new TextDecoder('utf-8').decode(decrypt)
    }
    res(decrypt)
  })
  .catch(function(err) {
    console.error(err)
  })
}
