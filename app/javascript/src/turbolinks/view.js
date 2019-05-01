Turbolinks.View = class View{
  constructor(delegate) {
    this.delegate = delegate
  }

  loadDocumentHTML(html) {
    document.documentElement.innerHTML = html
    activateScripts()
  }

  loadSnapshotHTML(html) {
    const snapshot = Turbolinks.Snapshot.fromHTML(html)
    this.loadSnapshot(snapshot)
  }

  loadSnapshot(snapshot) {
    this.renderSnapshot(snapshot)
  }

  saveSnapshot() {
    return this.getSnapshot(true)
  }

  // Private

  renderSnapshot(newSnapshot) {
    const currentSnapshot = this.getSnapshot(false)
    if (!currentSnapshot.hasSameTrackedHeadElementsAsSnapshot(newSnapshot)) {
      this.delegate.viewInvalidated()
      return false
    }

    newSnapshot.getInlineHeadElementsNotPresentInSnapshot(currentSnapshot).forEach((element) => {
      document.head.appendChild(element.cloneNode(true))
    })

    currentSnapshot.getTemporaryHeadElements().forEach((element) => {
      document.head.removeChild(element)
    })

    newSnapshot.getTemporaryHeadElements().forEach((element) => {
      document.head.appendChild(element.cloneNode(true))
    })

    const newBody = newSnapshot.body.cloneNode(true)
    this.importPermanentElementsIntoBody(newBody)
    this.importRecyclableElementsIntoBody(newBody)
    document.body = newBody

    this.delegate.viewRendered()
    return newSnapshot
  }

  getSnapshot = (clone) => {
    return new Turbolinks.Snapshot({
      head: this.maybeCloneElement(document.head, clone),
      body: this.maybeCloneElement(document.body, clone)
    })
  }

  importPermanentElementsIntoBody = (newBody) => {
    this.getPermanentElements(document.body).forEach((newChild) => {
      const oldChild = newBody.querySelector(`[id=${newChild.id}]`)
      if (oldChild) {
        oldChild.parentNode.replaceChild(newChild, oldChild)
      }
    })
  }

  importRecyclableElementsIntoBody = (newBody) => {
    const elementPool = new Turbolinks.ElementPool(this.getRecyclableElements(document.body))
    this.getRecyclableElements(newBody).forEach((oldChild) => {
      const newChild = elementPool.retrieveMatchingElement(oldChild)
      if (newChild) {
        oldChild.parentNode.replaceChild(newChild, oldChild)
      }
    })
  }

  getPermanentElements = (element) => {
    return element.querySelectorAll("[id][data-turbolinks-permanent]")
  }

  getRecyclableElements = (element) => {
    return element.querySelectorAll("[data-turbolinks-recyclable]")
  }

  maybeCloneElement = (element, clone) => {
    if (clone) {
      return element.cloneNode(true)
    } else {
      return element
    }
  }

  activeScripts = () => {
    document.querySelectorAll("script").forEach((oldChild) => {
      const newChild = this.cloneScript(oldChild)
      oldChild.parentNode.replaceChild(newChild, oldChild)
    })
  }

  cloneScript = (script) => {
    const element = document.createElement("script")
    if (script.hasAttribute("src")) {
      element.src = script.getAttribute("src")
    } else {
      element.textContent = script.textContent
    }

    return element
  }
}
