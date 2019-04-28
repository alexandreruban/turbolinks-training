Turbolinks.View = class View{
  constructor(delegate) {
    this.delegate = delegate
  }

  loadHTML(html) {
    const snapshot = Turbolinks.Snapshot.fromHTML(html)
    this.loadSnapshotByScrollingToSavedPosition(snapshot, "anchor", true)
  }

  loadSnapshotByScrollingToSavedPosition(snapshot, scrollToSavedPosition, fromHTML) {
    if (this.loadSnapshot(snapshot)) {
      this.scrollSnapshotToSavedPosition(snapshot, scrollToSavedPosition)
    }
  }

  saveSnapshot() {
    return this.getSnapshot(true)
  }

  // Private

  loadSnapshot(newSnapshot) {
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
    return newSnapshot
  }

  scrollSnapshotToSavedPosition(snapshot, scrollToSavedPosition) {
    const location = window.location.toString()

    scrollTo(0, 0)
    // if (scrollToSavedPosition && snapshotOffsets) {
    //   const xOffset = snapshotOffsets.left || 0
    //   const yOffset = snapshotOffsets.top  || 0
    //   scrollTo(xOffset, yOffset)
    // } else if (window.location.hash != "" && document.querySelector(window.location.hash)) {
    //   document.querySelector(window.location.hash).scrollIntoView()
    // } else {
    //   scrollTo(0, 0)
    // }

    this.lastScrolledLocation = location
  }

  getSnapshot = (clone) => {
    return new Turbolinks.Snapshot({
      head: this.maybeCloneElement(document.head, clone),
      body: this.maybeCloneElement(document.body, clone),
      scrollLeft: window.pageXOffset,
      scrollTop: window.pageYOffset,
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
}
