Turbolinks.Cache = class Cache {
  constructor(size) {
    this.size = size
    this.keys = []
    this.snapshots = {}
  }

  has(location) {
    const key = this.keyForLocation(location)
    return key in this.snapshots
  }

  get(location) {
    if (!this.has(location)) { return }

    const snapshot = this.read(location)
    this.touch(location)
    return snapshot
  }

  put(location, snapshot) {
    this.write(location, snapshot)
    this.touch(location)
    return snapshot
  }

  // Private

  read(location) {
    const key = this.keyForLocation(location)
    return this.snapshots[key]
  }

  write(location, snapshot) {
    key = this.keyForLocation(location)
    return this.snapshots[key] = snapshot
  }

  touch(location) {
    const key = this.keyForLocation(location)
    const index = this.keys.indexOf(location)
    this.keys.splice(index, 1)
    this.keys.unshift(key)
    this.trim()
  }

  trim() {
    this.keys.splice(this.size).forEach((key) => delete this.snapshots[key])
  }

  keyForLocation(location) {
    return Turbolinks.Location.box(location).toCacheKey()
  }
}
