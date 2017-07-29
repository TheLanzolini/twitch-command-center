export default (name, type = 'div') => {
  var elem = document.createElement(type);
  elem.classList.add(name);
  return elem;
}
