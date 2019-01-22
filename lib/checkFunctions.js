/* Mekan-X client side check functions script
* By Pierre-Etienne ALBINET
* Started 20181104
* Changed 20181109
*/

function checkString(pass, desc, empty, minLength, maxLength, minAlpha, maxAlpha, minLower, maxLower, minUpper, maxUpper, minNum, maxNum, minSpace, maxSpace, minSymbol, maxSymbol) {
  var lower = /[a-z]/g
  var upper = /[A-Z]/g
  var num = /[0-9]/g
  var space = /[ ]/g
  var symbol = /[!@#$%^&*_]/g

  if (!pass && !empty || pass == '' && !empty) {
    return desc + ' is Required'
  }

  if (pass.length < minLength) {
    return desc + ' must be at least ' + minLength + ' characters long'
  }
  if (pass.length > maxLength) {
    return desc + ' must be at most ' + maxLength + ' characters long'
  }

  var lowerCount = ((pass || '').match(lower) || []).length
  if (lowerCount < minLower) {
    return desc + ' must contain at least ' + minLower + ' lower case letters'
  }
  if (lowerCount > maxLower) {
    return desc + ' must contain at most ' + maxLower + ' lower case letters'
  }

  var upperCount = ((pass || '').match(upper) || []).length
  if (upperCount < minUpper) {
    return desc + ' must contain at least ' + minUpper + ' upper case letters'
  }
  if (upperCount > maxUpper) {
    return desc + ' must contain at most ' + maxUpper + ' upper case letters'
  }

  var alphaCount = lowerCount + upperCount
  if (alphaCount < minAlpha) {
    return desc + ' must contain at least ' + minAlpha + ' letters'
  }
  if (alphaCount > maxAlpha) {
    return desc + ' must contain at most ' + maxAlpha + ' letters'
  }

  var numCount = ((pass || '').match(num) || []).length
  if (numCount < minNum) {
    return desc + ' must contain at least ' + minNum + ' digits'
  }
  if (numCount > maxNum) {
    return desc + ' must contain at most ' + maxNum + ' digits'
  }

  var spaceCount = ((pass || '').match(space) || []).length
  if (spaceCount < minSpace) {
    return desc + ' must contain at least ' + minSpace + ' spaces'
  }
  if (spaceCount > maxSpace) {
    return desc + ' must contain at most ' + maxSpace + ' spaces'
  }

  var symbolCount = ((pass || '').match(symbol) || []).length
  if (symbolCount < minSymbol) {
    return desc + ' must contain at least ' + minSymbol + ' symbols (!@#$%^&*_)'
  }
  if (symbolCount > maxSymbol) {
    return desc + ' must contain at most ' + maxSymbol + ' symbols (!@#$%^&*_)'
  }

  var totalChars = alphaCount + numCount + spaceCount + symbolCount
  if (totalChars < pass.length) {
    return desc + ' can only contain alphanumeric characters without accents, space and symbols (!@#$%^&*_)'
  }

  return true
}
