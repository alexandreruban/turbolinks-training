Turbolinks.Location = class Location {
  static box(value) {
    if (value instanceof this) {
      return value
    } else {
      return new this(value)
    }
  }

  constructor(url = "") {
    const linkWithAnchor = document.createElement("a")
    linkWithAnchor.href = url.toString()
    this.absoluteURL = linkWithAnchor.href

    if (linkWithAnchor.hash.length < 2) {
      this.requestURL = this.absoluteURL
    } else {
      const linkWithoutAnchor = linkWithAnchor.cloneNode()
      linkWithoutAnchor.hash = ""
      this.requestURL = linkWithoutAnchor.href
    }
  }

  getOrigin() {
    return this.absoluteURL.split("/", 3).join("/")
  }

  isSameOrigin() {
    return this.getOrigin() === (new this.constructor).getOrigin()
  }

  toCacheKey() {
    return this.requestURL
  }

  toJSON() {
    return this.absoluteURL
  }

  toString() {
    return this.absoluteURL
  }

  valueOf() {
    return this.absoluteURL
  }
}
