Turbolinks.ElementPool = class ElementPool {
  constructor(elements = []) {
    this.elements = {}
    elements.forEach((element) => this.storeElement(element))
  }

  storeElement(element) {
    const key = this.getKeyForElement(element)
    const elements = this.getElementsForKey(key)
    if (!Array.from(elements).includes(element)) {
      return elements.push(element)
    }
  }

  retrieveMatchingElement(element) {
    const key = this.getKeyForElement(element)
    const elements = this.getElementsForKey(key)
    return elements.shift()
  }

  // Private

  getKeyForElement(element) {
    return element.outerHTML
  }

  getElementsForKey(key) {
    if (this.elements[key] === undefined) {
      return this.elements[key] = []
    } else {
      return this.elements[key]
    }
  }
}
