// Prometeus api Client side javascript
// By Pierre-Etienne ALBINET
// Started 20190117
// Changed 20190121

function citm(id, parent, type, name) {
  var text = 'Pwet'
  console.log(text)
  var xhr = new XMLHttpRequest()
  xhr.open('POST', 'citm?', true)
  xhr.responseType = 'JSON'
  xhr.onload = function(e) {
    var arrOfStrings = JSON.parse(xhr.response)
    console.log(arrOfStrings)
  }
  xhr.send()
}

function ritm(id) {
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
