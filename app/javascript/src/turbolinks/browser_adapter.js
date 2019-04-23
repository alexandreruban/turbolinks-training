Turbolinks.BrowserAdapter = class BrowserAdapter {
  constructor(controller) {
    this.controller = controller
  }

  visitLocation(location) {
    this.controller.pushHistory(location)
  }

  locationChangedByActor(location, actor) {
    this.controller.restoreSnapshotByScrollingToSavedPosition(actor === "history")
    this.issueRequestForLocation(location)
  }

  snapshotRestored() {

  }

  // Private

  issueRequestForLocation(location) {
    if (this.xhr) { this.xhr.abort() }
    this.xhr = new XMLHttpRequest
    this.xhr.open("GET", location.requestURL, true)
    this.xhr.setRequestHeader("Accept", "text/html, application/xhtml/xml, application/xml")
    this.xhr.onload = this.requestLoaded
    this.xhr.onerror = this.requestFailed
    this.xhr.send()
  }

  requestLoaded = () => {
    this.controller.loadResponse(this.xhr.responseText)
    this.xhr = null
  }

  requestFailed = () => {
    this.xhr = null
  }
}
