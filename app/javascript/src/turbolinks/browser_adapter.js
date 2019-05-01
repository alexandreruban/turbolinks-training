Turbolinks.BrowserAdapter = class BrowserAdapter {
  static PROGRESS_BAR_DELAY = 500;

  constructor(controller) {
    this.controller = controller
    this.progressBar = new Turbolinks.ProgressBar
  }

  visitProposedToLocationWithAction(location, action) {
    this.controller.startVisitToLocationWithAction(location, action)
  }

  visitStarted(visit) {
    visit.changeHistory()
    visit.issueRequest()
    visit.restoreSnapshot()
  }

  visitRequestStarted(visit) {
    this.progressBar.setValue(0)
    if (!visit.snapshotRestored) {
      if (visit.hasSnapshot() || visit.action != "restore") {
        this.showProgressBarAfterDelay()
      } else {
        this.showProgressBar()
      }
    }
  }

  visitRequestProgressed(visit) {
    this.progressBar.setValue(visit.progress)
  }

  visitRequestCompleted(visit) {
    visit.loadResponse()
  }

  visitRequestFailedWithStatusCode(visit, statusCode) {
    visit.loadResponse()
  }

  visitRequestFinished(visit) {
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
