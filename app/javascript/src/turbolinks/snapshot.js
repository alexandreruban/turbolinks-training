Turbolinks.Snapshot = class Snapshot {
  static fromHTML(html) {
    const element = document.createElement("html")
    element.innerHTML = html
    return new this({
        head: element.querySelector("head"),
        body: element.querySelector("body")
      })
  }

  constructor({ head, body }) {
    this.head = head
    this.body = body
  }

  hasSameTrackedHeadElementsAsSnapshot(snapshot) {
    return this.getTrackedHeadElementSet().isEqualTo(snapshot.getTrackedHeadElementSet())
  }

  getInlineHeadElementsNotPresentInSnapshot(snapshot) {
    const inlineStyleElements = this.getInlineHeadStyleElementSet().getElementsNotPresentInSet(snapshot.getInlineHeadStyleElementSet())
    const inlineScriptElements = this.getInlineHeadScriptElementSet().getElementsNotPresentInSet(snapshot.getInlineHeadScriptElementSet())
    return inlineStyleElements.getElements().concat(inlineScriptElements.getElements())
  }

  getTemporaryHeadElements() {
    return this.getTemporaryHeadElementSet().getElements()
  }

  // Private

  getTrackedHeadElementSet() {
    const trackedHeadElementSet = this.getPermanentHeadElementSet().selectElementsMatchingSelector("[data-turbolinks-track=reload]")
    if (trackedHeadElementSet) {
      this.trackedHeadElementSet = trackedHeadElementSet
      return trackedHeadElementSet
    }
  }

  getInlineHeadStyleElementSet() {
    const inlineHeadStyleElementSet = this.getPermanentHeadElementSet().selectElementsMatchingSelector("style")
    if (inlineHeadStyleElementSet) {
      this.inlineHeadStyleElementSet = inlineHeadStyleElementSet
      return inlineHeadStyleElementSet
    }
  }

  getInlineHeadScriptElementSet() {
    const inlineHeadScriptElementSet = this.getPermanentHeadElementSet().selectElementsMatchingSelector("script:not([src])")
    if (inlineHeadScriptElementSet) {
      this.inlineHeadScriptElementSet = inlineHeadScriptElementSet
      return inlineHeadScriptElementSet
    }
  }

  getPermanentHeadElementSet() {
    const permanentHeadElementSet = this.getHeadElementSet().selectElementsMatchingSelector(
      "style, link[href], script, [data-turbolinks-track=reload]"
    )
    if (permanentHeadElementSet) {
      this.permanentHeadElementSet = permanentHeadElementSet
      return permanentHeadElementSet
    }
  }

  getTemporaryHeadElementSet() {
    const temporaryHeadElementSet = this.getHeadElementSet().getElementsNotPresentInSet(this.getPermanentHeadElementSet())
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
