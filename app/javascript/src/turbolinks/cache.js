Turbolinks.Cache = class Cache {
  constructor() {
    this.entries = {}
  }

  put(url, snapshot) {
    return this.entries[url] = snapshot
  }

  get(url) {
    return this.entries[url]
  }
}
