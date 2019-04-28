Turbolinks.BrowserAdapter = class BrowserAdapter {
  constructor(controller) {
    this.controller = controller
  }

  visitLocation(location) {
    this.controller.pushHistory(location)
  }

  locationChangedByActor(location, actor) {
    this.controller.restoreSnapshotByScrollingToSavedPosition(actor === "history")
    this.controller.issueRequestForLocation(location)
  }

  requestProgressed(progress) {
    console.log("request progressed", progress)
  }

  requestCompletedWithResponse(response) {
    this.controller.loadResponse(response)
  }

  requestFailedWithStatusCode(statusCode, response) {
    console.error("FAILED REQUEST:", statusCode)
  }

  pageInvalidated() {
    window.location.reload()
  }
}
