Turbolinks.closest = (element, selector) => {
  return closest().call(element, selector)
}

const closest = () => {
  html = document.documentElement

  if (html.closest) {
    return html.closest != null ? html.closest : (selector) => {
      node = this
      while (node) {
        if (node && node.nodeType === Node.ELEMENT_NODE && match().call(node, selector)) {
          return node
        } else {
          node = node.parentNode
        }
      }
    }
  }
}

Turbolinks.match = (element, selector) => {
  return match().call(element, selector)
}

const match = () => {
  html = document.documentElement
  return html.matchesSelector ||
         html.webkitMatchesSelector ||
         html.msMatchesSelector ||
         html.mozMatchesSelector
}

Turbolinks.dispatch = (eventName, { target, cancelable, data } = {}) => {
  event = document.createEvent("Events")
  event.initEvent(eventName, true, cancelable === true)
  event.data = data
  if (target) {
    target.dispatchEvent(event)
  } else {
    document.dispatchEvent(event)
  }

  return event
}
