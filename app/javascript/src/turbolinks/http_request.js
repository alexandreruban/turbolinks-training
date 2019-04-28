Turbolinks.HttpRequest = class HttpRequest {
  constructor(delegate, location) {
    this.delegate = delegate
    this.url = Turbolinks.Location.box(location).requestURL
    this.createXHR()
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
    this.endRequest(() => {
      if (200 <= this.xhr.status && this.xhr.status < 300) {
        this.delegate.requestCompletedWithResponse(this.xhr.responseText)
      } else {
        this.delegate.requestFailedWithStatusCode(this.xhr.status, this.xhr.responseText)
      }
    })
  }

  requestFailed = () => {
    this.endRequest(() => {
      this.delegate.requestFailedWithStatusCode(null)
    })
  }

  requestAborted = () => {
    this.endRequest()
  }

  // Private

  createXHR() {
    this.xhr = new XMLHttpRequest
    this.xhr.open("GET", this.url, true)
    this.xhr.setRequestHeader("Accept", "text/html, application/xhtml+xml, application/xml")
    this.xhr.onprogress = this.requestProgressed
    this.xhr.onloadend = this.requestLoaded
    this.xhr.onerror = this.requestFailed
    this.xhr.onabort = this.requestAborted
  }

  endRequest(callback) {
    this.notifyApplicationAfterRequestEnd()
    if(typeof callback === "function") {
      callback.call(this)
    }
    this.destroy()
  }

  notifyApplicationBeforeRequestStart() {
    Turbolinks.dispatch("turbolinks:request-start", {
      data: { url: this.url, xhr: this.xhr }
    })
  }

  notifyApplicationAfterRequestEnd() {
    Turbolinks.dispatch("turbolinks:request-end", {
      data: { url: this.url, xhr: this.xhr }
    })
  }

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
