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

  requestCompletedWithResponse(response) {
    this.controller.loadResponse(response)
  }

  requestFailedWithStatusCode(statusCode, response) {
    console.error("FAILED REQUEST:", statusCode)
  }
}
