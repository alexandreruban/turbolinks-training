Turbolinks.BrowserAdapter = class BrowserAdapter {
  constructor(delegate) {
    this.delegate = delegate
  }

  visitLocation(url) {
    this.delegate.getHistoryForAdapter().push(url)
  }

  locationChanged(url) {
    this.request(url)
  }

  snapshotRestored() {

  }

  // Private

  request(url) {
    if (this.xhr) {
      this.xhr.abort()
    }
    this.xhr = new XMLHttpRequest
    this.xhr.open("GET", url, true)
    this.xhr.setRequestHeader("Accept", "text/html, application/xhtml/xml, application/xml")
    this.xhr.onload = this.requestLoaded
    this.xhr.onerror = this.requestFailed
    this.xhr.send()
  }

  requestLoaded = () => {
    this.delegate.adapterLoadedResponse(this.xhr.responseText)
  }

  requestFailed = () => {
    this.xhr = null
  }
}
