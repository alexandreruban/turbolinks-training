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

    const anchorLength = linkWithAnchor.hash.length

    if (anchorLength < 2) {
      this.requestURL = this.absoluteURL
    } else {
      this.requestURL = this.absoluteURL.slice(0, -anchorLength)
      this.anchor = linkWithAnchor.hash.slice(1)
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
