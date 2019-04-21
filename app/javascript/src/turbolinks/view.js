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

    if (snapshot.offsets && snapshot.offsets.left) {
      window.pageXOffset = snapshot.offsets.left
    } else {
      window.pageXOffset = 0
    }

    if (snapshot.offsets && snapshot.offsets.top) {
      window.pageXOffset = snapshot.offsets.top
    } else {
      window.pageYOffset = 0
    }
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
