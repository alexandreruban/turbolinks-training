Turbolinks.Cache = class Cache {
  constructor() {
    this.entries = {}
  }

  put(url, snapshot) {
    this.entries[url] = snapshot
  }

  get(url) {
    this.entries[url]
  }
}
