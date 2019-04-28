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
    this.snapshotRestored = this.controller.restoreSnapshotByScrollingToSavedPosition(actor === "history")
    this.controller.issueRequestForLocation(location)
  }

  requestStarted() {
    if (!this.snapshotRestored) {
      this.showProgressBarAfterDelay()
    }
    this.progressBar.setValue(0)
  }

  requestProgressed(progress) {
    this.progressBar.setValue(progress)
  }

  requestCompletedWithResponse(response) {
    this.controller.loadResponse(response)
  }

  requestFailedWithStatusCode(statusCode, response) {
    this.controller.stop()
    // TODO: Move this into the view
    document.documentElement.innerHTML = response
    this.activeScripts()
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

  activeScripts = () => {
    document.querySelectorAll("script").forEach((oldChild) => {
      const newChild = this.cloneScript(oldChild)
      oldChild.parentNode.replaceChild(newChild, oldChild)
    })
  }

  cloneScript = (script) => {
    const element = document.createElement("script")
    if (script.hasAttribute("src")) {
      element.src = script.getAttribute("src")
    } else {
      element.textContent = script.textContent
    }

    return element
  }
}
