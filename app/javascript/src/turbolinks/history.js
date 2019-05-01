Turbolinks.History = class History {
  constructor(delegate) {
    this.delegate = delegate
  }

  start() {
    if (!this.started) {
      this.update("replace", null)
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
    this.update("push", turbo_location)
  }

  replace(location) {
    const turbo_location = Turbolinks.Location.box(location)
    this.update("replace", turbo_location)
  }

  // Event handlers

  onPopState = (event) => {
    if (event.state && event.state.turbolinks) {
      const turbolinks = event.state.turbolinks
      const turbo_location = Turbolinks.Location.box(window.location)
      this.restorationIdentifier = turbolinks.restorationIdentifier
      this.delegate.historyPoppedToLocationWithRestaurationIdentifier(turbo_location, this.restorationIdentifier)
    }
  }

  // Private

  update(method, location) {
    const state = this.createState()
    this.restorationIdentifier = state.restorationIdentifier
    history[method + "State"](state, null, location)
  }

  createState = () => {
    time = new Date().getTime()
    entropy = Math.floor(Math.random() * 1000, 10) + 1
    return {
      turbolinks: {
        restorationIdentifier: `${time}.${entropy}`
      }
    }
  }
}
