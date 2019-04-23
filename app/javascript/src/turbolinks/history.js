Turbolinks.History = class History {
  constructor(delegate) {
    this.delegate = delegate
    this.state = { turbolinks: true }
  }

  start() {
    if (!this.started) {
      addEventListener("popstate", this.onPopState, false)
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      removeEventListener("popstate", this.onPopState, false)
      this.started = false
    }
  }

  push(location) {
    if (!this.initialized) {
      this.update("replace", null)
      this.initialized = true
    }

    this.update("push", location)
    this.delegate.locationChangedByActor(location, "application")
  }

  replace(location) {
    this.update("replace", location)
    this.delegate.locationChangedByActor(location, "application")
  }

  // Event handlers

  onPopState = () => {
    if (event.state && event.state.turbolinks) {
      const location = window.location.toString()
      this.delegate.locationChangedByActor(location, "history")
    }
  }

  // Private

  update(method, location) {
    history[method + "State"](this.state, null, location)
  }
}
