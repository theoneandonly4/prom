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
  console.log(text)
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'api.py?itm=' + itm, true)
  xhr.responseType = 'JSON'
  xhr.onload = function(e) {
    var arrOfStrings = JSON.parse(xhr.response)
    console.log(arrOfStrings)
  }
  xhr.send()
}
