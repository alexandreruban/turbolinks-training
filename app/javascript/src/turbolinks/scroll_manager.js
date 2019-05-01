Turbolinks.ScrollManager = class ScrollManager {
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

  scrollToPosition(x, y) {
    window.scrollTo(x, y)
  }

  onScroll = (event) => {

  }
}
