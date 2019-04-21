Turbolinks.Controller = class Controller {
  constructor(adapterConstructor) {
    this.adapter = new adapterConstructor(this)
    this.history = new Turbolinks.History(this)
    this.view = new Turbolinks.View(this)
    this.cache = new Turbolinks.Cache(this)
    this.url = location.toString()
  }

  start() {
    if (!this.started) {
      addEventListener("popstate", this.historyPopped, false)
      addEventListener("click", this.clickCaptured, true)
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      removeEventListener("popstate", this.historyPopped, false)
      removeEventListener("click", this.clickCaptured, true)
      this.started = false
    }
  }

  visit(url) {
    this.adapter.visitLocation(url)
  }

  loadResponse(response) {
    console.log(`loading response for ${this.url}`)
    this.view.loadHTML(response)
  }

  // Adapter delegate

  adapterLoadedResponse(response) {
    return this.loadResponse(response)
  }

  getHistoryForAdapter(adapter) {
    return this.history
  }

  // History delegate

  historyChanged(url) {
    this.locationChanged(url)
  }

  // Event handlers

  historyPopped = (event) => {
    if (event.state && event.state.turbolinks) {
      this.locationChanged(location.toString())
    }
  }

  clickCaptured = () => {
    removeEventListener("click", this.clickBubbled, false)
    addEventListener("click", this.clickBubbled, false)
  }

  clickBubbled = (event) => {
    const url = this.getVisitableURLForEvent(event)

    if (!event.defaultPrevented && url) {
      event.preventDefault()
      this.visit(url)
    }
  }

  // Private

  saveSnapshot() {
    console.log(`saving snapshot for ${this.url}`)
    const snapshot = this.view.saveSnapshot()
    this.cache.put(this.url, snapshot)
  }

  restoreSnapshot() {
    const snapshot = this.cache.get(this.url)

    if (snapshot) {
      console.log(`restoring snapshot for ${this.url}`)
      this.view.loadSnapshot(snapshot)
      this.adapter.snapshotRestored()
    }
  }

  locationChanged(url) {
    this.saveSnapshot()
    this.url = url
    this.adapter.locationChanged(url)
    this.restoreSnapshot()
  }

  getVisitableURLForEvent(event) {
    const link = Turbolinks.closest(event.target, "a")

    if (link && link.href && this.isSameOrigin(link.href)) {
      return link.href
    }
  }

  isSameOrigin(url) {
    return url
  }
}

Turbolinks.controller = new Turbolinks.Controller(Turbolinks.BrowserAdapter)
Turbolinks.controller.start()
