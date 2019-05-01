Turbolinks.Controller = class Controller {
  constructor() {
    this.location = Turbolinks.Location.box(window.location)
    this.history = new Turbolinks.History(this)
    this.view = new Turbolinks.View(this)
    this.cache = new Turbolinks.Cache(10)
    this.scrollManager = new Turbolinks.ScrollManager(this)
    this.restorationData = {}
  }

  start() {
    if (!this.started) {
      addEventListener("click", this.clickCaptured, true)
      addEventListener("DOMContentLoaded", this.pageLoaded, false)
      this.history.start()
      this.scrollManager.start()
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      removeEventListener("click", this.clickCaptured, true)
      removeEventListener("DOMContentLoaded", this.pageLoaded, false)
      this.history.stop()
      this.scrollManager.stop()
      this.started = false
    }
  }

  visit(location, options = {}) {
    const turbo_location = Turbolinks.Location.box(location)
    if (this.applicationAllowsVisitingLocation(turbo_location)) {
      const action = options.action ? options.action : "advance"
      this.adapter.visitProposedToLocationWithAction(location, action)
    }
  }

  pushHistory(location) {
    this.location = Turbolinks.Location.box(location)
    this.history.push(this.location)
  }

  replaceHistory(location) {
    this.location = Turbolinks.Location.box(location)
    this.thistory.replace(this.location)
  }

  loadResponse(response) {
    this.view.loadSnapshotHTML(response)
    this.notifyApplicationAfterResponseLoad()
  }

  loadErrorResponse(response) {
    this.view.loadDocumentHTML(response)
    this.controller.stop()
  }

  startVisitToLocationWithAction(location, action) {
    this.startVisit(location, action)
  }

  // Page snapshots

  hasSnapshotForLocation(location) {
    return this.cache.has(location)
  }

  saveSnapshot() {
    this.notifyApplicationBeforeSnapshotSave()
    const snapshot = this.view.saveSnapshot()
    this.cache.put(this.lastRenderedLocation, snapshot)
  }

  restoreSnapshotForLocation(location) {
    const snapshot = this.cache.get(location)

    if (snapshot) {
      this.view.loadSnapshot(snapshot)
      this.notifyApplicationAfterSnapshotLoad()
      return true
    }
  }

  // Scrolling

  scrollToAnchor(anchor) {
    const element = document.getElementById(anchor)
    if (element) {
      this.scrollToElement(element)
    } else {
      scrollToPosition({ x: 0, y: 0 })
    }
  }

  scrollToElement(element) {
    this.scrollManager.scrollToElement(element)
  }

  scrollToPosition(position) {
    this.scrollManager.scrollToPosition(position)
  }

  // Scroll Manager delegate

  scrollPositionChanged(scrollPosition) {
    const restorationData = this.getCurrentResturationData()
    restorationData.scrollPosition = scrollPosition
  }

  // View delegate

  viewInvalidated() {
    this.adapter.pageInvalidated()
  }

  viewRendered() {
    this.lastRenderedLocation = this.currentVisit.location
  }

  // History delegate

  historyPoppedToLocationWithRestaurationIdentifier(location, restorationIdentifier) {
    this.startVisit(location, "restore", restorationIdentifier)
    this.location = location
  }

  // Event handlers

  pageLoaded = () => {
    this.lastRenderedLocation = this.location
    this.notifyApplicationAfterPageLoad()
  }

  clickCaptured = () => {
    removeEventListener("click", this.clickBubbled, false)
    addEventListener("click", this.clickBubbled, false)
  }

  clickBubbled = (event) => {
    if (this.clickEventIsSignificant(event)) {
      const link = this.getVisitableLinkForNode(event.target)
      if (link) {
        const location = this.getVisitableLocationForLink(link)
        if (location && this.applicationAllowsFollowingLinkToLocation(link, location)) {
          event.preventDefault()
          const action = this.getActionForLink(link)
          this.visit(location, { action })
        }
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

  startVisit(location, action, historyChanged, restorationIdentifier) {
    if (this.currentVisit) {
      this.currentVisit.cancel()
    }
    this.currentVisit = this.createVisit(location, action, historyChanged)
    this.currentVisit.restorationData = this.getRestaurationDataForIdentifier(restorationIdentifier)
    this.currentVisit.start()
  }

  createVisit(location, action, historyChanged) {
    const visit = new Turbolinks.Visit(this, location, action, historyChanged)
    visit.then(this.visitFinished)
    return visit
  }

  visitFinished = () => {
    this.notifyApplicationAfterPageLoad()
  }

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

  getActionForLink(link) {
    if (link.getAttribute("data-turbolinks-action")) {
      return link.getAttribute("data-turbolinks-action")
    } else {
      return "advance"
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

  getCurrentResturationData() {
    return this.getRestaurationDataForIdentifier(this.history.restorationIdentifier)
  }

  getRestaurationDataForIdentifier(identifier) {
    if (this.restorationData && this.restorationData[identifier]) {
      return this.restorationData[identifier]
    } else {
      return {}
    }
  }
}

Turbolinks.controller = new Turbolinks.Controller(Turbolinks.BrowserAdapter)
Turbolinks.controller.adapter = new Turbolinks.BrowserAdapter(Turbolinks.controller)
Turbolinks.controller.start()
