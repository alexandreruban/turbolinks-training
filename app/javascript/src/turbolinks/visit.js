Turbolinks.Visit = class Visit {
  constructor(controller, location, action, historyChanged) {
    this.controller = controller
    this.location = Turbolinks.Location.box(location)
    this.action = action
    this.historyChanged = historyChanged
    this.adapter = this.controller.adapter
  }

  start() {
    if (!this.started) {
      this.started = true
      this.adapter.visitStarted(this)
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
      this.snapshotRestored = this.controller.restoreSnapshotForVisit(this)
    }
  }

  loadResponse() {
    if (this.response) {
      if (this.request.failed) {
        this.controller.loadErrorResponse(this.response)
      } else {
        this.controller.loadResponse(this.response)
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
}
