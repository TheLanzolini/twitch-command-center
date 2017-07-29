export default (elem) => {
  if(elem.childNodes.length == 0) return
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}
