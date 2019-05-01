Turbolinks.Visit = class Visit {
  constructor(controller, previousLocation, location, action, historyChanged) {
    this.controller = controller
    this.previousLocation = Turbolinks.Location.box(previousLocation)
    this.location = Turbolinks.Location.box(location)
    this.action = action
    this.historyChanged = historyChanged
    this.adapter = this.controller.adapter
  }

  start() {
    if (!this.started) {
      return this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
        this.started = true
        this.adapter.visitStarted(this)
      })
    }
  }

  cancel() {
    if (this.started && !this.canceled) {
      if (this.request) {
        this.request.cancel()
      }
      this.canceled = true
    }
  }

  changeHistory(method = "pushHistory") {
    if (!this.historyChanged) {
      this.controller[method](this.location)
      this.historyChanged = true
    }
  }

  issueRequest() {
    if (this.shouldIssueRequest() && !this.request) {
      this.progress = 0
      this.request = new Turbolinks.HttpRequest(this, this.location)
      this.request.send()
    }
  }

  restoreSnapshot() {
    if (!this.snapshotRestored) {
      this.saveSnapshot()
      this.snapshotRestored = this.controller.restoreSnapshotForLocationWithAction(this.location, this.action)
      if (!this.shouldIssueRequest()) {
        this.resolve()
      }
    }
  }

  loadResponse() {
    if (this.response) {
      this.saveSnapshot()
      if (this.request.failed) {
        this.controller.loadErrorResponse(this.response)
        this.reject()
      } else {
        this.controller.loadResponse(this.response)
        this.resolve()
      }
    }
  }

  // HTTP Request delegate

  requestStarted() {
    this.adapter.visitRequestStarted(this)
  }

  requestProgressed(progress) {
    this.progress = progress
    this.adapter.visitRequestProgressed(this)
  }

  requestCompletedWithResponse(response) {
    this.response = response
    this.adapter.visitRequestCompleted(this)
  }

  requestFailedWithStatusCode(statusCode, response) {
    this.response = response
    this.adapter.visitRequestFailedWithStatusCode(this, statusCode)
  }

  requestFinished() {
    this.adapter.visitRequestFinished(this)
  }

  // Private

  shouldIssueRequest() {
    return (this.action === "advance" || !this.hasSnapshot())
  }

  hasSnapshot() {
    return this.controller.hasSnapshotForLocation(this.location)
  }

  saveSnapshot() {
    if (!this.snapshotSaved) {
      this.controller.saveSnapshotForLocation(this.previousLocation)
      this.snapshotSaved = true
    }
  }
}
