Turbolinks.History = class History {
  constructor(delegate) {
    this.delegate = delegate
    this.state = { turbolinks: true }
  }

  push(url) {
    if (!this.initialized) {
      this.update("replace", null)
      this.initialized = true
    }

    this.update("push", url)
    this.delegate.historyChanged(url)
  }

  replace(url) {
    this.update("replace", url)
    this.delegate.historyChanged(url)
  }

  // Private

  update(method, url) {
    history[method + "State"](this.state, null, url)
  }
}
