Turbolinks.History = class History {
  constructor(delegate) {
    this.delegate = delegate
    this.state = { turbolinks: true }
  }

  push(location) {
    if (!this.initialized) {
      this.update("replace", null)
      this.initialized = true
    }

    this.update("push", location)
    this.delegate.historyChanged(location)
  }

  replace(location) {
    this.update("replace", location)
    this.delegate.historyChanged(location)
  }

  // Private

  update(method, location) {
    history[method + "State"](this.state, null, location)
  }
}
