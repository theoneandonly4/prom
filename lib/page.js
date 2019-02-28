// Prometeus main Client side javascript
// By Pierre-Etienne ALBINET
// Started 20190131
// Changed 20190131

var Internal = Internal || {};

function pageClear(except) {
  var main = document.getElementById('main');
  var divs = main.getElementsByTagName('div');
  var i;
  for (i = 0; i < divs.length; i++) {
    if (divs[i].id != except) {
      divs[i].style.display = 'none';
    };
  };
};

function pageStatus(status) {
  document.getElementById('status').innerHTML = ' - ' + status;
};

function pageInput(text, variable, placeholder, type) {
  pageShow('in', true)
  document.getElementById('inputText').innerHTML = text;
  document.getElementById('input').value = '';
  document.getElementById('input').setAttribute('name', variable);
  document.getElementById('input').setAttribute('placeholder', placeholder);
  document.getElementById('input').setAttribute('type', type);
};

function pageChoice(text, variable, choice1, choice2) {
  pageShow('choice', true)
  document.getElementById('choiceText').innerHTML = text;
  document.getElementById('choice1').setAttribute('name', variable);
  document.getElementById('choice2').setAttribute('name', variable);
  document.getElementById('choice1').innerHTML = choice1;
  document.getElementById('choice2').innerHTML = choice2;
};

function pageShow(id, clear) {
  if (clear) {
    pageClear(id);
  };
  item = document.getElementById(id);
  item.style.display = 'inline-block';
};

function pageHide(id) {
  item = document.getElementById(id);
  item.style.display = 'none';
};
