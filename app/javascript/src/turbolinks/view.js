Turbolinks.View = class View{
  constructor(delegate) {
    this.delegate = delegate
  }

  loadHTML(html) {
    const { title, body } = this.parseHTML(html)
    this.loadTitle(title)
    this.loadBody(body)
  }

  // Private

  loadTitle(newTitleElement) {
    if (newTitleElement) {
      document.title = newTitleElement.innerText
    }
  }

  loadBody(newBodyElement) {
    document.body = newBodyElement
  }

  parseHTML(html) {
    element = document.createElement("html")
    element.innerHTML = html
    return {
      title: element.querySelector("title"),
      body: element.querySelector("body")
    }
  }

  removeElement(element) {
    element && element.parentNode && element.parentNode.removeChild(element)
  }
}
