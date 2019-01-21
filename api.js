// Prometeus api Client side javascript
// By Pierre-Etienne ALBINET
// Started 20190117
// Changed 20190121

function citm(id, parent, type, name) {
  var text = 'Pwet'
  console.log(text)
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'api.py?text=' + text, true)
  xhr.responseType = 'JSON'
  xhr.onload = function(e) {
    var arrOfStrings = JSON.parse(xhr.response)
  }
  xhr.send()
}

function ritm(id, parent, type, name) {
  var itm = 0
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'ritm?itm=' + itm, true)
  xhr.responseType = 'JSON'
  xhr.onload = function(e) {
    var arrOfStrings = JSON.parse(xhr.response)
    console.log(arrOfStrings)
  }
  xhr.send()
}
