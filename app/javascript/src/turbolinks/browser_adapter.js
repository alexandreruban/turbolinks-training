Turbolinks.BrowserAdapter = class BrowserAdapter {
  constructor(controller) {
    this.progressBar = new Turbolinks.ProgressBar
    this.controller = controller
  }

  visitLocation(location) {
    this.controller.pushHistory(location)
  }

  locationChangedByActor(location, actor) {
    this.controller.restoreSnapshotByScrollingToSavedPosition(actor === "history")
    this.controller.issueRequestForLocation(location)
  }

  requestStarted() {
    this.progressBar.show()
  }

  requestProgressed(progress) {
    this.progressBar.setValue(progress)
  }

  requestCompletedWithResponse(response) {
    this.controller.loadResponse(response)
  }

  requestFailedWithStatusCode(statusCode, response) {
    console.error("FAILED REQUEST:", statusCode)
  }

  requestFinished() {
    this.progressBar.hide()
  }

  pageInvalidated() {
    window.location.reload()
  }
}
