Turbolinks.Controller = class Controller {
  constructor() {
    this.history = new Turbolinks.History(this)
    this.view = new Turbolinks.View(this)
    this.cache = new Turbolinks.Cache(this)
    this.location = window.location.toString()
  }

  start() {
    if (!this.started) {
      addEventListener("click", this.clickCaptured, true)
      this.history.start()
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      removeEventListener("click", this.clickCaptured, true)
      this.history.stop()
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
    this.view.loadHTML(response)
  }

  // Page snapshots

  saveSnapshot() {
    const snapshot = this.view.saveSnapshot()
    this.cache.put(this.location, snapshot)
  }

  hasSnapshotForLocation(location) {
    if (this.cache.get(location)) {
      return true
    } else {
      return false
    }
  }

  restoreSnapshotByScrollingToSavedPosition(scrollToSavedPosition) {
    const snapshot = this.cache.get(this.location)

    if (snapshot) {
      this.view.loadSnapshotByScrollingToSavedPosition(snapshot, scrollToSavedPosition)
      return true
    }
  }

  // History delegate

  locationChangedByActor(location, actor) {
    this.saveSnapshot()
    this.location = location
    this.adapter.locationChangedByActor(location, actor)
  }

  // Event handlers

  clickCaptured = () => {
    removeEventListener("click", this.clickBubbled, false)
    addEventListener("click", this.clickBubbled, false)
  }

  clickBubbled = (event) => {
    const location = this.getVisitableLocationForEvent(event)

    if (!event.defaultPrevented && location) {
      event.preventDefault()
      this.visit(location)
    }
  }

  // Private

  getVisitableLocationForEvent(event) {
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
