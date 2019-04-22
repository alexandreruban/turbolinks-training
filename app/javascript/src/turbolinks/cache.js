Turbolinks.Cache = class Cache {
  constructor() {
    this.entries = {}
  }

  put(location, snapshot) {
    return this.entries[location] = snapshot
  }

  get(location) {
    return this.entries[location]
  }
}
