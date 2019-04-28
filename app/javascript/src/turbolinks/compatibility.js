const translateEvent = ({ from, to }) => {
  const handler = (event) => {
    const compatible_event = Turbolinks.dispatch(to, {
        target: event.target,
        cancelable: event.cancelable,
        data: event.data
      }
    )
    if (compatible_event.defaultPrevented) {
      compatible_event.preventDefault()
    }
  }
  document.addEventListener(from, handler, false)
}

translateEvent({ from: "turbolinks:click", to: "page:before-change" })
translateEvent({ from: "turbolinks:snapshot-save", to: "page:before-unload" })
translateEvent({ from: "turbolinks:snapshot-load", to: "page:restore" })
translateEvent({ from: "turbolinks:load", to: "page:change" })
translateEvent({ from: "turbolinks:load", to: "page:update" })

if (typeof jQuery === "function") {
  jQuery(document).on("ajaxSuccess", (event, xhr, settings) => {
    if (jQuery.trim(xhr.responseText).length > 0) {
      Turbolinks.dispatch("page-update")
    }
  })
}
