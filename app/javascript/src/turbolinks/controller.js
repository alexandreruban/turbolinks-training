Turbolinks.Controller = class Controller {
  constructor() {
    this.history = new Turbolinks.History(this)
    this.view = new Turbolinks.View(this)
    this.cache = new Turbolinks.Cache(this)
    this.location = Turbolinks.Location.box(window.location)
  }

  start() {
    if (!this.started) {
      addEventListener("click", this.clickCaptured, true)
      addEventListener("DOMContentLoaded", this.pageLoaded, false)
      this.history.start()
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      removeEventListener("click", this.clickCaptured, true)
      removeEventListener("DOMContentLoaded", this.pageLoaded, false)
      this.history.stop()
      this.started = false
    }
  }

  visit(location) {
    const turbo_location = Turbolinks.Location.box(location)
    this.adapter.visitLocation(turbo_location)
  }

  pushHistory(location) {
    const turbo_location = Turbolinks.Location.box(location)
    this.history.push(turbo_location)
  }

  replaceHistory(location) {
    const turbo_location = Turbolinks.Location.box(location)
    this.thistory.replace(turbo_location)
  }

  loadResponse(response) {
    this.view.loadHTML(response)
    this.notifyApplicationOfPageChange()
  }

  // Current request

  issueRequestForLocation(location) {
    if (this.xhr) { this.xhr.abort() }
    this.xhr = new XMLHttpRequest
    this.xhr.open("GET", location.requestURL, true)
    this.xhr.setRequestHeader("Accept", "text/html, application/xhtml/xml, application/xml")
    this.xhr.onloadend = this.requestLoaded
    this.xhr.onerror = this.requestFailed
    this.xhr.onabort = this.requestAborted
    this.xhr.send()
  }

  abortCurrentRequest() {
    if (this.xhr) { this.xhr.abort }
  }

  requestLoaded = () => {
    if (this.xhr.status >= 200 && this.xhr.status < 300) {
      this.adapter.requestCompletedWithResponse(this.xhr.responseText)
    } else {
      this.adapter.requestFailedWithStatusCode(this.xhr.status, this.xhr.responseText)
    }
    this.xhr = null
  }

  requestFailed = () => {
    this.adapter.requestFailedWithStatusCode(null)
    this.xhr = null
  }

  requestAborted = () => {
    this.xhr = null
  }

  // Page snapshots

  saveSnapshot() {
    const snapshot = this.view.saveSnapshot()
    this.cache.put(this.location, snapshot)
  }

  hasSnapshotForLocation(location) {
    const turbo_location = Turbolinks.Location.box(location)
    if (this.cache.get(turbo_location)) {
      return true
    } else {
      return false
    }
  }

  restoreSnapshotByScrollingToSavedPosition(scrollToSavedPosition) {
    const snapshot = this.cache.get(this.location)

    if (snapshot) {
      this.view.loadSnapshotByScrollingToSavedPosition(snapshot, scrollToSavedPosition)
      this.notifyApplicationOfSnapshotRestoration()
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

  pageLoaded = () => {
    this.notifyApplicationOfPageChange()
  }

  clickCaptured = () => {
    removeEventListener("click", this.clickBubbled, false)
    addEventListener("click", this.clickBubbled, false)
  }

  clickBubbled = (event) => {
    const location = this.getVisitableLocationForEvent(event)

    if (!event.defaultPrevented && location) {
      if (this.applicationAllowsChangingToLocation(location)) {
        event.preventDefault()
        this.visit(location)
      }
    }
  }

  // Events

  applicationAllowsChangingToLocation(location) {
    return this.triggerEvent(
      "page:before-change", { data: { url: location.absoluteURL }, cancelable: true }
    )
  }

  notifyApplicationOfSnapshotRestoration() {
    this.triggerEvent("page:restore")
  }

  notifyApplicationOfPageChange() {
    this.triggerEvent("page:change")
    this.triggerEvent("page:update")
  }

  // Private

  triggerEvent(eventName, { cancelable, data } = {}) {
    const event = document.createEvent("Events")
    event.initEvent(eventName, true, cancelable === true) // Second argument is bubbles?
    event.data = data
    document.dispatchEvent(event)
    return !event.defaultPrevented
  }

  getVisitableLocationForEvent(event) {
    const link = Turbolinks.closest(event.target, "a[href]")

    if (link) {
      const turbo_location = new Turbolinks.Location(link.href)

      if (turbo_location.isSameOrigin()) {
        return turbo_location
      }
    }
  }
}

Turbolinks.controller = new Turbolinks.Controller(Turbolinks.BrowserAdapter)
Turbolinks.controller.adapter = new Turbolinks.BrowserAdapter(Turbolinks.controller)
Turbolinks.controller.start()
