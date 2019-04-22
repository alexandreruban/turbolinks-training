Turbolinks.View = class View{
  constructor(delegate) {
    this.delegate = delegate
  }

  loadHTML(html) {
    this.loadSnapshotWithScrollPosition(this.parseHTML(html), "anchored")
  }

  loadSnapshotWithScrollPosition(snapshot, scrollPosition) {
    document.title = snapshot.title
    document.body  = snapshot.body

    if (scrollPosition === "restored" && snapshot && snapshot.offsets) {
      const xOffset = snapshot.offsets.left
      const yOffset = snapshot.offsets.top
      scrollTo(xOffset, yOffset)
    } else if (window.location.hash != "" && document.querySelector(window.location.hash)) {
      document.querySelector(window.location.hash).scrollIntoView()
    } else {
      scrollTo(0, 0)
    }

    scroll(xOffset, yOffset)
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

  parseHTML(html) {
    element = document.createElement("html")
    element.innerHTML = html
    return {
      title: element.querySelector("title"),
      body: element.querySelector("body")
    }
  }
}
