Turbolinks.Controller = class Controller {
  constructor() {
    this.history = new Turbolinks.History(this)
    this.view = new Turbolinks.View(this)
    this.cache = new Turbolinks.Cache(10)
    this.location = Turbolinks.Location.box(window.location)
    this.responseLoaded = true
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
    if (this.applicationAllowsVisitingLocation(turbo_location)) {
      this.adapter.visitLocation(turbo_location)
    }
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
    this.responseLoaded = true
    this.notifyApplicationAfterResponseLoad()
    this.notifyApplicationAfterPageLoad()
  }

  // Current request

  issueRequestForLocation(location) {
    this.abortCurrentRequest()
    this.request = new Turbolinks.HttpRequest(this.adapter, this.location)
    this.request.send()
  }

  abortCurrentRequest() {
    if (this.request) { this.request.abort() }
  }

  // Page snapshots

  saveSnapshot() {
    if (this.responseLoaded) {
      this.notifyApplicationBeforeSnapshotSave()
      const snapshot = this.view.saveSnapshot()
      this.cache.put(this.location, snapshot)
    }
  }

  hasSnapshotForLocation(location) {
    return this.cache.has(location)
  }

  restoreSnapshotByScrollingToSavedPosition(scrollToSavedPosition) {
    const snapshot = this.cache.get(this.location)

    if (snapshot) {
      this.view.loadSnapshotByScrollingToSavedPosition(snapshot, scrollToSavedPosition)
      this.notifyApplicationAfterSnapshotLoad()
      return true
    }
  }

  // View delegate

  viewInvalidated() {
    this.adapter.pageInvalidated()
  }

  // History delegate

  locationChangedByActor(location, actor) {
    this.saveSnapshot()
    this.responseLoaded = false
    this.location = location
    this.adapter.locationChangedByActor(location, actor)
  }

  // Event handlers

  pageLoaded = () => {
    this.notifyApplicationAfterPageLoad()
  }

  clickCaptured = () => {
    removeEventListener("click", this.clickBubbled, false)
    addEventListener("click", this.clickBubbled, false)
  }

  clickBubbled = (event) => {
    if (this.clickEventIsSignificant(event)) {
      const link = this.getVisitableLinkForNode(event.target)
      const location = this.getVisitableLocationForLink(link)
      if (location && this.applicationAllowsFollowingLinkToLocation(link, location)) {
        event.preventDefault()
        this.visit(location)
      }
    }
  }

  // Application events

  applicationAllowsFollowingLinkToLocation(link, location) {
    return this.dispatchEvent(
      "turbolinks:click", {
        target: link,
        data: { url: location.absoluteURL },
        cancelable: true
      }
    )
  }

  applicationAllowsVisitingLocation(location) {
    return this.dispatchEvent(
      "turbolinks:visit",
      { data: { url: location.absoluteURL }, cancelable: true }
    )
  }

  notifyApplicationBeforeSnapshotSave() {
    this.dispatchEvent("turbolinks:snapshot-save")
  }

  notifyApplicationAfterSnapshotLoad() {
    this.dispatchEvent("turbolinks:snapshot-load")
  }

  notifyApplicationAfterResponseLoad() {
    this.dispatchEvent("turbolinks:response-load")
  }

  notifyApplicationAfterPageLoad() {
    this.dispatchEvent("turbolinks:load")
  }

  // Private

  dispatchEvent() {
    event = Turbolinks.dispatch(...arguments)
    return !event.defaultPrevented
  }

  clickEventIsSignificant(event) {
    return !(
      event.defaultPrevented ||
      event.which > 1 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
  }

  getVisitableLinkForNode(node) {
    if(this.nodeIsVisitable(node)) {
      return Turbolinks.closest(node, "a[href]:not([target])")
    }
  }

  getVisitableLocationForLink(link) {
    const location = new Turbolinks.Location(link.href)
    if (location.isSameOrigin()) {
      return location
    }
  }

  nodeIsVisitable(node) {
    const container = Turbolinks.closest(node, "[data-turbolinks]")
    if (container) {
      return container.getAttribute("data-turbolinks") != "false"
    } else {
      return true
    }
  }
}

Turbolinks.controller = new Turbolinks.Controller(Turbolinks.BrowserAdapter)
Turbolinks.controller.adapter = new Turbolinks.BrowserAdapter(Turbolinks.controller)
Turbolinks.controller.start()
