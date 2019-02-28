// Prometeus main Client side javascript
// By Pierre-Etienne ALBINET
// Started 20190122
// Changed 20190131

var sTimer //Must be global: to be cleared by Logout function

var Internal = Internal || {};
var api = Internal.api;
var convert = Internal.convert;
var crypt = Internal.crypt;
var key = Internal.key;
var log = true;

main();

function main() {
  var user = getCookie('user')
  if (user == '') {
    pageInput('What is your code name ?', 'user', 'Code Name', 'text');
    pageStatus('Input Required');
    return true;
  }
  else {
    pageStatus('Checking Login Data...')
    api.ritm('*', 0, 'tmplt', 'prson', function(res) {
      var prsonTmpltId = res[0]['_id'];
      api.ritm(user, prsonTmpltId, 'prson', '*', function(res) {
        var userId = res[0]['_id'];
        if (userId == 'not found') {
          delCookie('user');
          main();
        }
        else {
          var session = getCookie('session');
          if (session == '') {
            api.ritm('*', userId, 'datyp', 'passcode', function(res) {
              var passCodeId = res[0]['_id'];
              if (passCodeId == 'not found') {
                pageStatus('Unprotected Person found!')
                pageChoice('Protect your identity on this site with a password?', 'newPassword', 'Ok', 'Later')
              };
            });
          }
          else {
            console.log(session);
          };
        };
      });
    });
  };
};

function inputKey(e) {
  if(e.keyCode == 13) {
    pageStatus('Looking you up...')
    var input = document.getElementById('input');
    var variable = input.getAttribute('name');
    if (variable == 'user') {
      user = input.value;
      var checkUser = checkString(user, 'User Name', false, 1, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 1, 0, 16);
      if (checkUser == true) {
        api.ritm('*', 0, 'tmplt', 'prson', function(tmplt) {
          var prsonTmpltId = tmplt[0]['_id'];
          api.ritm('*', prsonTmpltId, 'prson', user, function(userItm) {
            var userId = userItm[0]['_id'];
            if (userId == 'not found') {
              pageStatus('Person not found')
              pageChoice('Do I know you "' + user + '"?', 'newUser', 'Yes', 'No')
            }
            else { //User found in DB
              setCookie('user', userId);
              pageStatus('Person found: ' + userId);
              main();
            }
          });
        });
      };
    }
    else {
      pageStatus(checkUser);
      return false;
    };
  };
};

function createPrson(user) {
  pageStatus('Creating Person')
  api.ritm('*', 0, 'tmplt', 'prson', function(tmplt) {
    var prsonTmpltId = tmplt[0]['_id'];
    api.citm(prsonTmpltId, 'prson', user, 0, function(res) {
      if (res['error']) {
        pageStatus(res['txtError']);
      }
      else {
        api.citm(res['result'], 'datyp', 'temp', 0, function(res){
          if (res['error']) {
            pageStatus(res['txtError']);
          }
          else {
            api.citm(res['result'], 'value', 'true', 0, function(res){
              if (res['error']) {
                pageStatus(res['txtError']);
              }
              else {
                pageStatus('Person Created');
                setCookie('user', res['result']);
                main();
              };
            });
          };
        });
      };
    });
  });
};

function choice1() {
  var variable = document.getElementById('choice1')
  switch (variable.name) {
    case 'newUser':
      pageInput('The provided Code Name is unknown, please retry', 'user', 'Code Name');
      pageStatus('Input Required');
      break;
    case 'newPassword':
      pageInput('Please enter a Password:', 'password', 'Password', 'password')
      break;
    default:
      pageStatus('Application Error: wrong choice variable');
  };
};

function choice2() {
  var variable = document.getElementById('choice2')
  switch (variable.name) {
    case 'newUserChoice':
      var user = document.getElementById('input').value;
      createPrson(user);
      break;
    default:
      pageStatus('Application Error: wrong choice variable');
  };
};

