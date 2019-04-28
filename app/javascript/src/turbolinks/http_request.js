Turbolinks.HttpRequest = class HttpRequest {
  constructor(delegate, location) {
    this.delegate = delegate
    this.location = location
    this.xhr = new XMLHttpRequest
    this.xhr.open("GET", this.location.requestURL, true)
    this.xhr.setRequestHeader("Accept", "text/html, application/xhtml+xml, application/xml")
    this.xhr.onloadend = this.requestLoaded
    this.xhr.onerror = this.requestFailed
    this.xhr.onabort = this.requestAborted
  }

  send() {
    if (this.xhr && !this.sent) {
      this.xhr.send()
      return this.sent = true
    }
  }

  abort() {
    if (this.xhr && this.sent) {
      this.xhr.abort()
    }
  }

  // XMLHttpRequest events

  requestLoaded = () => {
    if (200 <= this.xhr.status && this.xhr.status < 300) {
      this.delegate.requestCompletedWithResponse(this.xhr.responseText)
    } else {
      this.delegate.requestFailedWithStatusCode(this.xhr.status, this.xhr.responseText)
    }
    this.destroy()
  }

  requestFailed = () => {
    this.delegate.requestFailedWithStatusCode(null)
    this.destroy()
  }

  requestAborted = () => {
    this.destroy()
  }

  // Private

  destroy() {
    this.delegate = null
    this.xhr = null
  }
}
