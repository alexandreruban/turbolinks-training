Turbolinks.View = class View{
  constructor(delegate) {
    this.delegate = delegate
  }

  loadHTML(html) {
    this.loadSnapshotByScrollingToSavedPosition(this.parseHTML(html), "anchor")
  }

  loadSnapshotByScrollingToSavedPosition(snapshot, scrollToSavedPosition) {
    document.title = snapshot.title
    document.body  = snapshot.body
    this.scrollToSavedPositionWithOffsets(scrollToSavedPosition, snapshot.offsets)
  }

  saveSnapshot() {
    return {
      body: document.body.cloneNode(true),
      title: document.title,
      offsets: {
        left: window.pageXOffset,
        top: window.pageYOffset
      }
    }
  }

  // Private

  scrollToSavedPositionWithOffsets(scrollToSavedPosition, snapshotOffsets) {
    const location = window.location.toString()

    if (scrollToSavedPosition && snapshotOffsets) {
      const xOffset = snapshotOffsets.left || 0
      const yOffset = snapshotOffsets.top  || 0
      scrollTo(xOffset, yOffset)
    } else if (window.location.hash != "" && document.querySelector(window.location.hash)) {
      document.querySelector(window.location.hash).scrollIntoView()
    } else {
      scrollTo(0, 0)
    }

    this.lastScrolledLocation = location
  }

  parseHTML(html) {
    element = document.createElement("html")
    element.innerHTML = html
    return {
      title: element.querySelector("title"),
      body: element.querySelector("body")
    }
  }
}