function signin() {
  var user = document.getElementById('user').value;
  var pass = document.getElementById('pass').value;

  //checkString(value, description, empty allowed(true|false), minLength, maxLength, minAlpha, maxAlpha, minLower, maxLower, minUpper, maxUpper, minNum, maxNum, minSpace, maxSpace, minSymbol, maxSymbol)
  var checkUser = checkString(user, 'User Name', false, 1, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 1, 0, 16);
  if (checkUser != true) {
    pageStatus(checkUser);
    return false;
  }

  //checkString(value, description, empty allowed(true|false), minLength, maxLength, minAlpha, maxAlpha, minLower, maxLower, minUpper, maxUpper, minNum, maxNum, minSpace, maxSpace, minSymbol, maxSymbol)
  var checkPass = checkString(pass, 'Password', false, 8, 64, 2, 64, 1, 64, 1, 64, 1, 64, 0, 64, 1, 64);
  if (checkPass != true) {
    pageStatus(checkPass);
    return false;
  }

  // If Admin has no password
  if (status == 'adminpwd') {

  }

  var id = '5bfdfg70adfg'

  var saltPkey = crypt.getRandomBytes(16)
  console.log(new Uint8Array(saltPkey));
  var psalt = convert.bytesToHex(new Uint8Array(saltPkey));

  key.derive(id, user, pass, saltPkey)
  .then(function(pkey) {
    console.log(pkey);
    console.log(psalt);
    console.log(convert.hexToBytes(psalt))
    key.generate()
    .then(function(ukey) {
      console.log(ukey);
    })
  });
};

function login() {
  var user = document.getElementById('user').value
  var pass = document.getElementById('pass').value

  var id = dbGetID('UserName', user)
  var dbPass = dbGetValue(id, 'Password')
  var wuek = dbGetValue(id, 'UEK')
  var uek = {}
  var pek = {}

  var userObj = {
    id: id,
    user: user,
    pass: pass
  }

  cryptDerive(userObj, fpek) // Derive Password Encryption Key
  function fpek(key, salt) {
    pek.key = key
    pek.salt = salt
    cryptUnwrap(wuek.key, pek.key, pek.salt, fwuek)
  }
  function fwuek(key) {
    uek.key = key
    cryptDecrypt(wuek.salt, pek.key, pek.salt, false, fuek)
  }
  function fuek(dData) {
    uek.salt = dData
    cryptDecrypt(dbPass, uek.key, uek.salt, true, decryptedPass)
  }
  function decryptedPass(result) {
    if (result == pass) {
      pageStatus('Access Granted')
      setSession(user, pek)
    }
    else {
      pageStatus('Access Denied')
    };
  };
};

function setSession(user, pek) {
  var sek = {}
  var wpek = {}
  cookieObj = {
    id: + new Date(),
    user: navigator.userAgent.substring(navigator.userAgent.lastIndexOf(' ') + 1, navigator.userAgent.length),
    pass: Math.random().toString(36).substring(2, 10)
  }
  cryptDerive(cookieObj, fsek)
  function fsek(key, salt) {
    sek.key = key
    sek.salt = salt
    cryptWrap(pek.key, sek.key, sek.salt, fwpek)
  }
  function fwpek(wKey) {
    wpek.key = wKey
    cryptEncrypt(pek.salt, sek.key, sek.salt, fpeks)
  }
  function fpeks(cData) {
    wpek.salt = cData
    localStorage.crypt = JSON.stringify(wpek)
    setCookie('user', user)
    setCookie('session', cookieObj.id, 300000)
    setCookie('token', cookieObj.pass, 300000)
    pageStatus('Session Updated')
    pageUser(user)
    sessionTimer(300)
    pageShow('logout', true)
    if (!localStorage.view) {
      var userID = dbGetID('UserName', user)
      localStorage.view = JSON.stringify('user/' + userID)
    }
    display()
  }
};

function getSession(res) {
  var uek = {}
  var pek = {}
  var wpek = JSON.parse(localStorage.crypt)
  var sek = {}
  var cookieObj = {
    id: getCookie('session'),
    user: navigator.userAgent.substring(navigator.userAgent.lastIndexOf(' ') + 1, navigator.userAgent.length),
    pass: getCookie('token')
  }
  var user = getCookie('user')
  cryptDerive(cookieObj, fsek)
  function fsek(key, salt) {
    sek.key = key
    sek.salt = salt
    cryptUnwrap(wpek.key, sek.key, sek.salt, fpek)
  }
  function fpek(key) {
    pek.key = key
    cryptDecrypt(wpek.salt, sek.key, sek.salt, false, fpeks)
  }
  function fpeks(dData) {
    pek.salt = dData
    res(user, pek)
  }
};

function logout(timeout) {
  delCookie('session')
  delCookie('token')
  localStorage.removeItem('crypt') //Not working but not an priority issue
  pageHide('logout')
  pageHide('sessionTime')
  clearInterval(sTimer)
  pageHide('userName')
  pageShow('login', true)
  if (!timeout) {
    pageStatus('Logout Successful')
  }
  else {
    pageStatus('Session Timed Out')
  }
};

function sessionTimer(s) {
  clearInterval(sTimer)
  sTimer = setInterval(exec, 1000)
  function exec() {
    pageSessionTime(s)
    s--
    if (s == 0) {
      clearInterval(sTimer)
      logout(true)
    }
  }
};
