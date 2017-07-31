export default (classes, type = 'div', innerHTML = null) => {
  var elem = document.createElement(type)
  classes.split(' ').forEach(c => elem.classList.add(c))
  elem.innerHTML = innerHTML
  return elem
}
