Turbolinks.Visit = class Visit {
  static ID_PREFIX = new Date().getTime();
  static id = 0;

  constructor(controller, previousLocation, location, action, historyChanged) {
    this.identifier = `${this.constructor.ID_PREFIX}:${this.constructor.id++}`
    this.controller = controller
    this.action = action
    this.historyChanged = historyChanged
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      this.previousLocation = Turbolinks.Location.box(previousLocation)
      this.location = Turbolinks.Location.box(location)
      this.adapter = this.controller.adapter
      this.state = "initialized"
    })
  }

  start() {
    if (this.state === "initialized") {
      this.state = "started"
      this.adapter.visitStarted(this)
    }
  }

  cancel() {
    if (this.state === "started") {
      if (this.request) {
        this.request.cancel()
      }
      this.state = "canceled"
    }
  }

  complete() {
    if (this.state === "started") {
      this.state = "completed"
      if (typeof this.adapter.visitCompleted === "function") {
        this.adapter.visitCompleted(this)
      }
      this.resolve()
    }
  }

  fail() {
    if (this.state === "started") {
      this.state = "failed"
      if (typeof this.adapter.visitFailed === "function") {
        this.adapter.visitFailed(this)
      }
      this.reject()
    }
  }

  then() {
    this.promise.then(...arguments)
  }

  catch() {
    this.promise.catch(...arguments)
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
    if (this.hasSnapshot() && !this.snapshotRestored) {
      this.saveSnapshot()
      this.snapshotRestored = this.controller.restoreSnapshotForLocationWithAction(this.location, this.action)
      if (this.snapshotRestored) {
        if (typeof this.adapter.visitSnapshotRestored === "function") {
          this.adapter.visitSnapshotRestored(this)
        }
      }

      if (!this.shouldIssueRequest()) {
        this.complete()
      }
    }
  }

  loadResponse() {
    if (this.response) {
      this.saveSnapshot()
      if (this.request.failed) {
        this.controller.loadErrorResponse(this.response)
        if (typeof this.adapter.visitResponseLoaded === "function") {
          this.adapter.visitResponseLoaded(this)
        }
        this.fail()
      } else {
        this.controller.loadResponse(this.response)
        if (typeof this.adapter.visitResponseLoaded === "function") {
          this.adapter.visitResponseLoaded(this)
        }
        this.complete()
      }
    }
  }

  // HTTP Request delegate

  requestStarted() {
    this.adapter.visitRequestStarted(this)
  }

  requestProgressed(progress) {
    this.progress = progress
    if (typeof this.adapter.visitRequestProgressed === "function") {
      this.adapter.visitRequestProgressed(this)
    }
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
