Turbolinks.Cache = class Cache {
  constructor() {
    this.entries = {}
  }

  put(location, snapshot) {
    const turbo_location = Turbolinks.Location.box(location)
    return this.entries[turbo_location.toCacheKey()] = snapshot
  }

  get(location) {
    const turbo_location = Turbolinks.Location.box(location)
    return this.entries[turbo_location.toCacheKey()]
  }
}
