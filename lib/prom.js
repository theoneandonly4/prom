// Prometeus main Client side javascript
// By Pierre-Etienne ALBINET
// Started 20190122
// Changed 20190131

var sTimer //Must be global: to be cleared by Logout function

var Internal = Internal || {};
var key = Internal.key;
var crypt = Internal.crypt;
var status;
var log = true;

main();

function main () {
  //TODO Get Status from cfg on MongoDB
  if(log) { pageStatus('Reading Config') }

  status = 'adminpwd';
  if (status == 'adminpwd') {

  }
  var session = getCookie('session')
  if (session == '') {
    pageShow('login', true);
  }
  else {
    pageShow('logout', true);
  }
}

function signin() {
  pageStatus('Creating Person...');
  var prson = document.getElementById('prson').value;
  var pass = document.getElementById('pass').value;

  //checkString(value, description, empty allowed(true|false), minLength, maxLength, minAlpha, maxAlpha, minLower, maxLower, minUpper, maxUpper, minNum, maxNum, minSpace, maxSpace, minSymbol, maxSymbol)
  var checkUser = checkString(prson, 'User Name', false, 1, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 1, 0, 16);
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

  key.derive(id, prson, pass, function(pkey) {
    key.generate(function(ukey) {
      console.log(pkey);
      console.log(ukey);
      key.wrap(ukey, pkey, function(wrap) {
        console.log(wrap);
        key.unwrap(wrap, pkey, function(uukey) {
          console.log(uukey);
        })
      })
    })
  });

  // var id = dbGenUserID()
  // var userObj = {
  //   id: id,
  //   user: user,
  //   pass: pass
  // }
  //
  // // cryptEn(userObj, userObj.pass ,cryptedPass)
  //
  // var uek = {}
  // var pek = {}
  // var wuek = {}
  //
  // cryptGen(fuek) // Generate User Encryption Key
  // function fuek(key, salt) {
  //   uek.key = key
  //   uek.salt = salt
  //   cryptDerive(userObj, fpek) // Derive Password Encryption Key
  // }
  // function fpek(key, salt) {
  //   pek.key = key
  //   pek.salt = salt
  //   cryptWrap(uek.key, pek.key, pek.salt, fwuek) // Wrap User Encryption Key with Password Encryption Key
  // }
  // function fwuek(wKey) {
  //   wuek.key = wKey
  //   cryptEncrypt(uek.salt, pek.key, pek.salt, fueks) // Crypt User Encryption Salt with Password Encryption Key
  // }
  // function fueks(cData) {
  //   wuek.salt = cData
  //   cryptEncrypt(userObj.pass, uek.key, uek.salt, cryptedPass) // Crypt User Password with User Encryption Key
  // }
  // function cryptedPass(result) {
  //   //Create User in LocalStorage
  //   var nullParent = 0
  //   dbCreateItem(nullParent, 'User', userObj.id, false)
  //   dbCreateItem(id, 'UserName', userObj.user, false)
  //   dbCreateItem(id, 'Password', result, false)
  //   dbCreateItem(id, 'UEK', wuek, false)
  //   pageStatus('User Created Locally')
  // }
}

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
    }
  }
}

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
}

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
}

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
}

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
}
