Turbolinks.BrowserAdapter = class BrowserAdapter {
  static PROGRESS_BAR_DELAY = 500

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
    this.showProgressBarAfterDelay()
    this.progressBar.setValue(0)
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
    this.hideProgressBar()
  }

  pageInvalidated() {
    window.location.reload()
  }

  // Private

  showProgressBarAfterDelay() {
    this.progressBarTimeout = setTimeout(
      this.showProgressBar,
      this.constructor.PROGRESS_BAR_DELAY
    )
  }

  showProgressBar = () => {
    this.progressBar.show()
  }

  hideProgressBar() {
    this.progressBar.hide()
    clearTimeout(this.progressBarTimeout)
  }
}
