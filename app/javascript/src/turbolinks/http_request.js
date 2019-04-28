Turbolinks.HttpRequest = class HttpRequest {
  constructor(delegate, location) {
    this.delegate = delegate
    this.location = Turbolinks.Location.box(location)
    this.xhr = new XMLHttpRequest
    this.xhr.open("GET", this.location.requestURL, true)
    this.xhr.setRequestHeader("Accept", "text/html, application/xhtml+xml, application/xml")
    this.xhr.onprogress = this.requestProgressed
    this.xhr.onloadend = this.requestLoaded
    this.xhr.onerror = this.requestFailed
    this.xhr.onabort = this.requestAborted
  }

  send() {
    if (this.xhr && !this.sent) {
      this.setProgress(0)
      this.xhr.send()
      this.sent = true
      this.delegate.requestStarted()
    }
  }

  abort() {
    if (this.xhr && this.sent) {
      this.xhr.abort()
    }
  }

  // XMLHttpRequest events

  requestProgressed = (event) => {
    if (event.lengthComputable) {
      this.setProgress(event.loaded / event.total)
    }
  }

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

  setProgress(progress) {
    this.progress = progress
    this.delegate.requestProgressed(this.progress)
  }

  destroy() {
    this.setProgress(1)
    this.delegate.requestFinished()
    this.delegate = null
    this.xhr = null
  }
}
