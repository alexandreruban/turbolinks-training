Turbolinks.ScrollManager = class ScrollManager {
  constructor(delegate) {
    this.delegate = delegate
  }

  start() {
    if (!this.started) {
      addEventListener("scroll", this.onScroll, false)
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      removeEventListener("scroll", this.onScroll, false)
      this.started = false
    }
  }

  scrollToElement(element) {
    element.scrollIntoView()
  }

  scrollToPosition({ x, y }) {
    window.scrollTo(x, y)
  }

  onScroll = (event) => {
    this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset })
  }

  // Private

  updatePosition(position) {
    this.position = position
    this.delegate.scrollPositionChanged(this.position)
  }
}
