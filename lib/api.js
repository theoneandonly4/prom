// Prometeus api Client side javascript
// By Pierre-Etienne ALBINET
// Started 20190117
// Changed 20190121

function citm(prt, typ, val, cry, callback) {
  var data =  'prt=' + prt +
              '&typ=' + typ +
              '&val=' + val +
              '&cry=' + cry
  console.log(data)
  var xhr = new XMLHttpRequest()
  xhr.open('POST', 'citm', true)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.responseType = 'JSON'
  xhr.onload = function(e) {
    var arrOfStrings = JSON.parse(xhr.response)
    console.log(arrOfStrings)
  }
  xhr.send(data)
}

function ritm(id, prt, typ, val) {
  var id = 0
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'ritm?id=' + id, true)
  xhr.responseType = 'JSON'
  xhr.onload = function(e) {
    var arrOfStrings = JSON.parse(xhr.response)
    console.log(arrOfStrings)
  }
  xhr.send()
}
