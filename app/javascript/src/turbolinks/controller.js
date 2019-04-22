Turbolinks.Controller = class Controller {
  constructor() {
    this.history = new Turbolinks.History(this)
    this.view = new Turbolinks.View(this)
    this.cache = new Turbolinks.Cache(this)
    this.location = window.location.toString()
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

  visit(location) {
    this.adapter.visitLocation(location)
  }

  pushHistory(location) {
    this.history.push(location)
  }

  replaceHistory(location) {
    this.thistory.replace(location)
  }

  loadResponse(response) {
    console.log(`loading response for ${this.location}`)
    this.view.loadHTML(response)
  }

  // Page snapshots

  saveSnapshot() {
    console.log(`saving snapshot for ${this.url}`)
    const snapshot = this.view.saveSnapshot()
    this.cache.put(this.location, snapshot)
  }

  restoreSnapshotWithScrollPosition(scrollPosition) {
    const snapshot = this.cache.get(this.url)

    if (snapshot) {
      console.log(`restoring snapshot for ${this.url}`)
      this.view.loadSnapshotWithScrollPosition(snapshot, scrollPosition)
      return true
    }
  }

  // History delegate

  historyChanged(location) {
    this.locationChanged(location)
  }

  // Event handlers

  historyPopped = (event) => {
    if (event.state && event.state.turbolinks) {
      this.locationChanged(window.location.toString())
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

  locationChanged(location) {
    this.saveSnapshot()
    this.location = location
    this.adapter.locationChanged(location)
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
Turbolinks.controller.adapter = new Turbolinks.BrowserAdapter(Turbolinks.controller)
Turbolinks.controller.start()
