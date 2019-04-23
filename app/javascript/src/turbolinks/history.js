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
    const turbo_location = Turbolinks.Location.box(location)

    if (!this.initialized) {
      this.update("replace", null)
      this.initialized = true
    }

    this.update("push", turbo_location)
    this.delegate.locationChangedByActor(turbo_location, "application")
  }

  replace(location) {
    const turbo_location = Turbolinks.Location.box(location)
    this.update("replace", turbo_location)
    this.delegate.locationChangedByActor(turbo_location, "application")
  }

  // Event handlers

  onPopState = () => {
    if (event.state && event.state.turbolinks) {
      const turbo_location = Turbolinks.Location.box(location)
      this.delegate.locationChangedByActor(turbo_location, "history")
    }
  }

  // Private

  update(method, location) {
    history[method + "State"](this.state, null, location)
  }
}
