Turbolinks.ProgressBar = class ProgressBar {
    static ANIMAMTION_DURATION = 300;
    static defaultCSS = `
      .turbolinks-progress-bar {
        position: fixed;
        display = block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 9999;
        transition: width ${this.ANIMAMTION_DURATION}ms ease-out, opacity ${this.ANIMAMTION_DURATION / 2}ms ${this.ANIMAMTION_DURATION / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;

  constructor() {
    this.stylesheetElement = this.createStylesheetElement()
    this.progressElement = this.createProgressElement()
  }

  show() {
    if (!this.visible) {
      this.visible = true
      this.installStyleSheetElement()
      this.installProgressElement()
      this.startTrickling()
    }
  }

  hide() {
    if (this.visible && !this.hiding) {
      this.hiding = true
      this.fadeProgressElement(() => {
        this.uninstallProgressElement()
        this.stopTrickling()
        this.visible = false
        this.hiding = false
      })
    }
  }

  setValue(value) {
    this.value = value
    this.refresh()
  }

  // Private

  installStyleSheetElement() {
    document.head.insertBefore(this.stylesheetElement, document.head.firstChild)
  }

  installProgressElement() {
    this.progressElement.style.width = 0
    this.progressElement.style.opacity = 1
    document.documentElement.insertBefore(this.progressElement, document.body)
    this.refresh()
  }

  fadeProgressElement(callback) {
    this.progressElement.style.opacity = 0
    setTimeout(callback, this.constructor.ANIMAMTION_DURATION * 1.5)
  }

  uninstallProgressElement() {
    if (this.progressElement.parentNode) {
      document.documentElement.removeChild(this.progressElement)
    }
  }

  startTrickling() {
    if (!this.trickleInterval) {
      this.trickleInterval = setInterval(this.trickle, this.constructor.ANIMAMTION_DURATION)
    }
  }

  stopTrickling() {
    clearInterval(this.trickleInterval)
    this.trickleInterval = null
  }

  trickle = () => {
    this.setValue(this.value + Math.random() / 100)
  }

  refresh() {
    return requestAnimationFrame(() => {
      return this.progressElement.style.width = `${10 + (this.value * 90)}%`
    })
  }

  createStylesheetElement() {
    const element = document.createElement("style")
    element.type = "text/css"
    element.textContent = this.constructor.defaultCSS
    return element
  }

  createProgressElement() {
    const element = document.createElement("div")
    element.classList.add("turbolinks-progress-bar")
    return element
  }
}
