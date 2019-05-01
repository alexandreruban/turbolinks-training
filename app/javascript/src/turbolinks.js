Turbolinks = {
  supported: true,

  visit(location, options) {
    Turbolinks.controller.visit(location, options)
  }
}
