Turbolinks.Snapshot = class Snapshot {
  static fromHTML(html) {
    const element = document.createElement("html")
    element.innerHTML = html
    return new this({
        head: element.querySelector("head"),
        body: element.querySelector("body")
      })
  }

  constructor({ head, body, scrollLeft, scrollTop }) {
    this.head = head
    this.body = body
    this.scrollLeft = scrollLeft || 0
    this.scrollTop = scrollTop || 0
  }

  hasSameRemoteHeadElementsAsSnapshot(snapshot) {
    return this.getRemoteHeadStyleElementSet().isEqualTo(snapshot.getRemoteHeadStyleElementSet()) &&
             this.getRemoteHeadScriptElementSet().isEqualTo(snapshot.getRemoteHeadScriptElementSet())
  }

  getInlineHeadElementsNotPresentInSnapshot(snapshot) {
    const inlineStyleElements = this.getInlineHeadStyleElementSet().getElementsNotPresentInSet(snapshot.getInlineHeadStyleElementSet())
    const inlineScriptElements = this.getInlineHeadScriptElementSet().getElementsNotPresentInSet(snapshot.getInlineHeadScriptElementSet())
    return inlineStyleElements.getElements().concat(inlineScriptElements.getElements())
  }

  getTemporaryHeadElements() {
    return this.getTemporaryHeadElementSet().getElements()
  }

  getPermanentBodyElements() {
    return this.body.querySelectorAll("[id][data-turbolinks-permanent]")
  }

  // Private

  getInlineHeadStyleElementSet() {
    const inlineHeadStyleElementSet = this.getPermanentHeadElementSet().selectElementsMatchingSelector("style")
    if (inlineHeadStyleElementSet) {
      this.inlineHeadStyleElementSet = inlineHeadStyleElementSet
      return inlineHeadStyleElementSet
    }
  }

  getRemoteHeadStyleElementSet() {
    const remoteHeadStyleElementSet = this.getPermanentHeadElementSet().selectElementsMatchingSelector("link[rel=stylesheet]")
    if (remoteHeadStyleElementSet) {
      this.remoteHeadStyleElementSet = remoteHeadStyleElementSet
      return remoteHeadStyleElementSet
    }
  }

  getInlineHeadScriptElementSet() {
    const inlineHeadScriptElementSet = this.getPermanentHeadElementSet().selectElementsMatchingSelector("script:not([src])")
    if (inlineHeadScriptElementSet) {
      this.inlineHeadScriptElementSet = inlineHeadScriptElementSet
      return inlineHeadScriptElementSet
    }
  }

  getRemoteHeadScriptElementSet() {
    const remoteHeadScriptElementSet = this.getPermanentHeadElementSet().selectElementsMatchingSelector("script[src]")
    if (remoteHeadScriptElementSet) {
      this.remoteHeadScriptElementSet = remoteHeadScriptElementSet
      return remoteHeadScriptElementSet
    }
  }

  getPermanentHeadElementSet() {
    const permanentHeadElementSet = this.getHeadElementSet().selectElementsMatchingSelector("style, link[rel=stylesheet], script")
    if (permanentHeadElementSet) {
      this.permanentHeadElementSet = permanentHeadElementSet
      return permanentHeadElementSet
    }
  }

  getTemporaryHeadElementSet() {
    const temporaryHeadElementSet = this.getHeadElementSet().rejectElementsMatchingSelector("style, link[rel=stylesheet], script")
    if (temporaryHeadElementSet) {
      this.temporaryHeadElementSet = temporaryHeadElementSet
      return temporaryHeadElementSet
    }
  }

  getHeadElementSet() {
    const headElementSet = new Turbolinks.ElementSet(this.head.childNodes)
    if (headElementSet) {
      return headElementSet
    }
  }
}
