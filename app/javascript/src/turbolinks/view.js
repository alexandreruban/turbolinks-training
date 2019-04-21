Turbolinks.View = class View{
  constructor(delegate) {
    this.delegate = delegate
  }

  loadHTML(html) {
    this.loadSnapshot(this.parseHTML(html))
  }

  loadSnapshot(snapshot) {
    document.title = snapshot.title
    document.body  = snapshot.body

    const xOffset =
      (snapshot.offsets && snapshot.offsets.left) ? snapshot.offsets.left : 0
    const yOffset =
      (snapshot.offsets && snapshot.offsets.top)  ? snapshot.offsets.top  : 0

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
