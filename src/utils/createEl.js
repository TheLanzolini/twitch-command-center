export default (name, type = 'div', innerHTML = null) => {
  var elem = document.createElement(type);
  elem.classList.add(name);
  elem.innerHTML = innerHTML;
  return elem;
}
