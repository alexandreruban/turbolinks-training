Turbolinks.ElementSet = class ElementSet {
  constructor(elements) {
    this.elements = [].filter.call(elements, (element) => {
      return element.nodeType === Node.ELEMENT_NODE
    }).map(element => {
      return { element: element, value: element.outerHTML  }
    })
  }

  selectElementsMatchingSelector(selector) {
    const elements = this.elements.filter((element) => {
      if (Turbolinks.match(element.element, selector)) {
        return true
      } else {
        return false
      }
    }).map(({ element, value }) => element)

    return new this.constructor(elements)
  }

  getElementsNotPresentInSet(elementSet) {
    const index = elementSet.getElementIndex()
    const elements = this.elements.filter(({ element, value }) => {
      return !Object.keys(index).includes(value)
    }).map(({ element, value }) => element)

    return new this.constructor(elements)
  }

  getElements() {
    return this.elements.map(({ element, value }) => element)
  }

  getValues() {
    return this.elements.map(({ element, value }) => value)
  }

  isEqualTo(elementSet) {
    if (elementSet) {
      return this.toString() === elementSet.toString()
    }
  }

  toString() {
    this.getValues().join("")
  }

  // Private

  getElementIndex() {
    const elementIndex = {}
    this.elements.forEach(({ element, value }) => {
      elementIndex[value] = element
    })
    this.elementIndex = elementIndex
    return elementIndex
  }
}
