Turbolinks.BrowserAdapter = class BrowserAdapter {
  static PROGRESS_BAR_DELAY = 500;

  constructor() {
    this.progressBar = new Turbolinks.ProgressBar
  }

  visitProposed(visit) {
    visit.start()
  }

  visitStarted(visit) {
    visit.changeHistory()
    visit.issueRequest()
    visit.restoreSnapshot()
  }

  visitRequestStarted(visit) {
    if (!visit.snapshotRestored) {
      this.showProgressBarAfterDelay()
    }
    this.progressBar.setValue(0)
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
